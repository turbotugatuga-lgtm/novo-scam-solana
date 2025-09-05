const memes = [
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif"
];

const phrases = {
  supply: [
    "🤔 Weird supply… calculated by a clown.",
    "📈 Infinite supply? Just a prank.",
    "😂 Supply smaller than my bank account balance."
  ],
  holders: [
    "👀 Only a few people holding this.",
    "🙃 Missing holders… nobody attended.",
    "🐢 Slow holders, barely moving."
  ]
};

function randomItem(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}

function generateReport() {
  const token = document.getElementById("tokenInput").value.trim();
  if(!token) return alert("⚠️ Enter a token mint address!");

  // Fake data for meme purposes
  const supply = (Math.random()*1000000).toFixed(2);
  const holders = Math.floor(Math.random()*500);
  const decimals = Math.floor(Math.random()*10);

  const reportHTML = `
    <h2>📊 Turbo Tuga Token Report</h2>
    <p><b>Token Mint:</b> ${token}</p>
    <p><b>Supply:</b> ${supply} | Decimals: ${decimals} | ${randomItem(phrases.supply)}</p>
    <p><b>Holders (approx.):</b> ${holders} | ${randomItem(phrases.holders)}</p>
    <p><b>Status:</b> ❌ Possible SCAM (meme)</p>
    <div style="display:flex; justify-content:center; gap:10px; margin-top:15px;">
      ${memes.map(m => `<img src="${m}" style="max-width:100px">`).join('')}
    </div>
    <p>⚠️ This is for fun / educational purposes only — not financial advice.</p>
  `;
  document.getElementById("report").innerHTML = reportHTML;
}
