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
  let gif = "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif";
  if (score < 40) gif = "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif";
  if (score > 80) gif = "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif";
  return gif;
}

// ---- Main ------------------------------------------------------------------
async function generateReport() {
  let mintRaw = document.getElementById("tokenInput").value.trim();
  
  // Remove parâmetros de URL e extrações
  if (mintRaw.includes("?")) mintRaw = mintRaw.split("?")[1]; 
  if (mintRaw.includes("&")) mintRaw = mintRaw.split("&")[0]; 
  const mint = mintRaw; // mint puro
  
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
  } catch (e) { console.warn("Shyft error", e); }

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
        if (Array.isArray(s.socials)) s.socials.forEach(link => report.socials.push(link));
      }
    } catch (e) { console.warn("Solscan error", e); }
  }

  // ---- 3) Birdeye (market data) -------------------------------------------
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
      }
    } catch (e) { console.warn("Birdeye overview error", e); }
  }

  // ---- 4) Jupiter price fallback ------------------------------------------
  try {
    const jupRes = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`);
    const jup = await jupRes.json();
    if (jup?.data && jup.data[mint]) report.price = jup.data[mint].price ?? report.price;
  } catch (e) { console.warn("Jupiter price fetch failed", e); }

  // ---- Score ---------------------------------------------------------------
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
  const riskGif = pickRiskGif(score);

  // ---- Render --------------------------------------------------------------
  const socialsHtml = (report.socials && report.socials.length)
    ? `<div class="kv"><div class="key">Socials</div><div class="val">${report.socials.map(s => `<a href="${sanitizeUrl(s)}" target="_blank">${s}</a>`).join("<br>")}</div></div>` : "";

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
      <div class="kv"><div class="key">Website</div><div class="val">${report.website !== "N/A" ? `<a href="${sanitizeUrl(report.website)}" target="_blank">${report.website}</a>` : "N/A"}</div></div>
      ${socials
