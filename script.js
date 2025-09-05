// Meme & phrase banks
const memes = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
];

const phrases = {
  supply: [
    "This token has more supply than my patience 🚀",
    "Supply looking like endless noodles 🍜",
    "Whoa! Someone printed a lot of these!"
  ],
  holders: [
    "Top holders are basically whales 🐋",
    "Only a few lucky sardines here 🐟",
    "This token is exclusive like VIP club 🏰"
  ],
  price: [
    "Looks like someone spilled rocket fuel 🚀",
    "Price is moonbound! 🌕",
    "Price? Who knows, just vibes 🌈"
  ],
  tax: [
    "Trading here might sting 🐝",
    "Every swap comes with a surprise 🎁",
    "Fee? More like a plot twist!"
  ],
  burned: [
    "Some coins went up in flames 🔥",
    "Burned like yesterday's toast 🍞",
    "Burned to make it spicy 🌶️"
  ]
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReport() {
  const token = document.getElementById("tokenInput").value.trim();
  if (!token) return alert("Enter a token mint!");

  // Clear previous report
  document.getElementById("report").innerHTML = "⏳ Generating Turbo Meme Report...";

  setTimeout(() => {
    // Pick memes
    const topMeme = getRandom(memes);
    const bottomMeme = getRandom(memes);

    // Generate report with only meme phrases
    const reportHTML = `
      <h2>📊 Turbo Tuga Meme Report</h2>
      <p><b>Supply:</b> ${getRandom(phrases.supply)}</p>
      <p><b>Holders:</b> ${getRandom(phrases.holders)}</p>
      <p><b>Price:</b> ${getRandom(phrases.price)}</p>
      <p><b>Token Tax:</b> ${getRandom(phrases.tax)}</p>
      <p><b>Burned:</b> ${getRandom(phrases.burned)}</p>
      <br>
      <p>⚠️ This is a fun meme report. It does NOT reflect real token data!</p>
    `;

    document.getElementById("report").innerHTML = reportHTML;
    document.getElementById("topMeme").innerHTML = `<img src="${topMeme}"/>`;
    document.getElementById("bottomMeme").innerHTML = `<img src="${bottomMeme}"/>`;
  }, 1000);
}

function exportPDF() { alert("PDF export coming soon!"); }
function shareTwitter() { alert("Share to Twitter coming soon!"); }
function shareTelegram() { alert("Share to Telegram coming soon!"); }
