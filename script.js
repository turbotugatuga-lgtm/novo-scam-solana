const memes = [
  "https://i.imgflip.com/30zz5g.jpg",
  "https://i.imgflip.com/4/1otk96.jpg",
  "https://i.imgflip.com/65r2kq.jpg",
  "https://i.imgflip.com/6c2p.jpg",
  "https://i.imgflip.com/76j1a7.jpg"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReport() {
  const supply = (Math.random() * 1e9).toFixed(2);
  const holders = Math.floor(Math.random() * 5000);
  const score = Math.floor(Math.random() * 100);
  const taxa = (Math.random() * 10).toFixed(2);
  const queimado = (Math.random() * 1000000).toFixed(0);
  const scamStatus = score < 40 ? "❌ Scam total 😂" : score < 70 ? "⚠️ Meio suspeito" : "✅ Confiável (só que não)";
  
  // 3 memes diferentes
  const selectedMemes = Array.from({ length: 3 }, () => getRandomItem(memes));

  const report = `
    <h2>📊 Relatório Meme do Turbo Tuga</h2>
    <p><strong>Status:</strong> ${scamStatus}</p>
    <p><strong>Supply:</strong> ${supply}</p>
    <p><strong>Holders:</strong> ${holders}</p>
    <p><strong>Taxa de Venda:</strong> ${taxa}%</p>
    <p><strong>Tokens Queimados:</strong> ${queimado}</p>
    <p><strong>Score Total:</strong> ${score}/100</p>

    <div class="meme-container">
      ${selectedMemes.map(m => `<img src="${m}" alt="meme">`).join("")}
    </div>

    <p>🐬 Comprar Turbo Tuga em <a href="https://www.orca.so" target="_blank">DEX Orca</a> | 🚀 <a href="https://jup.ag" target="_blank">DEX Jupiter</a></p>
    <p>⚠️ Este relatório é apenas um meme zoeiro. Não é recomendação de compra/venda.</p>
  `;

  document.getElementById("report").innerHTML = report;
}
