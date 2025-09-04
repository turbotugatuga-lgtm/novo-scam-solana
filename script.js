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
    marketCap: "N/A"
  };

  try {
    // --- Shyft ---
    const shyftRes = await fetch(
      `https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`,
      { headers: { "x-api-key": shyftKey } }
    );
    const shyftData = await shyftRes.json();
    if (shyftData.success) {
      const d = shyftData.result;
      report.name = d.name || "Unknown";
      report.symbol = d.symbol || "Unknown";
      report.supply = d.supply || "N/A";
      report.decimals = d.decimals || "N/A";
      report.mintAuthority = d.mint_authority || "Revoked";
      report.freezeAuthority = d.freeze_authority || "None";
      report.holders = d.holder || "N/A";
    }

    // --- Birdeye (opcional) ---
    if (birdeyeKey) {
      const beRes = await fetch(
        `https://public-api.birdeye.so/defi/token_overview?address=${mint}`,
        { headers: { "X-API-KEY": birdeyeKey } }
      );
      const beData = await beRes.json();
      if (beData.success && beData.data) {
        report.price = beData.data.price || "N/A";
        report.volume24h = beData.data.volume24h || "N/A";
        report.liquidity = beData.data.liquidity || "N/A";
        report.marketCap = beData.data.mc || "N/A";
      }
    }

    // --- Jupiter fallback ---
    try {
      const jupRes = await fetch(`https://price.jup.ag/v4/price?ids=${mint}`);
      const jupData = await jupRes.json();
      if (jupData.data && jupData.data[mint]) {
        report.price = jupData.data[mint].price || report.price;
      }
    } catch (e) {
      console.warn("Jupiter price fetch failed", e);
    }

    // --- Risk Score ---
    let score = 65;
    if (report.mintAuthority !== "Revoked") score -= 20;
    if (report.freezeAuthority !== "None") score -= 10;
    if (report.holders !== "N/A" && report.holders < 50) score -= 20;
    if (report.liquidity === "N/A" || report.liquidity < 1000) score -= 15;

    let riskMsg = "⚠️ Medium risk — caution advised";
    let riskGif = "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif"; // Doge confuso
    if (score < 40) {
      riskMsg = "❌ High risk — possible scam!";
      riskGif = "https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif"; // Pepe chorando
    } else if (score > 80) {
      riskMsg = "✅ Low risk — safer token";
      riskGif = "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif"; // Elon Musk foguete
    }

    // --- Render ---
    document.getElementById("report").innerHTML = `
      <div id="reportContent">
        <h2>Token Report</h2>
        <p><b>${report.name} (${report.symbol})</b></p>
        <p><b>Mint:</b> ${mint}</p>
        <p><b>Score:</b> ${score}/100</p>
        <p><b>Price:</b> ${report.price}</p>
        <p><b>24h Volume:</b> ${report.volume24h}</p>
        <p><b>Liquidity:</b> ${report.liquidity}</p>
        <p><b>Market Cap:</b> ${report.marketCap}</p>
        <p><b>Supply / Decimals:</b> ${report.supply} / ${report.decimals}</p>
        <p><b>Holders:</b> ${report.holders}</p>
        <p><b>Mint authority:</b> ${report.mintAuthority}</p>
        <p><b>Freeze authority:</b> ${report.freezeAuthority}</p>
        <p>${riskMsg}</p>
        <div style="text-align:center; margin:15px 0;">
          <img src="${riskGif}" alt="Risk meme" style="max-width:250px; border-radius:12px;">
        </div>
      </div>
      <hr>
      <button onclick="exportPDF()">📄 Export PDF</button>
      <button onclick="shareReport()">📢 Share Report</button>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Error generating report. Check API keys.`;
  }
}

// --- PDF export ---
function exportPDF() {
  const element = document.getElementById("reportContent");
  const opt = {
    margin: 0.5,
    filename: "TurboTuga-Token-Report.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };
  html2pdf().set(opt).from(element).save();
}

// --- Share API ---
function shareReport() {
  if (navigator.share) {
    navigator.share({
      title: "Turbo Tuga Token Report",
      text: document.getElementById("reportContent").innerText,
      url: window.location.href
    });
  } else {
    alert("Sharing not supported on this device.");
  }
}
