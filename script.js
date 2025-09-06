function generateReport() {
    const tokenCode = document.getElementById('tokenCode').value.trim();
    const tokenName = document.getElementById('tokenName').value.trim() || "Unknown";

    if (!tokenCode) {
        alert("Please enter a token code!");
        return;
    }

    const reportSection = document.getElementById('reportSection');

    // Seleciona 5 análises aleatórias
    const fields = ['supply','burned','holders','price','locked','revoked','whale','marketCap','topHolder','transactions'];
    const selectedFields = [];
    while (selectedFields.length < 5) {
        const f = randomFromArray(fields);
        if (!selectedFields.includes(f)) selectedFields.push(f);
    }

    // Meme/gif
    const meme = randomFromArray(memes);

    // Monta o relatório HTML
    let reportHTML = `<h2>Meme Report for ${tokenName} (${tokenCode})</h2>`;
    reportHTML += `<p style="color:#ffcc00;">This is a fun meme report for entertainment only — not financial advice!</p>`;
    reportHTML += `<div style="font-size:2rem; margin:15px;">${meme}</div>`; // figura/gif
    reportHTML += `<ul>`;
    selectedFields.forEach(f => {
        const phrase = randomFromArray(phrases[f] || ['Nothing special here']);
        reportHTML += `<li><strong>${f.toUpperCase()}:</strong> ${phrase}</li>`;
    });
    reportHTML += `</ul>`;

    // Botões de compra
    reportHTML += `<div class="buy-buttons">
        <a href="https://orca.so/?tokenIn=${tokenCode}&tokenOut=So11111111111111111111111111111111111111112" target="_blank">🐬 Buy Turbo Tuga on Orca</a>
        <a href="https://jup.ag/swap?sell=${tokenCode}&buy=So11111111111111111111111111111111111111112" target="_blank">🪐 Buy Turbo Tuga on Jupiter</a>
    </div>`;

    // Preparar texto para redes sociais
    let socialText = `Meme Report for ${tokenName} (${tokenCode})\nThis is a fun meme report for entertainment only — not financial advice!\n`;
    selectedFields.forEach(f => {
        const phrase = randomFromArray(phrases[f] || ['Nothing special here']);
        socialText += `${f.toUpperCase()}: ${phrase}\n`;
    });
    socialText += `Buy Turbo Tuga! 🐬🪐\n#TurboTuga`;

    const tweetText = encodeURIComponent(socialText);
    reportHTML += `<div style="margin-top:15px;">
        <a href="https://twitter.com/intent/tweet?text=${tweetText}" target="_blank">🐦 Share on Twitter</a> |
        <a href="https://t.me/share/url?url=https://yourwebsite.com&text=${tweetText}" target="_blank">📢 Share on Telegram</a>
    </div>`;

    reportSection.innerHTML = reportHTML;
}
