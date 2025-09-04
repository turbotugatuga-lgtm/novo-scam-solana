import { Connection, PublicKey } from "@solana/web3.js";

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

// ---- GIFs por nível de risco -----------------------------------------------
const gifs = {
  high: [
    "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
    "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"
  ],
  medium: [
    "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif",
    "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"
  ],
  low: [
    "https://media.giphy.com/media/3orieYxFwPfaW5n4Ck/giphy.gif",
    "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif"
  ]
};

function pickRandomGif(score) {
  let arr = gifs.medium;
  if(score < 40) arr = gifs.high;
  if(score > 80) arr = gifs.low;
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickScoreColor(score) {
  if(score < 40) return "red";
  if(score > 80) return "green";
  return "orange";
}

// ---- Construir texto para compartilhar ------------------------------------
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
  const connection = new Connection("https://api.mainnet-beta.solana.com");

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

  // ---- 1) RPC on-chain ----------------------------------------------------
  try {
    const mintPubkey = new PublicKey(mint);
    const mintInfo = await connection.getParsedAccountInfo(mintPubkey);
    const data = mintInfo.value?.data?.parsed?.info;
    if (data) {
      report.supply = data.supply ?? report.supply;
      report.decimals = data.decimals ?? report.decimals;
      report.mintAuthority = data.mintAuthority ?? "Revoked";
      report.freezeAuthority = data.freezeAuthority ?? "None";
    }
  } catch(e) { console.warn("RPC error:", e); }

  // ---- 2) Solscan metadata -----------------------------------------------
  try {
    const res = await fetch(`https://public-api.solscan.io/token/meta?tokenAddress=${mint}`);
    const s = await res.json();
    if (s) {
      report.name = s.name ?? report.name;
      report.symbol = s.symbol ?? report.symbol;
      report.holders = s.holder ?? report.holders;
      if (s.website) report.website = s.website;
      if (Array.isArray(s.socials)) s.socials.forEach(link => report.socials.push(link));
    }
  } catch(e){ console.warn("Solscan error:", e); }

  // ---- 3) Jupiter price --------------------------------------------------
  try {
    const jupRes = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`);
    const jup = await jupRes.json();
    if (jup?.data && jup.data[mint]) report.price = jup.data[mint].price ?? report.price;
  } catch(e){ console.warn("Jupiter error:", e); }

  // ---- 4) Birdeye optional ------------------------------------------------
  if (birdeyeKey) {
    try {
      const beRes = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${mint}`, { headers: { "X-API-KEY": birdeyeKey } });
      const be = await beRes.json();
      if (be?.success && be?.data) {
        report.price = be.data.price ?? report.price;
        report.volume24h = be.data.volume24h ?? report.volume24h;
        report.liquidity = be.data.liquidity ?? report.liquidity;
        report.marketCap = be.data.mc ?? report.marketCap;
      }
    } catch(e){ console.warn("Birdeye error:", e); }
  }

  // ---- Score -------------------------------------------------------------
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

  // ---- Render ------------------------------------------------------------
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
      <img src="${riskGif}" class="gif-animated" />
      <hr>
      <button onclick="exportPDF()">📄 Export PDF</button>
      <button onclick="shareReport()">📢 Share Report</button>
    </div>
  `;
  reportDiv.innerHTML = html;

  // ---- Atualiza links fixos ------------------------------------------------
  document.getElementById("btnOrca").href = `https://www.orca.so/?tokenIn=${mint}&tokenOut=So11111111111111111111111111111111111111112`;
  document.getElementById("btnJupiter").href = `https://jup.ag/swap?sell=${mint}&buy=So11111111111111111111111111111111111111112`;
  document.getElementById("btnDonate").href = `https://explorer.solana.com/address/${mint}`;

  // ---- Export / Share ------------------------------------------------------
  window.currentReport = { report, mint, score, riskMsg, riskGif };
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
