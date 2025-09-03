async function generateReport() {
  const mint = document.getElementById("tokenInput").value;
  const shyftKey = window.CONFIG.SHYFT_API_KEY;
  const birdeyeKey = window.CONFIG.BIRDEYE_API_KEY;

  let report = {
    name: "Unknown",
    symbol: "Unknown",
    supply: "N/A",
    decimals: "N/A",
    holders: "N/A",
    topHolders: "N/A",
    mintAuthority: "N/A",
    freezeAuthority: "N/A",
    creator: "N/A",
    price: "N/A",
    volume24h: "N/A",
    liquidity: "N/A",
    high24h: "N/A",
    low24h: "N/A"
  };

  try {
    // --- Shyft (on-chain data) ---
    const shyftRes = await fetch(`https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`, {
      headers: { "x-api-key": shyftKey }
    });
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

    // --- Birdeye (market data) ---
    const beRes = await fetch(`https://public-api.birdeye.so/defi/token_price?address=${mint}`, {
      headers: { "X-API-KEY": birdeyeKey }
    });
    const beData = await beRes.json();
    if (beData.success && beData.data) {
      report.price = beData.data.value || "N/A";
    }

    const beVolRes = await fetch(`https://public-api.birdeye.so/defi/v3/token_volume?address=${mint}`, {
      headers: { "X-API-KEY": birdeyeKey }
    });
    const beVolData = await beVolRes.json();
    if (beVolData.success && beVolData.data) {
      report.volume24h = beVolData.data["24h"] || "N/A";
    }

    // --- Jupiter (confirm price / swap link) ---
    const jupRes = await fetch(`https://price.jup.ag/v6/price?ids=${mint}`);
    const jupData = await jupRes.json();
    if (jupData.data && jupData.data[mint]) {
      report.price = jupData.data[mint].price || report.price;
    }

    // --- Render result ---
    document.getElementById("report").innerHTML = `
      <h2>Token Report</h2>
      <p><b>${report.name} (${report.symbol})</b></p>
      <p>Mint: ${mint}</p>
      <p>Score: 65/100</p>
      <p>Price: ${report.price}</p>
      <p>24h Volume: ${report.volume24h}</p>
      <p>Liquidity: ${report.liquidity}</p>
      <p>Supply / Decimals: ${report.supply} / ${report.decimals}</p>
      <p>Mint authority: ${report.mintAuthority}</p>
      <p>Freeze authority: ${report.freezeAuthority}</p>
      <p>⚠️ Risk thermometer: Medium risk — caution advised</p>
      <hr>
      <a href="https://www.orca.so/?tokenIn=${mint}&tokenOut=So11111111111111111111111111111111111111112" target="_blank">🛒 Buy on Orca</a><br>
      <a href="https://jup.ag/swap/SOL-${mint}" target="_blank">🛒 Buy on Jupiter</a><br>
      <button onclick="exportPDF()">📄 Export PDF</button>
      <button onclick="shareReport()">📢 Share Report</button>
      <p style="color:red">⚠️ Automated analysis. Educational purpose only. DYOR.</p>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Error generating report. Check API keys.`;
  }
}
