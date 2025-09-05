const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
];

function short(addr) {
  if (!addr || typeof addr !== "string") return "N/A";
  return addr.slice(0,5) + "…" + addr.slice(-5);
}

async function generateReport() {
  const mintInput = document.getElementById("tokenInput").value.trim();
  if (!mintInput) return alert("⚠️ Informe um token mint válido");

  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "⏳ Gerando relatório...";

  try {
    const resp = await fetch(`http://localhost:3000/token/${mintInput}`);
    const token = await resp.json();

    const meme = memes[Math.floor(Math.random()*memes.length)];

    let topHoldersHTML = token.topHolders.length>0 ?
      token.topHolders.map(h => `${short(h.address)} — ${Number(h.amount).toLocaleString()}`).join("<br>") : "N/A";

    reportDiv.innerHTML = `
      <h2>📊 Turbo Tuga Token Report</h2>
      <p><b>Status:</b> ${token.status}</p>
      <table border="1" cellpadding="5">
        <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
        <tr><td>Supply</td><td>${token.supply}</td><td>${token.supply>0?10:0}</td></tr>
        <tr><td>Decimals</td><td>${token.decimals}</td><td>5</td></tr>
        <tr><td>Mint Authority</td><td>${short(token.mintAuthority)}</td><td>${token.mintAuthority==="null"?10:0}</td></tr>
        <tr><td>Freeze Authority</td><td>${short(token.freezeAuthority)}</td><td>${token.freezeAuthority==="null"?5:0}</td></tr>
        <tr><td>Holders</td><td>${token.holders}</td><td>${token.holders>0?10:0}</td></tr>
        <tr><td>Concentração Top3</td><td>${token.concentrationTop3}%</td><td>${token.concentrationTop3<50?10:5}</td></tr>
        <tr><td>Preço</td><td>${token.price}</td><td>${token.price!=="N/A"?5:0}</td></tr>
        <tr><td>Liquidez</td><td>${token.liquidity}</td><td>${token.liquidity!=="N/A"?5:0}</td></tr>
        <tr><td>Queimado</td><td>${token.burned}</td><td>${token.burned!=="N/A"?5:0}</td></tr>
      </table>
      <p><b>Score Total:</b> ${token.score}/100</p>
      <p><b>Data de Criação:</b> ${token.creationDate}</p>
      <p><b>Top 10 Holders:</b><br>${topHoldersHTML}</p>
      <img src="${meme}" class="meme"/>
      <p>⚠️ Este material é educativo — não é recomendação de compra/venda.</p>
      <div style="margin-top:10px;">
        <a href="https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112" target="_blank">🐬 Comprar Turbo Tuga em DEX Orca</a>
        <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank">🚀 Comprar Turbo Tuga em DEX Jupiter</a>
      </div>
    `;
  } catch(err) {
    reportDiv.innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
    console.error(err);
  }
}
