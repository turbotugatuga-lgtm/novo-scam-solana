// Banco de frases por campo
const frases = {
  supply: [
    "🤔 Supply esquisito… parece calculado na calculadora da Xuxa.",
    "📈 Supply infinito? Parece real mas é só pegadinha do Malandro.",
    "😂 Supply menor que meu saldo no Nubank."
  ],
  holders: [
    "👀 Só meia dúzia de gato pingado segurando isso.",
    "🙃 Holders sumidos… parece festa que ninguém foi.",
    "😅 Se cair mais um holder vira token fantasma."
  ],
  taxa: [
    "💸 Taxa de venda mais cara que imposto no Brasil.",
    "😂 Taxa tão alta que o governo ficou com inveja.",
    "🪙 Vender esse token dói mais que pagar boleto no fim do mês."
  ],
  queimado: [
    "🔥 Queimaram uns tokens só pra fingir ser sério.",
    "🤣 Token queimado parece churrasco de domingo.",
    "💀 Queimaram mais que meu dinheiro no cassino online."
  ]
};

// Banco de memes (gifs/imagens)
const memesBanco = [
  "https://i.imgflip.com/30zz5g.jpg",
  "https://i.imgflip.com/65r2kq.jpg",
  "https://i.imgflip.com/76j1a7.jpg",
  "https://i.imgflip.com/6c2p.jpg",
  "https://media.giphy.com/media/9J7tdYltWyXIY/giphy.gif", // foguete
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif", // explosão
  "https://media.giphy.com/media/26gR0Y8J3iOx1F7hK/giphy.gif"  // queda
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReport() {
  const tokenMint = document.getElementById("tokenInput").value || "TurboTugaFakeMint";

  // Dados fake
  const supply = (Math.random() * 1e6).toFixed(2);
  const holders = Math.floor(Math.random() * 5000);
  const taxa = (Math.random() * 10).toFixed(2);
  const queimado = (Math.random() * 1000000).toFixed(0);

  // Escolhe frases memes
  const fraseSupply = pickRandom(frases.supply);
  const fraseHolders = pickRandom(frases.holders);
  const fraseTaxa = pickRandom(frases.taxa);
  const fraseQueimado = pickRandom(frases.queimado);

  // Escolhe 3 memes aleatórios
  const selectedMemes = [];
  while (selectedMemes.length < 3) {
    const meme = pickRandom(memesBanco);
    if (!selectedMemes.includes(meme)) {
      selectedMemes.push(meme);
    }
  }

  const reportHTML = `
    <h2>📊 Relatório Meme do Token</h2>
    <p><strong>Mint:</strong> ${tokenMint}</p>
    <p><strong>Supply:</strong> ${supply} — ${fraseSupply}</p>
    <p><strong>Holders:</strong> ${holders} — ${fraseHolders}</p>
    <p><strong>Taxa de Venda:</strong> ${taxa}% — ${fraseTaxa}</p>
    <p><strong>Tokens Queimados:</strong> ${queimado} — ${fraseQueimado}</p>

    <div class="meme-container">
      ${selectedMemes.map(m => `<img src="${m}" alt="meme">`).join("")}
    </div>

    <p>🐬 Comprar Turbo Tuga em 
      <a href="https://jup.ag/swap/SOL-${tokenMint}" target="_blank">DEX Jupiter</a> |
      🚀 <a href="https://www.orca.so" target="_blank">DEX Orca</a>
    </p>
    <p>⚠️ Este relatório é só meme. Não é recomendação de nada.</p>
  `;

  document.getElementById("report").innerHTML = reportHTML;
  document.getElementById("actions").style.display = "block";
}
