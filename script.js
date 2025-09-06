// ----------------- Meme Bank -----------------
const memes = [
    "memes/rocket.gif",
    "memes/chart.png",
    "memes/whale.png",
    "memes/moon.gif",
    "memes/explosion.gif"
    // adicione mais de 100 gifs/imagens
];

// ----------------- Phrase Bank -----------------
const phrases = {
    supply: [
        "Infinite supply? Who cares!", "Supply exploded! 🔥", "Nothing left, LOL", "Supply is secret 🤫", "All burned but safe!"
    ],
    burned: [
        "Tokens disappeared, meme remains.", "Burned faster than pizza!", "Nothing burned, all safe!", "Burned for fun!", "Oops burned!"
    ],
    holders: [
        "Holders like a small town, everyone knows everyone.", "Just 3 whales holding everything!", "Everyone has some tokens!", "Holders hiding 🕵️", "Top 3 own 90%!"
    ],
    price: [
        "Price? LOL, we only go up!", "Down? No worries!", "Moon incoming!", "Price is meme!", "Priceless!"
    ],
    locked: [
        "Locked? Perfect, more chaos!", "Free to sell, maybe...", "Token jail activated.", "Locked tight!", "No escape!"
    ],
    revoked: [
        "Revoked? Admin ninja moves.", "All good, nothing revoked.", "Oops, revoked!", "Admin revoked? LOL", "Revoked like a boss!"
    ],
    whale: [
        "Whales hiding!", "Whale splashes!", "Whale just sneezed!", "Whale dancing!", "Whale alert!"
    ],
    marketCap: [
        "Infinite, if you squint.", "Market cap skyrocketing!", "Tiny but mighty.", "Huge cap LOL", "Market exploding!"
    ],
    topHolder: [
        "Top holder is a legend!", "Someone owns 50%!", "Top 3 holding 90%!", "Whale power!", "Top 5 are gods!"
    ],
    transactions: [
        "Lots of trades today!", "Quiet day in crypto.", "Meme trades only!", "Transactions everywhere!", "Trading frenzy!"
    ]
};

// ----------------- Helpers -----------------
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ----------------- Generate Report -----------------
function generateReport() {
    const tokenCode = document.getElementById('tokenCode').value.trim();
    const tokenName = document.getElementById('tokenName').value.trim() || "Unknown";

    if (!tokenCode) {
        alert("Please enter a token code!");
        return;
    }

    const reportSection = document.getElementById('reportSection');

    // Selecionar 5 a 6 campos aleatórios
    const fields = Object.keys(phrases);
    const selectedFields = [];
    while (selectedFields.length < 6) {
        const f = randomFromArray(fields);
        if (!selectedFields.includes(f)) selectedFields.push(f);
    }

    // Selecionar 1 meme
    const selectedMeme = randomFromArray(memes);

    // Gerar HTML do relatório
    let reportHTML = `<h2>Meme Report for ${tokenName} (${tokenCode})</h2>`;
    reportHTML += `<p style="color:#ffcc00;">This is a fun meme report for entertainment only — not financial advice!</p>`;
    reportHTML += `<div><img src="${selectedMeme}" alt="meme"></div>`;
    reportHTML += `<ul>`;
    selectedFields.forEach(f => {
        const phrase = randomFromArray(phrases[f]);
        reportHTML += `<li><strong>${f.toUpperCase()}:</strong> ${phrase}</li>`;
    });
    reportHTML += `</ul>`;

    // Botões de compra
    reportHTML += `<div class="buy-buttons">
        <a href="https://orca.so/?tokenIn=${tokenCode}&tokenOut=So11111111111111111111111111111111111111112" target="_blank">🐬 Buy Turbo Tuga on Orca</a>
        <a href="https://jup.ag/swap?sell=${tokenCode}&buy=So11111111111111111111111111111111111111112" target="_blank">🪐 Buy Turbo Tuga on Jupiter</a>
    </div>`;

    reportSection.innerHTML = reportHTML;
}

// ----------------- Event Listener -----------------
document.getElementById("generateBtn").addEventListener("click", generateReport);
