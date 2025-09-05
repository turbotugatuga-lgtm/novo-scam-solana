const API_BASE = "https://turbo-tuga-backend.onrender.com"; 

async function generateReport() {
  const mint = document.getElementById("mint").value.trim();
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "⏳ Gerando relatório Turbo Tuga Ultra Meme...";

  try {
    const res = await fetch(`${API_BASE}/token/${mint}`);
    const data = await res.json();

    reportDiv.innerHTML = `
      <h2>📊 Relatório do Token</h2>
      <p><b>Mint:</b> ${data.mint}</p>
      <p><b>Supply:</b> ${data.supply}</p>
      <p><b>Decimals:</b> ${data.decimals}</p>
      <p><b>Preço (USDT):</b> ${data.price}</p>
      <p><b>Liquidez (est.):</b> ${data.liquidity}</p>
      <br>
      ⚠️ Este material é educativo — não é recomendação de compra/venda.
      <br><br>
      🐬 <a href="https://www.orca.so/?tokenIn=${mint}&tokenOut=So11111111111111111111111111111111111111112">Comprar no Orca</a>
      🚀 <a href="https://jup.ag/swap?sell=${mint}&buy=So11111111111111111111111111111111111111112">Comprar no Jupiter</a>
    `;
  } catch (err) {
    reportDiv.innerHTML = "❌ Erro ao gerar relatório.";
    console.error(err);
  }
}
