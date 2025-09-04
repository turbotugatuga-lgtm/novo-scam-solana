// ---- Helpers ---------------------------------------------------------------
function fmt(v) {
  if (v === null || v === undefined || v === "N/A") return "N/A";
  if (typeof v === "number") {
    // human friendly
    if (v >= 1e12) return (v/1e12).toFixed(2) + " T";
    if (v >= 1e9)  return (v/1e9).toFixed(2) + " B";
    if (v >= 1e6)  return (v/1e6).toFixed(2) + " M";
    if (v >= 1e3)  return (v/1e3).toFixed(2) + " K";
    return v.toString();
  }
  return v;
}

function sanitizeUrl(u) {
  if (!u) return "N/A";
  if (typeof u !== "string") return "N/A";
  if (!/^https?:\/\//i.test(u)) return u; // show as is if missing protocol
  return u;
}

function buildShareText({report, mint, score, riskMsg, riskGif}) {
  const lines = [
    "🚨 Turbo Tuga Token Report",
    `Name: ${report.name} (${report.symbol})`,
    `Mint: ${mint}`,
    `Score: ${score}/100`,
    `Price: ${fmt(report.price)}${report.price!== "N/A" ? " USD" : ""}`,
    `24h Volume: ${fmt(report.volume24h)}`,
    `Liquidity: ${fmt(report.liquidity)}`,
    `Market Cap: ${fmt(report.marketCap)}`,
    `Supply / Decimals: ${fmt(report.supply)} / ${fmt(report.decimals)}`,
    `Holders: ${fmt(report.holders)}`,
    `Mint authority: ${report.mintAuthority}`,
    `Freeze authority: ${report.freezeAuthority}`,
    `Website: ${report.website !== "N/A" ? report.website : "N/A"}`,
    report.socials && report.socials.length ? `Socials:\n- ${report.socials.join("\n- ")}` : "",
    "",
    riskMsg,
    `Meme: ${riskGif}`,
    "",
    `Check on Turbo Tuga Scam Detector: ${location.href}`
  ].filter(Boolean);
  return lines.join("\n");
}

function pickRiskGif(score) {
  // médio padrão (doge confuso)
  let gif = "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif";
  if (score < 40) {
    gif = "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif"; // pepe chorando
  } else if (score > 80) {
    gif = "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"; // musk rocket
  }
  return gif;
}

// ---- Main ------------------------------------------------------------------
async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  if (!mint) {
    alert("Please enter a token mint address.");
    return;
  }

  const shyftKey = window.CONFIG.SHYFT_API_KEY;
  const birdeyeKey = window.CONFIG.BIRDEYE_API_KEY;

  const report = {
    name: "Unknown",
    symbol: "Unknown",
    supply: "N/A",
    decimals: "N/A",
    holders: "N/A",
    mintAuthority: "N/A",
    freezeAuthority: "N/A",
    price: "N/A",
    volume24h: "N/A",
    liquidity: "N/A",
    marketCap: "N/A",
    website: "N/A",
    socials: []
  };

  // ---- 1) Shyft first -----------------------------------------------------
  let shyftOk = false;
  try {
    const shyftRes = await fetch(
      `https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`,
      { headers: { "x-api-key": shyftKey } }
    );
    const shyftData = await shyftRes.json();
    if (shyftData?.success && shyftData?.result) {
      const d = shyftData.result;
      report.name = d.name || report.name;
      report.symbol = d.symbol || report.symbol;
      report.supply = d.supply ?? report.supply;
      report.decimals = d.decimals ?? report.decimals;
      report.mintAuthority = d.mint_authority || "Revoked";
      report.freezeAuthority = d.freeze_authority || "None";
      report.holders = d.holder ?? report.holders;
      if (d.extensions) {
        report.website = d.extensions.website || report.website;
        if (d.extensions.twitter) report.socials.push(d.extensions.twitter);
        if (d.extensions.discord) report.socials.push(d.extensions.discord);
        if (d.extensions.telegram) report.socials.push(d.extensions.telegram);
      }
      shyftOk = true;
    }
  } catch (e) {
    console.warn("Shyft error", e);
  }

  // ---- 2) Solscan fallback (metadata) -------------------------------------
  if (!shyftOk) {
    try {
      const solscanRes = await fetch(`https://public-api.solscan.io/token/meta?tokenAddress=${mint}`);
      const s = await solscanRes.json();
      if (s) {
        report.name = s.name || report.name;
        report.symbol = s.symbol || report.symbol;
        report.decimals = s.decimals ?? report.decimals;
        report.supply = (s.totalSupply ?? s.supply) ?? report.supply;
        report.holders = s.holder ?? report.holders;
        if (s.website) report.website = s.website;
        if (Array.isArray(s.socials)) {
          // sometimes solscan returns array of links
          s.socials.forEach(link => report.socials.push(link));
        }
      }
    } catch (e) {
      console.warn("Solscan error", e);
    }
  }

  // ---- 3) Birdeye (market data) -------------------------------------------
  let birdeyeOk = false;
  if (birdeyeKey) {
    try {
      const beRes = await fetch(
        `https://public-api.birdeye.so/defi/token_overview?address=${mint}`,
        { headers: { "X-API-KEY": birdeyeKey } }
      );
      const be = await beRes.json();
      if (be?.success && be?.data) {
        report.price = be.data.price ?? report.price;
        report.volume24h = be.data.volume24h ?? report.volume24h;
        report.liquidity = be.data.liquidity ?? report.liquidity;
        report.marketCap = be.data.mc ?? report.marketCap;
        birdeyeOk = true;
      }
    } catch (e) {
      console.warn("Birdeye overview error", e);
    }

    // price endpoint (optional refine)
    if (!birdeyeOk) {
      try {
        const bePriceRes = await fetch(
          `https://public-api.birdeye.so/defi/token_price?address=${mint}`,
          { headers: { "X-API-KEY": birdeyeKey } }
        );
        const beP = await bePriceRes.json();
        if (beP?.success && beP?.data) {
          report.price = beP.data.value ?? report.price;
        }
      } catch (e) {
        console.warn("Birdeye price error", e);
      }
    }
  }

  // ---- 4) Jupiter price fallback ------------------------------------------
  try {
    const jupRes = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`);
    const jup = await jupRes.json();
    if (jup?.data && jup.data[mint]) {
      report.price = jup.data[mint].price ?? report.price;
    }
  } catch (e) {
    console.warn("Jupiter price fetch failed", e);
  }

  // ---- Score calculation ---------------------------------------------------
  // Base 65, penalizações e bônus
  let score = 65;
  if (report.mintAuthority !== "Revoked") score -= 20;
  if (report.freezeAuthority !== "None") score -= 10;

  const holdersNum = Number(report.holders);
  if (!isNaN(holdersNum)) {
    if (holdersNum < 50) score -= 20;
    if (holdersNum > 500) score += 10;
  }

  const liqNum = Number(report.liquidity);
  if (!isNaN(liqNum)) {
    if (liqNum < 1000) score -= 15;
    if (liqNum > 100000) score += 10;
  } else {
    score -= 10; // sem liquidez informada
  }

  if (report.supply !== "N/A" && report.decimals !== "N/A") score += 5;
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  // Mensagem + GIF
  let riskMsg = "⚠️ Medium risk — caution advised";
  if (score < 40) riskMsg = "❌ High risk — possible scam!";
  if (score > 80) riskMsg = "✅ Low risk — safer token";
  const riskGif = pickRiskGif(score);

  // ---- Render --------------------------------------------------------------
  const socialsHtml = (report.socials && report.socials.length)
    ? `<div class="kv"><div class="key">Socials</div><div class="val">${report.socials.map(s => `<a href="${sanitizeUrl(s)}" target="_blank" rel="noopener">${s}</a>`).join("<br>")}</div></div>`
    : "";

  const html = `
    <div id="reportContent">
      <h2>Token Report</h2>
      <div class="kv"><div class="key">Name / Symbol</div><div class="val"><b>${report.name}</b> (${report.symbol})</div></div>
      <div class="kv"><div class="key">Mint</div><div class="val">${mint}</div></div>
      <div class="kv"><div class="key">Score</div><div class="val"><b>${score}/100</b></div></div>
      <div class="kv"><div class="key">Price</div><div class="val">${fmt(report.price)}${report.price!=="N/A" ? " USD" : ""}</div></div>
      <div class="kv"><div class="key">24h Volume</div><div class="val">${fmt(report.volume24h)}</div></div>
      <div class="kv"><div class="key">Liquidity</div><div class="val">${fmt(report.liquidity)}</div></div>
      <div class="kv"><div class="key">Market Cap</div><div class="val">${fmt(report.marketCap)}</div></div>
      <div class="kv"><div class="key">Supply / Decimals</div><div class="val">${fmt(report.supply)} / ${fmt(report.decimals)}</div></div>
      <div class="kv"><div class="key">Holders</div><div class="val">${fmt(report.holders)}</div></div>
      <div class="kv"><div class="key">Mint Authority</div><div class="val">${report.mintAuthority}</div></div>
      <div class="kv"><div class="key">Freeze Authority</div><div class="val">${report.freezeAuthority}</div></div>
      <div class="kv"><div class="key">Website</div><div class="val">${report.website !== "N/A" ? `<a href="${sanitizeUrl(report.website)}" target="_blank" rel="noopener">${report.website}</a>` : "N/A"}</div></div>
      ${socialsHtml}
      <hr />
      <div class="kv"><div class="key">Risk</div><div class="val">${riskMsg}</div></div>
      <div class="meme"><img src="${riskGif}" alt="Risk meme"></div>

      <div class="note">
        <b>How we score:</b><br>
        Base 65. Penalties: Mint Authority active (-20), Freeze Authority active (-10), Holders &lt; 50 (-20), Liquidity &lt; $1,000 (-15).<br>
        Bonuses: Liquidity &gt; $100k (+10), Holders &gt; 500 (+10), Supply/Decimals valid (+5).
      </div>
    </div>

    <hr />
    <div class="actions">
      <button onclick="exportPDF()">📄 Export PDF</button>
      <button onclick="shareNative()">📢 Share (Native)</button>
      <button onclick='shareTwitter(${JSON.stringify(mint)}, ${score}, ${JSON.stringify(riskGif)})'>🐦 Twitter</button>
      <button onclick='shareTelegram(${JSON.stringify(mint)}, ${score}, ${JSON.stringify(riskGif)})'>📲 Telegram</button>
      <button onclick='copyFullReport(${JSON.stringify(mint)}, ${score}, ${JSON.stringify(riskMsg)}, ${JSON.stringify(riskGif)})'>📋 Copy full report</button>
    </div>
  `;

  document.getElementById("report").innerHTML = html;
}

// ---- PDF export ------------------------------------------------------------
function exportPDF() {
  const el = document.getElementById("reportContent");
  const opt = {
    margin: 0.5,
    filename: "TurboTuga-Token-Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true }, // tenta carregar GIF externo
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };
  html2pdf().set(opt).from(el).save();
}

// ---- Share (Native) --------------------------------------------------------
function shareNative() {
  const mint = document.getElementById("tokenInput").value.trim();
  const rc = document.getElementById("reportContent");
  if (!rc) return alert("Generate a report first.");
  const text = rc.innerText;
  if (navigator.share) {
    navigator.share({ title: "Turbo Tuga Token Report", text, url: location.href })
      .catch(err => console.warn("Share cancelled/failed", err));
  } else {
    alert("Native share not supported here. Use Twitter/Telegram buttons.");
  }
}

// ---- Share Twitter/Telegram (texto + link do GIF) --------------------------
function shareTwitter(mint, score, riskGif) {
  const report = extractCurrentReport();
  const text = buildShareText({report, mint, score, riskMsg: getRiskMsgFromDOM(), riskGif});
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener");
}

function shareTelegram(mint, score, riskGif) {
  const report = extractCurrentReport();
  const text = buildShareText({report, mint, score, riskMsg: getRiskMsgFromDOM(), riskGif});
  const url = `https://t.me/share/url?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}

// ---- Copy full report to clipboard ----------------------------------------
async function copyFullReport(mint, score, riskMsg, riskGif) {
  const report = extractCurrentReport();
  const text = buildShareText({report, mint, score, riskMsg, riskGif});
  try {
    await navigator.clipboard.writeText(text);
    alert("Report copied to clipboard! Paste it anywhere.");
  } catch (e) {
    console.warn(e);
    alert("Could not copy. Your browser may block clipboard access.");
  }
}

// ---- Extract current report from DOM (for sharing) -------------------------
function extractCurrentReport() {
  // tries to read rendered values back from DOM for consistency
  const kv = (key) => {
    const rows = document.querySelectorAll("#reportContent .kv");
    for (const row of rows) {
      const k = row.querySelector(".key")?.innerText?.trim();
      const v = row.querySelector(".val")?.innerText?.trim();
      if (k && v && k.toLowerCase().includes(key.toLowerCase())) return v;
    }
    return "N/A";
  };
  const socialsNodes = document.querySelectorAll("#reportContent .kv .val a");
  const socials = Array.from(socialsNodes).map(a => a.href);

  return {
    name: kv("Name").split("(")[0]?.trim() || "Unknown",
    symbol: (kv("Name").match(/\((.*?)\)/)?.[1]) || "Unknown",
    price: kv("Price"),
    volume24h: kv("24h Volume"),
    liquidity: kv("Liquidity"),
    marketCap: kv("Market Cap"),
    supply: kv("Supply / Decimals").split("/")[0]?.trim() || "N/A",
    decimals: kv("Supply / Decimals").split("/")[1]?.trim() || "N/A",
    holders: kv("Holders"),
    mintAuthority: kv("Mint Authority"),
    freezeAuthority: kv("Freeze Authority"),
    website: kv("Website"),
    socials
  };
}

function getRiskMsgFromDOM() {
  const rows = document.querySelectorAll("#reportContent .kv");
  for (const row of rows) {
    const k = row.querySelector(".key")?.innerText?.trim();
    const v = row.querySelector(".val")?.innerText?.trim();
    if (k && v && k.toLowerCase().includes("risk")) return v;
  }
  return "";
}
