const memes = [
  "https://i.imgflip.com/30zz5g.jpg",
  "https://i.imgflip.com/4/1otk96.jpg",
  "https://i.imgflip.com/65r2kq.jpg",
  "https://i.imgflip.com/6c2p.jpg",
  "https://i.imgflip.com/76j1a7.jpg"
];

const animations = {
  scam: "💣 Token explodiu em mil pedaços! 💥",
  medio: "🪂 Token despencando no abismo sem paraquedas...",
  bom: "🚀 Token indo direto pra Lua! 🌕✨"
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReport() {
  const supply = (Math.random() * 1e6).toFixed(2);
  const holders = Math.floor(Math.random() * 5000);
  const score = Math.floor(Math.random() * 100);
  const taxa = (Math.random() * 10).toFixed(2);
  const queimado = (Math.random() * 1000000).toFixed(0);

  let status = "";
  let animacao = "";

  if (score < 40) {
    status = "❌ Scam total 😂";
    animacao = animations.scam;
  } else if (score < 70) {
    status = "⚠️ Meio suspeito";
    animacao = animations.medio;
  } else {
    status = "✅ Confiável (só que não)";
    animacao = animations.bom;
  }

  const selectedMemes = Array.from({ length: 3 }, () => getRandomItem(memes));

  const report = `
    <h2>📊 Relatório Meme do Turbo Tuga</h2>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Supply:</strong> ${supply}</p>
    <p><strong>Holders:</strong> ${holders}</p>
    <p><strong>Taxa de Venda:</strong> ${taxa}%</p>
    <p><strong>Tokens Queimados:</strong> ${queimado}</p>
    <p><strong>Score Total:</strong> ${score}/100</p>

    <div class="animation">${animacao}</div>

    <div class="meme-container">
      ${selectedMemes.map(m => `<img src="${m}" alt="meme">`).join("")}
    </div>

    <p>🐬 Comprar Turbo Tuga em 
      <a href="https://www.orca.so" target="_blank">DEX Orca</a> | 
      🚀 <a href="https://jup.ag" target="_blank">DEX Jupiter</a>
    </p>
    <p>⚠️ Este relatório é apenas um meme zoeiro. Não é recomendação de compra/venda.</p>
  `;

  document.getElementById("report").innerHTML = report;
}
