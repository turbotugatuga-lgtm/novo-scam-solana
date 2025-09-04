// ==========================
// GIFs de risco (30 aleatórios)
// ==========================
const gifsHigh = [
  "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3o6ZsX6dMhrAzK6aLa/giphy.gif",
  "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif",
  "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/l4KibK3JwaVo0CjDO/giphy.gif",
  "https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif",
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
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
  "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif",
  "https://media.giphy.com/media/l4pTdcif6uY3iI3kE/giphy.gif",
  "https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif",
  "https://media.giphy.com/media/xT0GqssRweIhlz209i/giphy.gif"
];

function pickRandomGif(score) {
  let arr = gifsMedium;
  if (score < 40) arr = gifsHigh;
  if (score > 80) arr = gifsLow;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==========================
// Função principal
// ==========================
async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  if (!mint) {
    alert("Please enter a token mint address.");
    return;
  }

  const shyftKey = window.CONFIG.SHYFT_API_KEY;
  const birdeyeKey = window.CONFIG.BIRDEYE_API_KEY;

  let report = {
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
    website: "N/A"
  };

  try {
    // ---- Shyft: dados on-chain ----
    const shyftRes = await fetch(
      `https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`,
      { headers: { "x-api-key": shyftKey } }
    );
    const shyftData = await shyftRes.json();
    if (shyftData.success) {
      const d = shyftData.result;
      report.name = d.name || report.name;
      report.symbol = d.symbol || report.symbol;
      report.supply = d.supply || report.supply;
      report.decimals = d.decimals || report.decimals;
      report.mintAuthority = d.mint_authority || "Revoked";
      report.freezeAuthority = d.freeze_authority || "None";
    }

    // ---- Birdeye: preço, volume, liquidez, market cap, website ----
    if (birdeyeKey) {
      const beRes = await fetch(
        `https://public-api.birdeye.so/defi/token_overview?address=${mint}`,
        { headers: { "X-API-KEY": birdeyeKey } }
      );
      const beData = await beRes.json();
      if (beData.success && beData.data) {
        const d = beData.data;
        report.price = d.price || report.price;
        report.volume24h = d.v24hUsd || report.volume24h;
        report.liquidity = d.liquidity || report.liquidity;
        report.marketCap = d.mc || report.marketCap;
        if (d.extensions && d.extensions.website) {
          report.website = d.extensions.website;
        }
      }
    }

    // ---- Solscan: holders ----
    const ssRes = await fetch(
      `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=1`
    );
    const ssData = await ssRes.json();
    if (ssData.data) {
      report.holders = ssData.total || report.holders;
    }

    // ---- Jupiter: preço fallback ----
    const jupRes = await fetch(`https://price.jup.ag/v6/price?ids=${mint}`);
    const jupData = await jupRes.json();
    if (jupData.data && jupData.data[mint]) {
      report.price = jupData.data[mint].price || report.price;
    }

    // ---- Calcular Score ----
    let score = 50;
    if (report.price !== "N/A") score += 10;
    if (report.liquidity !== "N/A" && report.liquidity > 10000) score += 10;
    if (report.holders !== "N/A" && report.holders > 200) score += 10;
    if (report.mintAuthority === "Revoked") score += 10;

    let riskMsg = "⚠️ Medium risk — caution advised";
    if (score < 40) riskMsg = "🚨 High risk! Likely scam";
    if (score > 80) riskMsg = "✅ Low risk — looks safer";

    const riskGif = pickRandomGif(score);

    // ---- Renderizar ----
    document.getElementById("report").innerHTML = `
      <h2>Token Report</h2>
      <div class="kv"><span class="key">Name / Symbol:</span><span>${report.name} (${report.symbol})</span></div>
      <div class="kv"><span class="key">Mint:</span><span>${mint}</span></div>
      <div class="kv"><span class="key">Score:</span><span>${score}/100</span></div>
      <div class="kv"><span class="key">Price:</span><span>${report.price}</span></div>
      <div class="kv"><span class="key">24h Volume:</span><span>${report.volume24h}</span></div>
      <div class="kv"><span class="key">Liquidity:</span><span>${report.liquidity}</span></div>
      <div class="kv"><span class="key">Market Cap:</span><span>${report.marketCap}</span></div>
      <div class="kv"><span class="key">Supply / Decimals:</span><span>${report.supply} / ${report.decimals}</span></div>
      <div class="kv"><span class="key">Holders:</span><span>${report.holders}</span></div>
      <div class="kv"><span class="key">Mint Authority:</span><span>${report.mintAuthority}</span></div>
      <div class="kv"><span class="key">Freeze Authority:</span><span>${report.freezeAuthority}</span></div>
      <div class="kv"><span class="key">Website:</span><span>${report.website}</span></div>
      <p>${riskMsg}</p>
      <img src="${riskGif}" class="gif-animated" style="width:200px; animation: jump 1s infinite alternate;" />
      <hr>
      <button onclick="exportPDF()">📄 Export PDF</button>
      <button onclick="shareReport()">📢 Share Report</button>
    `;

    // ---- Atualiza links fixos ----
    document.getElementById("btnOrca").href =
      `https://www.orca.so/?tokenIn=${mint}&tokenOut=So11111111111111111111111111111111111111112`;
    document.getElementById("btnJupiter").href =
      `https://jup.ag/swap?sell=${mint}&buy=So11111111111111111111111111111111111111112`;
    document.getElementById("btnDonate").href =
      `https://explorer.solana.com/address/${mint}`;

    window.currentReport = { report, mint, score, riskMsg, riskGif };

  } catch (err) {
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Error generating report. Check API keys.`;
  }
}

// ==========================
// PDF e Compartilhar
// ==========================
function exportPDF() {
  alert("📄 PDF export coming soon!");
}

function shareReport() {
  const r = window.currentReport;
  if (!r) { alert("Generate report first!"); return; }
  const text = `Token Report
${r.report.name} (${r.report.symbol})
Mint: ${r.mint}
Score: ${r.score}/100
Price: ${r.report.price}
24h Volume: ${r.report.volume24h}
Liquidity: ${r.report.liquidity}
Market Cap: ${r.report.marketCap}
Holders: ${r.report.holders}
Mint Authority: ${r.report.mintAuthority}
Freeze Authority: ${r.report.freezeAuthority}
Website: ${r.report.website}
${r.riskMsg}`;

  if (navigator.share) {
    navigator.share({ title:"Turbo Tuga Token Report", text, url:window.location.href });
  } else {
    prompt("Copy report text:", text);
  }
}
