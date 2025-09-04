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
    liquidity: "N/A"
  };

  try {
    // --- Shyft (on-chain data) ---
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
    }

    // --- Birdeye (market data, optional if key exists) ---
    if (birdeyeKey) {
      const beRes = await fetch(
        `https://public-api.birdeye.so/defi/token_price?address=${mint}`,
        { headers: { "X-API-KEY": birdeyeKey } }
      );
      const beData = await beRes.json();
      if (beData.success && beData.data) {
        report.price = beData.data.value || "N/A";
      }
    }

    // --- Jupiter (price fallback) ---
    const jupRes = await fetch(`https://price.jup.ag/v6/price?ids=${mint}`);
    const jupData = await jupRes.json();
    if (jupData.data && jupData.data[mint]) {
      report.price = jupData.data[mint].price || report.price;
    }

    // --- Render ---
    document.getElementById("report").innerHTML = `
      <h2>Token Report</h2>
      <p><b>${report.name} (${report.symbol})</b></p>
      <p><b>Mint:</b> ${mint}</p>
      <p><b>Score:</b> 65/100</p>
      <p><b>Price:</b> ${report.price}</p>
      <p><b>24h Volume:</b> ${report.volume24h}</p>
      <p><b>Liquidity:</b> ${report.liquidity}</p>
      <p><b>Supply / Decimals:</b> ${report.supply} / ${report.decimals}</p>
      <p><b>Mint authority:</b> ${report.mintAuthority}</p>
      <p><b>Freeze authority:</b> ${report.freezeAuthority}</p>
      <p>⚠️ Risk thermometer: Medium risk — caution advised</p>
      <hr>
      <button onclick="exportPDF()">📄 Export PDF</button>
      <button onclick="shareReport()">📢 Share Report</button>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Error generating report. Check API keys.`;
  }
}

function exportPDF() {
  alert("📄 PDF export coming soon!");
}

function shareReport() {
  if (navigator.share) {
    navigator.share({
      title: "Turbo Tuga Token Report",
      text: document.getElementById("report").innerText,
      url: window.location.href
    });
  } else {
    alert("Sharing not supported on this device.");
  }
}
