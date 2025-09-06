// Meme/Gif Bank
const memes = [
    '🚀 Turbo Tuga flying to the moon!',
    '💥 Boom! Price explosion!',
    '🤣 HODLers crying and laughing',
    '🐳 Whale sneezed, market crashed!',
    '🐟 Sardines everywhere!',
    '🛸 Alien token invasion!',
    '🔥 Token burning!',
    '🌕 To the moon!',
    '💸 Taxed like crazy!',
    '🎉 Party in the blockchain!',
    // add more 100+ memes
];

// Phrases per field
const phrases = {
    supply: [
        'Supply is wild, nobody knows!',
        'Only 1000 coins? LOL',
        'Infinite supply? Who cares!',
        'Supply exploded overnight!',
        'Some coins got burned, some lost!',
    ],
    burned: [
        'Burned? Not much, just enough to annoy whales.',
        'Daily burns? More like daily chaos.',
        'Tokens disappeared, but meme remains.',
        'Burned like my dreams of early profits.',
    ],
    holders: [
        'Holders are hiding, whales and sardines!',
        'Just a few rich guys, the rest moon-watching.',
        'Holders like a small town, everyone knows everyone.',
    ],
    price: [
        'Price is irrelevant, only memes matter.',
        'Price? LOL, we only go up or sideways.',
        'Price exploded like a rocket!',
    ],
    locked: [
        'Locked? Only for the brave.',
        'Token locked, chaos unlocked.',
        'Cannot sell, cannot HODL!',
    ],
    revoked: [
        'Revoked? Admin doing ninja moves.',
        'Revoked but still funny.',
    ],
    whale: [
        'Whale vs Sardine: a comedy show!',
        'Sardines everywhere, whales hiding.',
    ]
};

// Random helper
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate Meme Report
function generateReport() {
    const tokenCode = document.getElementById('tokenCode').value.trim();
    const tokenName = document.getElementById('tokenName').value.trim() || "Unknown";

    if (!tokenCode) {
        alert("Please enter a token code!");
        return;
    }

    const reportSection = document.getElementById('reportSection');

    // Select 5-6 random fields for report
    const fields = ['supply','burned','holders','price','locked','revoked','whale'];
    const selectedFields = [];
    while (selectedFields.length < 6) {
        const f = randomFromArray(fields);
        if (!selectedFields.includes(f)) selectedFields.push(f);
    }

    let reportHTML = `<h2>Meme Report for ${tokenName} (${tokenCode})</h2>`;
    reportHTML += `<p style="color:#ffcc00;">This is a fun meme report for entertainment only — not financial advice!</p>`;

    // Meme
    reportHTML += `<div style="font-size:2rem; margin:15px;">${randomFromArray(memes)}</div>`;

    // Report Fields
    reportHTML += `<ul>`;
    selectedFields.forEach(f => {
        const phrase = randomFromArray(phrases[f]);
        reportHTML += `<li><strong>${f.toUpperCase()}:</strong> ${phrase}</li>`;
    });
    reportHTML += `</ul>`;

    // Buy links
    reportHTML += `<div class="buy-buttons">
        <a href="https://orca.so/?tokenIn=${tokenCode}&tokenOut=So11111111111111111111111111111111111111112" target="_blank">🐬 Buy Turbo Tuga on Orca</a>
        <a href="https://jup.ag/swap?sell=${tokenCode}&buy=So11111111111111111111111111111111111111112" target="_blank">🪐 Buy Turbo Tuga on Jupiter</a>
    </div>`;

    // Social share buttons (simplified)
    const tweetText = encodeURIComponent(`Meme Report for ${tokenName} (${tokenCode})\n${reportHTML.replace(/<[^>]+>/g, '')}\nBuy Turbo Tuga!`);
    reportHTML += `<div style="margin-top:15px;">
        <a href="https://twitter.com/intent/tweet?text=${tweetText}" target="_blank">🐦 Share on Twitter</a> |
        <a href="https://t.me/share/url?url=https://yourwebsite.com&text=${tweetText}" target="_blank">📢 Share on Telegram</a>
    </div>`;

    reportSection.innerHTML = reportHTML;
}
