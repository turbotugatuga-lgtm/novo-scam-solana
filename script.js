const generateBtn = document.getElementById("generateBtn");
const reportContainer = document.getElementById("reportContainer");

// Meme banks
const memesTop = [
    '🚀 Turbo Tuga going to the moon!',
    '💥 Exploding meme coins!',
    '🐬 HODL like a dolphin!',
    '📈 Charts going straight up!'
];
const memesBottom = [
    '🌕 Moon mission continues!',
    '💸 Whale alert!',
    '🤣 Just a meme report, relax!',
    '🔥 Price is totally random!'
];

// Phrases for each report field
const phrases = {
    supply: [
        "🐳 A whale just sneezed, market crashed!",
        "🪐 Supply looks weird, but who cares?",
        "💨 Token evaporated into the void."
    ],
    burned: [
        "🔥 Burned like my hopes!",
        "💣 Whoops, someone sent coins to Mars!",
        "📉 Daily transactions? LOL, just your mom buying."
    ],
    holders: [
        "💸 Taxed like crazy, moon soon!",
        "🐟 Sardines everywhere, whales hiding.",
        "😎 Hold tight, diamond hands!"
    ],
    price: [
        "🚨 Price unknown, panic or profit?",
        "💥 Revoked admin? Perfect, more chaos.",
        "📊 Chart says: Who knows!"
    ],
    locked: [
        "🔒 Locked until the end of time.",
        "🌕 Market cap? Infinite, maybe.",
        "⛓️ Can't sell, but you can dream!"
    ]
};

// Utility function
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate Meme Report
generateBtn.onclick = function() {
    const tokenCode = document.getElementById("tokenCode").value || "Unknown";
    const tokenName = document.getElementById("tokenName").value || "Turbo Tuga";

    if(!tokenCode) {
        alert("Please enter a token code!");
        return;
    }

    const topMeme = randomElement(memesTop);
    const bottomMeme = randomElement(memesBottom);

    reportContainer.innerHTML = `
        <h2>${tokenName} Meme Report</h2>
        <p class="report-warning">⚠️ This is a FUN meme report! Not real financial advice. ⚠️</p>
        <p><strong>Token:</strong> ${tokenName} — ${tokenCode}</p>
        <ul>
            <li><strong>Supply:</strong> ${randomElement(phrases.supply)}</li>
            <li><strong>Burned Tokens:</strong> ${randomElement(phrases.burned)}</li>
            <li><strong>Holders:</strong> ${randomElement(phrases.holders)}</li>
            <li><strong>Price:</strong> ${randomElement(phrases.price)}</li>
            <li><strong>Locked:</strong> ${randomElement(phrases.locked)}</li>
        </ul>
        <div class="meme-top">${topMeme}</div>
        <div class="meme-bottom">${bottomMeme}</div>
        <div class="buy-buttons">
            <a href="https://orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112" target="_blank">Buy Turbo Tuga on Orca 🐬</a>
            <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank">Buy Turbo Tuga on Jupiter 🪐</a>
        </div>
    `;

    // Optional: Export PDF (using html2pdf.js or similar)
    // Optional: Social share (Twitter / Telegram)
};
