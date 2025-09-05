const memes = [
  "https://i.imgflip.com/30zz5g.jpg",
  "https://i.imgflip.com/65r2kq.jpg",
  "https://i.imgflip.com/76j1a7.jpg",
  "https://i.imgflip.com/6c2p.jpg"
];

const animations = {
  scam: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif", // explosão
  medio: "https://media.giphy.com/media/26gR0Y8J3iOx1F7hK/giphy.gif", // queda
  bom: "https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif"       // foguete
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReport() {
  const tokenMint = document.getElementById("tokenInput").value || "TurboTugaFakeMint";

  const supply = (Math.random() * 1e6).toFixed(2);
  const holders = Math.floor(Math.random() * 5000);
  const score = Math.floor(Math.random() * 100);
  const taxa = (Math.random() * 10).toFixed(2);
  const queimado = (Math.random() * 1000000).toFixed(0);

  let status = "";
  let animacao = "";

  if (score < 40) {
    status = "❌ Scam total 😂";
    animacao = `<img src="${animations.scam}" alt="explosão">`;
  } else if (score < 70) {
    status = "⚠️ Meio suspeito";
    animacao = `<img src="${animations.medio}" alt="queda">`;
  } else {
    status = "✅ Confiável (só que não)";
    animacao = `<img src="${animations.bom}" alt="foguete">`;
  }

  const selectedMemes = Array.from({ length: 3 }, () => getRandomItem(memes));

  const reportHTML = `
    <h2>📊 Relatório Meme do Token</h2>
    <p><strong>Mint:</strong> ${tokenMint}</p>
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
      <a href="https://jup.ag/swap/SOL-${tokenMint}" target="_blank">DEX Jupiter</a> |
      🚀 <a href="https://www.orca.so" target="_blank">DEX Orca</a>
    </p>
    <p>⚠️ Este relatório é apenas um meme zoeiro. Não é recomendação de compra/venda.</p>
  `;

  document.getElementById("report").innerHTML = reportHTML;
  document.getElementById("actions").style.display = "block";
}

function shareTwitter() {
  const text = encodeURIComponent("😂 Acabei de gerar um relatório meme do Turbo Tuga Token 🚀");
  const url = "https://novo-scam-solana.vercel.app";
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
}

function shareTelegram() {
  const text = encodeURIComponent("😂 Acabei de gerar um relatório meme do Turbo Tuga Token 🚀");
  const url = "https://novo-scam-solana.vercel.app";
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "pt", "a4");

  const report = document.getElementById("report");
  doc.html(report, {
    callback: function (doc) {
      doc.save("TurboTugaMemeReport.pdf");
    },
    x: 20,
    y: 20
  });
}
