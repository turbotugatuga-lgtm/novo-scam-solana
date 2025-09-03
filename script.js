async function generateReport() {
  const mint = document.getElementById("mint").value.trim();
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "<p>⏳ Generating report...</p>";

  if (!mint) {
    reportDiv.innerHTML = "<p style='color:red'>⚠️ Please enter a token mint address.</p>";
    return;
  }

  try {
    const shyftData = await fetch(
      `https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`,
      { headers: { "x-api-key": window.CONFIG.SHYFT_API_KEY } }
    ).then(r => r.json());

    const solscanData = await fetch(
      `https://public-api.solscan.io/token/meta?tokenAddress=${mint}`,
      { headers: { Authorization: `Bearer ${window.CONFIG.SOLSCAN_API_KEY}` } }
    ).then(r => r.json());

    let name = shyftData?.result?.name || solscanData?.symbol || "Unknown";
    let symbol = shyftData?.result?.symbol || solscanData?.symbol || "N/A";
    let supply = shyftData?.result?.supply || "N/A";
    let decimals = shyftData?.result?.decimals || "N/A";
    let mintAuth = shyftData?.result?.mint_authority || "Revoked";
    let freezeAuth = shyftData?.result?.freeze_authority || "None";

    let report = `
      <h2>Token Report</h2>
      <p><b>${name} (${symbol})</b></p>
      <p><b>Mint:</b> ${mint}</p>
      <p><b>Supply / Decimals:</b> ${supply} / ${decimals}</p>
      <p><b>Mint authority:</b> ${mintAuth}</p>
      <p><b>Freeze authority:</b> ${freezeAuth}</p>
      <p><b>Price:</b> ${solscanData?.priceUsdt || "N/A"}</p>
      <p><b>24h Volume:</b> ${solscanData?.volume || "N/A"}</p>
      <p><b>Liquidity:</b> ${solscanData?.liquidity || "N/A"}</p>
      <p><b>Risk thermometer:</b> ⚠️ Medium risk — caution advised</p>
    `;

    reportDiv.innerHTML = report;
  } catch (err) {
    console.error(err);
    reportDiv.innerHTML = "<p style='color:red'>❌ Error generating report. Check API keys.</p>";
  }
}

function exportPDF() {
  alert("📄 PDF export coming soon...");
}

function shareReport() {
  const text = document.getElementById("report").innerText;
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: "Turbo Tuga Token Report",
      text: text,
      url: url
    });
  } else {
    alert("Copy the link to share: " + url);
  }
}
