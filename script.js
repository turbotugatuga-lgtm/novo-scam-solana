const API_BASE = "https://SEU_BACKEND.onrender.com"; // troque pelo link do backend hospedado

async function generateReport() {
  const mint = document.getElementById("mint").value.trim();
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "⏳ Gerando relatório Turbo Tuga Ultra Meme...";

  try {
    const res = await fetch(`${API_BASE}/token/${mint}`);
    const data = await res.json();

    // Top holders formatados
    let holdersList = "N/A";
    if (data.topHolders && data.topHolders.length > 0) {
      holdersList = "<ul>" + data.topHolders.map(h =>
        `<li>${h.owner} — ${h.percent.toFixed(2)}%</li>`
      ).join("") + "</ul>";
    }

    reportDiv.innerHTML = `
      <h2>📊 Relatório do Token</h2>
      <p><b>Mint:</b> ${data.mint}</p>
      <p><b>Nome:</b> ${data.name}</p>
      <p><b>Símbolo:</b> ${data.symbol}</p>
      <p><b>Supply:</b> ${data.supply}</p>
      <p><b>Decimals:</b> ${data.decimals}</p>
      <p><b>Mint Authority:</b> ${data.mintAuthority}</p>
      <p><b>Freeze Authority:</b> ${data.freezeAuthority}</p>
      <p><b>Preço (USDT):</b> ${data.price}</p>
      <p><b>Liquidez:</b> ${data.liquidity}</p>
      <p><b>Total de Holders:</b> ${data.holdersCount}</p>
      <p><b>Top Holders:</b> ${holdersList}</p>
      <br>
      ⚠️ Este material é educativo — não é recomendação de compra/venda.
      <br><br>
      🐬 <a href="https://www.orca.so/?tokenIn=${mint}&tokenOut=So11111111111111111111111111111111111111112" target="_blank">Comprar no Orca</a>
      🚀 <a href="https://jup.ag/swap?sell=${mint}&buy=So11111111111111111111111111111111111111112" target="_blank">Comprar no Jupiter</a>
    `;
  } catch (err) {
    reportDiv.innerHTML = "❌ Erro ao gerar relatório.";
    console.error(err);
  }
}
