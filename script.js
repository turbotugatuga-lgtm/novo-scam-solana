// --- Meme & GIF banks ---
const memesTop = [
  "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  // ... adicione até 100 memes/GIFs
];

const memesBottom = [
  "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  // ... adicione até 100 memes/GIFs
];

const phrases = {
  supply: [
    "This coin has more supply than my patience 🚀",
    "Supply looks fishy... 🐟",
    "Too much supply, not enough sense 😅"
  ],
  holders: [
    "Top holders are basically whales 🐋",
    "Everyone else is just a sardine 🐟",
    "Holders concentrated like a rocket crew 👨‍🚀"
  ],
  price: [
    "Price went to the moon 🌕 or crashed 💥",
    "Looks like someone spilled rocket fuel 🚀",
    "Price is hotter than my coffee ☕"
  ],
  tax: [
    "Someone’s sneaky with fees 😏",
    "Taxed like crazy! 💸",
    "Trading here might sting 🐝"
  ]
  // ... pode expandir para 50+ frases por campo
};

// --- Função de relatório ---
function generateReport() {
  const tokenMint = document.getElementById("tokenInput").value.trim();
  if(!tokenMint) return alert("Enter a valid token mint address!");

  const topMeme = memesTop[Math.floor(Math.random()*memesTop.length)];
  const bottomMeme = memesBottom[Math.floor(Math.random()*memesBottom.length)];

  // Fake data generator para meme/animação
  const supply = (Math.random()*1e9).toFixed(2);
  const holders = Math.floor(Math.random()*500);
  const price = (Math.random()*10).toFixed(2);
  const score = Math.floor(Math.random()*100);
  const status = score>70?"✅ Trustworthy":score>30?"⚠️ Medium Risk":"❌ Possible SCAM";

  const phraseSupply = phrases.supply[Math.floor(Math.random()*phrases.supply.length)];
  const phraseHolders = phrases.holders[Math.floor(Math.random()*phrases.holders.length)];
  const phrasePrice = phrases.price[Math.floor(Math.random()*phrases.price.length)];
  const phraseTax = phrases.tax[Math.floor(Math.random()*phrases.tax.length)];

  document.getElementById("report").innerHTML = `
    <img src="${topMeme}" alt="Top Meme" />
    <h2>📊 Turbo Tuga Token Report</h2>
    <p><b>Status:</b> ${status}</p>
    <p><b>Token Mint:</b> ${tokenMint}</p>
    <p><b>Supply:</b> ${supply} | ${phraseSupply}</p>
    <p><b>Holders:</b> ${holders} | ${phraseHolders}</p>
    <p><b>Price:</b> $${price} | ${phrasePrice}</p>
    <p><b>Tax / Fees:</b> ${phraseTax}</p>
    <p>⚠️ This material is educational — not investment advice.</p>
    <div style="margin-top:10px;">
      <button onclick="shareTwitter()">🐦 Share on Twitter</button>
      <button onclick="shareTelegram()">📢 Share on Telegram</button>
      <button onclick="exportPDF()">📄 Export PDF</button>
    </div>
    <img src="${bottomMeme}" alt="Bottom Meme" />
  `;
}

// --- Compartilhamento ---
function shareTwitter(){
  const text = document.getElementById("report").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}
function shareTelegram(){
  const text = document.getElementById("report").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}

// --- PDF export (simples) ---
function exportPDF() {
  alert("PDF export feature is in development 😎");
}
