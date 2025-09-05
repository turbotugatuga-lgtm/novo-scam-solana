const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
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
    const data = await resp.json();
    const token = Array.isArray(data) && data.length>0 ? data[0] : {};

    const supply = token.supply ?? "N/A";
    const decimals = token.decimals ?? "N/A";
    const holders = token.holderCount ?? "N/A";
    const mintAuthority = token.mintAuthority ?? "N/A";
    const freezeAuthority = token.freezeAuthority ?? "N/A";
    const topHolders = Array.isArray(token.topHolders) ? token.topHolders : [];

    // Score simples
    let score = 0;
    if (supply !== "N/A") score += 10;
    if (mintAuthority==="null") score+=10;
    if (freezeAuthority==="null") score+=5;
    if (holders!=="N/A") score+=10;

    let status = score>=30 ? "✅ Confiável" : "❌ Possível SCAM";

    const meme = memes[Math.floor(Math.random()*memes.length)];

    let topHoldersHTML = topHolders.length>0 ? topHolders.map(h=>`${short(h.address)} — ${h.amount}`).join("<br>") : "N/A";

    reportDiv.innerHTML = `
      <h2>📊 Turbo Tuga Token Report</h2>
      <p><b>Status:</b> ${status}</p>
      <table border="1" cellpadding="5">
        <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
        <tr><td>Supply</td><td>${supply}</td><td>${supply!=="N/A"?10:0}</td></tr>
        <tr><td>Mint Authority</td><td>${mintAuthority}</td><td>${mintAuthority==="null"?10:0}</td></tr>
        <tr><td>Freeze Authority</td><td>${freezeAuthority}</td><td>${freezeAuthority==="null"?5:0}</td></tr>
        <tr><td>Holders</td><td>${holders}</td><td>${holders!=="N/A"?10:0}</td></tr>
      </table>
      <p><b>Score Total:</b> ${score}/100</p>
      <p><b>Top 10 Holders:</b><br>${topHoldersHTML}</p>
      <img src="${meme}" class="meme"/>
      <p>⚠️ Este material é educativo — não é recomendação de compra/venda.</p>
    `;
  } catch(err){
    reportDiv.innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
    console.error(err);
  }
}
