// Banco expandido (aqui vou deixar alguns exemplos, mas pode crescer até 100+ GIFs e 50+ frases)
const memes = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/fAnEC88LccN7a/giphy.gif",
  "https://media.giphy.com/media/UqZ4imFIUJq2M/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/l0IyjX3KEk6X1tZFe/giphy.gif",
  "https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/giphy.gif"
];

const phrases = {
  supply: [
    "Supply bigger than my mom’s grocery list 🛒",
    "This token prints faster than the Fed 💸",
    "Too much supply, enough to build a castle 🏰"
  ],
  holders: [
    "More whales than an aquarium 🐋",
    "Tiny sardine army spotted 🐟",
    "Holder count: smaller than my contact list 📱"
  ],
  price: [
    "Price going 🚀 or 💀? Only memes decide",
    "This chart belongs in a museum 🖼️",
    "Price vibes only 🌈"
  ],
  tax: [
    "Trading tax higher than my student loans 📚",
    "This fee slaps harder than grandma’s chancla 👵",
    "Every swap funds meme magic ✨"
  ],
  burned: [
    "Coins toasted like marshmallows 🔥",
    "Burn baby burn disco inferno 🎶",
    "RIP tokens gone forever ⚰️"
  ],
  lock: [
    "Locked tighter than my fridge at night 🔒",
    "This token said NO new mints 🚫",
    "Dev revoked the keys, GG 🎮"
  ]
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReport() {
  const token = document.getElementById("tokenInput").value.trim();
  if (!token) return alert("Enter a token mint!");

  document.getElementById("report").innerHTML = "⏳ Generating Turbo Meme Report...";

  setTimeout(() => {
    const topMeme = getRandom(memes);
    const bottomMeme = getRandom(memes);

    const reportHTML = `
      <h2>📊 Turbo Tuga Meme Report</h2>
      <p><b>Supply:</b> ${getRandom(phrases.supply)}</p>
      <p><b>Holders:</b> ${getRandom(phrases.holders)}</p>
      <p><b>Price:</b> ${getRandom(phrases.price)}</p>
      <p><b>Token Tax:</b> ${getRandom(phrases.tax)}</p>
      <p><b>Burned:</b> ${getRandom(phrases.burned)}</p>
      <p><b>Lock Status:</b> ${getRandom(phrases.lock)}</p>
      <br>
      <a href="https://www.orca.so/?tokenIn=${token}&tokenOut=So11111111111111111111111111111111111111112" target="_blank">🐬 Buy Turbo Tuga on Orca</a>
      <br>
      <a href="https://jup.ag/swap?sell=${token}&buy=So11111111111111111111111111111111111111112" target="_blank">🚀 Buy Turbo Tuga on Jupiter</a>
      <br><br>
      <p>⚠️ Meme-only report. Nothing here is real data.</p>
    `;

    document.getElementById("report").innerHTML = reportHTML;
    document.getElementById("topMeme").innerHTML = `<img src="${topMeme}"/>`;
    document.getElementById("bottomMeme").innerHTML = `<img src="${bottomMeme}"/>`;
  }, 1000);
}

// Export PDF with html2pdf.js
function exportPDF() {
  const element = document.getElementById("reportContainer");
  html2pdf().from(element).save("TurboTugaMemeReport.pdf");
}

// Share to Twitter
function shareTwitter() {
  const text = encodeURIComponent("🚀 Turbo Tuga Meme Report is out! Check memes + buy link here: https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112");
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
}

// Share to Telegram
function shareTelegram() {
  const text = encodeURIComponent("😂 Turbo Tuga Meme Report just dropped!\n\nBuy Turbo Tuga on Orca or Jupiter 🚀\n\nOrca: https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112\nJupiter: https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112");
  window.open(`https://t.me/share/url?url=&text=${text}`, "_blank");
}
