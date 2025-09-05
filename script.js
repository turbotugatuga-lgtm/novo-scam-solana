// Banco de memes/GIFs
const memes = [
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif", // rocket
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif", // chart explosion
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif", // dancing
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif" // coin zoom
];

// Banco de frases meme
const phrases = {
  supply: ["🤔 Weird supply… clown alert!", "📈 Supply is off the charts!", "😂 Tiny supply, like my savings."],
  burned: ["🔥 Burned more than my pizza last night!", "💨 Tokens disappearing… poof!", "🔥 Burn baby burn!"],
  holders: ["👀 Only a few people holding this.", "🙃 Missing holders… nobody attended.", "🐢 Slow holders, barely moving."],
  price: ["💸 Price mooning?", "💰 Cheap as a candy bar!", "📉 Price dropping like my motivation."],
  locked: ["🔒 Token locked? Security first!", "🚫 No selling allowed!", "🛑 Blocked, sad times!"],
  revoked: ["⚠️ Admin revoked! Chaos!", "😱 No more authority!", "🤯 Total power gone!"],
  fee: ["💸 Taxed heavily!", "😂 Tiny tax, huge laughs!", "💰 Watch out for fees!"],
  whales: ["🐋 Whale spotted!", "🦈 Huge holder incoming!", "🐟 Sardine gang!"]
};

// Função helper para sortear
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateReport() {
  const token = document.getElementById("tokenMint").value.trim();
  if(!token) {
    alert("Please enter a token mint!");
    return;
  }

  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = `<p>⏳ Generating Turbo Tuga Ultra Meme report for <b>${token}</b>...</p>`;

  // Simula delay como se estivesse puxando dados
  setTimeout(() => {
    // Gerar dados fake/divertidos
    const supply = (Math.random()*1000000).toFixed(2);
    const holders = Math.floor(Math.random()*500);
    const burned = (Math.random()*50000).toFixed(0);
    const price = (Math.random()*5).toFixed(2);
    const locked = Math.random()>0.7 ? "Yes" : "No";
    const revoked = Math.random()>0.8 ? "Yes" : "No";
    const fee = Math.floor(Math.random()*20);
    const whales = Math.floor(Math.random()*3);

    // Pega 2 memes aleatórios
    let meme1 = randomItem(memes);
    let meme2 = randomItem(memes);
    while(meme2 === meme1) meme2 = randomItem(memes);

    // Monta relatório HTML
    reportDiv.innerHTML = `
      <h2>📊 Turbo Tuga Meme Report</h2>
      <p>Token: <b>${token}</b></p>

      <p>Supply: ${supply} <br> <i>${randomItem(phrases.supply)}</i></p>
      <p>Burned: ${burned} <br> <i>${randomItem(phrases.burned)}</i></p>
      <p>Holders: ${holders} <br> <i>${randomItem(phrases.holders)}</i></p>
      <p>Price: $${price} <br> <i>${randomItem(phrases.price)}</i></p>
      <p>Locked: ${locked} <br> <i>${randomItem(phrases.locked)}</i></p>
      <p>Admin Revoked: ${revoked} <br> <i>${randomItem(phrases.revoked)}</i></p>
      <p>Fee: ${fee}% <br> <i>${randomItem(phrases.fee)}</i></p>
      <p>Whales: ${whales} <br> <i>${randomItem(phrases.whales)}</i></p>

      <div class="memes">
        <img src="${meme1}" width="200" style="margin:10px;">
        <img src="${meme2}" width="200" style="margin:10px;">
      </div>

      <p>⚠️ This material is educational only — not financial advice.</p>

      <div class="buy-buttons">
        <a href="https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112" target="_blank">🐬 Buy Turbo Tuga on Orca</a>
        <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank">🚀 Buy Turbo Tuga on Jupiter</a>
      </div>
    `;
  }, 1200);
}
