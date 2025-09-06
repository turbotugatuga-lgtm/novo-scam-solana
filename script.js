function generateReport() {
  const token = document.getElementById("tokenAddress").value || "Turbo Tuga";
  const report = document.getElementById("report");

  setRandomBackground();

  const memePhrases = [
    "💀 Supply looks cursed but diamond hands prevail.",
    "🐳 A whale just sneezed, and the market crashed.",
    "🚀 Token locked? Nah, it’s turbo-boosted.",
    "🔥 Revoked admin? Perfect, more chaos.",
    "💸 Taxed like crazy, but who cares, moon soon!",
    "🐟 Sardines everywhere, whales hiding.",
    "📉 Daily transactions? LOL, just your mom buying.",
    "🌕 Market cap? Infinite, if you squint hard enough."
  ];

  const randomPhrase = () => memePhrases[Math.floor(Math.random() * memePhrases.length)];

  report.innerHTML = `
    <h2>📊 Turbo Tuga Meme Report for ${token}</h2>
    <p><b>Supply:</b> ${randomPhrase()}</p>
    <p><b>Burned Tokens:</b> ${randomPhrase()}</p>
    <p><b>Holders:</b> ${randomPhrase()}</p>
    <p><b>Price:</b> ${randomPhrase()}</p>
    <p><b>Locked:</b> ${randomPhrase()}</p>
    <p><b>Revoked:</b> ${randomPhrase()}</p>
    <p><b>Whale vs Sardine:</b> ${randomPhrase()}</p>
    <br>
    <img src="https://i.imgur.com/4k6ZQWe.png" width="150">
    <img src="https://i.imgur.com/jW3DC0E.png" width="150">
    <br><br>
    <a href="https://orca.so/" target="_blank" class="buy-btn">🐬 Buy Turbo Tuga on Orca</a>
    <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank" class="buy-btn">🪐 Buy Turbo Tuga on Jupiter</a>
  `;
}

function setRandomBackground() {
  const bg = reportBackgrounds[Math.floor(Math.random() * reportBackgrounds.length)];
  const reportContainer = document.getElementById("reportContainer");
  reportContainer.style.background = `url('${bg}') no-repeat center center`;
  reportContainer.style.backgroundSize = "cover";
}

function shareOnTwitter() {
  const text = encodeURIComponent(document.getElementById("report").innerText + "\n\n🐬 Buy on Orca: https://orca.so/ \n🪐 Buy on Jupiter: https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112");
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
}

function shareOnTelegram() {
  const text = encodeURIComponent(document.getElementById("report").innerText + "\n\n🐬 Buy on Orca: https://orca.so/ \n🪐 Buy on Jupiter: https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112");
  window.open(`https://t.me/share/url?url=${text}`, "_blank");
}

function downloadPDF() {
  alert("📄 PDF export coming soon with memes included!");
}
