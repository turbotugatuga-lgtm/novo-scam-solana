// ---- GIFs por nível de risco -----------------------------------------------
const gifsHigh = [
  "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3o6ZsX6dMhrAzK6aLa/giphy.gif",
  "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif",
  "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/l4KibK3JwaVo0CjDO/giphy.gif",
  "https://media.giphy.com/media/26BkNrGhy4DKnbD9u/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/26AOsbfXkUZx4/giphy.gif"
];

const gifsMedium = [
  "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif",
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
  "https://media.giphy.com/media/3o7TKCk06oCwn1P3DO/giphy.gif",
  "https://media.giphy.com/media/l0HlF1m3slRzq9qLu/giphy.gif",
  "https://media.giphy.com/media/3o7qE1YN7aBOFPRw8E/giphy.gif",
  "https://media.giphy.com/media/l4pTdcif6uY3iI3kE/giphy.gif",
  "https://media.giphy.com/media/26BkNrGhy4DKnbD9u/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif"
];

const gifsLow = [
  "https://media.giphy.com/media/3orieYxFwPfaW5n4Ck/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/26xBwdIuRJiAIqHwA/giphy.gif",
  "https://media.giphy.com/media/l4Hnq5CcYJ1b6B8Pu/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
  "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif",
  "https://media.giphy.com/media/l4pTdcif6uY3iI3kE/giphy.gif",
  "https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif",
  "https://media.giphy.com/media/xT0GqssRweIhlz209i/giphy.gif"
];

// ---- Helpers ---------------------------------------------------------------
function fmt(v) {
  if (v === null || v === undefined || v === "N/A") return "N/A";
  if (typeof v === "number") {
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
  if (!/^https?:\/\//i.test(u)) return u;
  return u;
}

function pickRandomGif(score) {
  let arr = gifsMedium;
  if(score < 40) arr = gifsHigh;
  if(score > 80) arr = gifsLow;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickScoreColor(score) {
  if(score < 40) return "red";
  if(score > 80) return "green";
  return "orange";
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
    `Website: ${report.website}`,
    report.socials && report.socials.length ? `Socials: ${report.socials.join(", ")}` : "",
    riskMsg,
    `Meme: ${riskGif}`,
    `Check on Turbo Tuga Scam Detector: ${location.href}`
  ].filter(Boolean);
  return lines.join("\n");
}

// ---- Main ------------------------------------------------------------------
async function generateReport() {
  let mintRaw = document.getElementById("tokenInput").value.trim();
  if (mintRaw.includes("?")) mintRaw = mintRaw.split("?")[0];
  if (mintRaw.includes("&")) mintRaw = mintRaw.split("&")[0];
  const mint = mintRaw;

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

  try {
    // ---- 1) Shyft / RPC ----
    const shyftRes = await fetch(`https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`, { headers: { "x-api-key": shyftKey } });
    const shyftData = await shyftRes.json();
    if (shyftData.success && shyftData.result) {
      const d = shyftData.result;
      report.name = d.name || report.name;
      report.symbol = d.symbol || report.symbol;
      report.supply = d.supply || report.supply;
      report.decimals = d.decimals || report.decimals;
      report.mintAuthority = d.mint_authority || "Revoked";
      report.freezeAuthority = d.freeze_authority || "None";
    }

    // ---- 2) Birdeye ----
    if (birdeyeKey) {
      const beRes = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${mint}`, { headers: { "X-API-KEY": birdeyeKey } });
      const beData = await beRes.json();
      if (beData.success && beData.data) {
        report.price = beData.data.price || report.price;
        report.volume24h = beData.data.volume24h || report.volume24h;
        report.liquidity = beData.data.liquidity || report.liquidity;
        report.marketCap = beData.data.mc || report.marketCap;
      }
    }

    // ---- 3) Jupiter fallback ----
    try {
      const jupRes = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`);
      const jupData = await jupRes.json();
      if (jupData.data && jupData.data[mint]) report.price = jupData.data[mint].price || report.price;
    } catch(e){}

    // ---- 4) Score ----
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
    } else score -= 10;

    if (report.supply !== "N/A" && report.decimals !== "N/A") score += 5;
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    let riskMsg = "⚠️ Medium risk — caution advised";
    if (score < 40) riskMsg = "❌ High risk — possible scam!";
    if (score > 80) riskMsg = "✅ Low risk — safer token";

    const riskGif = pickRandomGif(score);

    // ---- Render ----
    const html = `
      <div id="reportContent">
        <h2>Token Report</h2>
        <div class="kv"><div class="key">Name / Symbol</div><div class="val"><b>${report.name}</b> (${report.symbol})</div></div>
        <div class="kv"><div class="key">Mint</div><div class="val">${mint}</div></div>
        <div class="kv"><div class="key">Score</div><div class="val" style="color:${pickScoreColor(score)};"><b>${score}/100</b></div></div>
        <div class="kv"><div class="key">Price</div><div class="val">${fmt(report.price)}</div></div>
        <div class="kv"><div class="key">24h Volume</div><div class="val">${fmt(report.volume24h)}</div></div>
        <div class="kv"><div class="key">Liquidity</div><div class="val">${fmt(report.liquidity)}</div></div>
        <div class="kv"><div class="key">Market Cap</div><div class="val">${fmt(report.marketCap)}</div></div>
        <div class="kv"><div class="key">Supply / Decimals</div><div class="val">${fmt(report.supply)} / ${fmt(report.decimals)}</div></div>
        <div class="kv"><div class="key">Holders</div><div class="val">${fmt(report.holders)}</div></div>
        <div class="kv"><div class="key">Mint Authority</div><div class="val">${report.mintAuthority}</div></div>
        <div class="kv"><div class="key">Freeze Authority</div><div class="val">${report.freezeAuthority}</div></div>
        <div class="kv"><div class="key">Website</div><div class="val"><a href="${sanitizeUrl(report.website)}" target="_blank">${sanitizeUrl(report.website)}</a></div></div>
        <p>${riskMsg}</p>
        <img src="${riskGif}" class="gif-animated" style="width:200px; animation: jump 1s infinite alternate;" />
        <hr>
        <button onclick="exportPDF()">📄 Export PDF</button>
        <button onclick="shareReport()">📢 Share Report</button>
      </div>
    `;
    document.getElementById("report").innerHTML = html;

    // ---- Atualiza links fixos ----
    document.getElementById("btnOrca").href = `https://www.orca.so/?tokenIn=${mint}&tokenOut=So11111111111111111111111111111111111111112`;
    document.getElementById("btnJupiter").href = `https://jup.ag/swap?sell=${mint}&buy=So11111111111111111111111111111111111111112`;
    document.getElementById("btnDonate").href = `https://explorer.solana.com/address/${mint}`;

    // ---- Export / Share ----
    window.currentReport = { report, mint, score, riskMsg, riskGif };

  } catch(err) {
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Error generating report. Check API keys.`;
  }
}

// ---- Export PDF placeholder -----------------------------------------------
function exportPDF() {
  alert("📄 PDF export coming soon!");
}

// ---- Share ----------------------------------------------------------------
function shareReport() {
  const r = window.currentReport;
  if (!r) { alert("Generate report first!"); return; }
  const text = buildShareText(r);
  if (navigator.share) {
    navigator.share({ title:"Turbo Tuga Token Report", text, url:window.location.href });
  } else {
    prompt("Copy report text:", text);
  }
}
