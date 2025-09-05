const RPC_ENDPOINT = "https://mainnet.helius-rpc.com/?api-key=66d627c2-34b8-4c3e-9123-14f16e196ab8";
const connection = new solanaWeb3.Connection(RPC_ENDPOINT);

const OFFICIAL_TOKENS = [
  "So11111111111111111111111111111111111111112", // SOL
  "mSo111111111111111111111111111111111111111", // wSOL
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" // USDC
];

const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3ohhwJ7h5wcC2D5nna/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif"
];

async function generateReport() {
  const mintInput = document.getElementById("tokenInput").value.trim();
  if (!mintInput) return alert("⚠️ Informe um token mint válido");

  const mintPub = new solanaWeb3.PublicKey(mintInput);
  let report = {
    name: "Unknown",
    symbol: "Unknown",
    supply: "N/A",
    decimals: "N/A",
    holders: "N/A",
    topHolders: [],
    mintAuthority: "N/A",
    freezeAuthority: "N/A",
    website: "N/A",
    twitter: "N/A",
    discord: "N/A",
    creationDate: "N/A",
    price: "N/A",
    liquidity: "N/A",
    taxSell: "N/A",
    burned: "N/A",
    criteria: []
  };

  try {
    // --- Token oficial ---
    if (OFFICIAL_TOKENS.includes(mintInput)) {
      report.name = mintInput === "So11111111111111111111111111111111111111112" ? "SOL" :
                     mintInput.includes("mSo") ? "wSOL" : "USDC";
      report.score = 100;
      let badgeClass = "badge-safe";
      document.getElementById("report").innerHTML = `
        <div id="reportContent">
          <h2>📊 Turbo Tuga Token Report</h2>
          <p>✅ Token oficial da Solana</p>
          <p><b>Name / Symbol:</b> ${report.name} / ${report.symbol}</p>
          <p><b>Score Total:</b> ${report.score}/100 <span class="${badgeClass}">✅ Confiável</span></p>
          <p><b>Mint:</b> ${mintInput}</p>
          <img src="${memes[Math.floor(Math.random() * memes.length)]}" class="meme"/>
          <p>
            <a href="https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112" target="_blank">Comprar Turbo Tuga em DEX Orca</a> | 
            <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank">Comprar Token Turbo Tuga dex Jupiter</a>
          </p>
          <p><i>⚠️ Este material é educativo e não é indicação de compra ou venda.</i></p>
        </div>
        <div style="margin-top:20px;">
          <button onclick="exportPDF()">📄 Exportar PDF</button>
          <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
          <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
        </div>
      `;
      return;
    }

    // --- Token SPL ---
    const mintAccount = await connection.getParsedAccountInfo(mintPub);
    if (mintAccount.value && mintAccount.value.data.parsed) {
      const info = mintAccount.value.data.parsed.info;
      report.supply = info.supply;
      report.decimals = info.decimals;
      report.mintAuthority = info.mintAuthority || "null";
      report.freezeAuthority = info.freezeAuthority || "null";
      report.criteria.push({ name: "Supply", value: report.supply, points: 10 });
      report.criteria.push({ name: "Mint Authority", value: report.mintAuthority, points: report.mintAuthority === "null" ? 10 : 0 });
      report.criteria.push({ name: "Freeze Authority", value: report.freezeAuthority, points: report.freezeAuthority === "null" ? 5 : 0 });
    }

    // --- Top holders ---
    try {
      const largestAccounts = await connection.getTokenLargestAccounts(mintPub);
      report.topHolders = largestAccounts.value
        .slice(0, 10)
        .map(a => ({ address: a.address, amount: a.uiAmountString || a.amount }));
      report.holders = largestAccounts.value.length;
      report.criteria.push({
        name: "Holders",
        value: report.holders,
        points: report.holders > 1000 ? 20 : 10
      });
    } catch (err) {
      console.warn("Não foi possível obter holders:", err.message);
    }

    // --- Metadata simplificado ---
    const TOKEN_METADATA_PROGRAM_ID = new solanaWeb3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    const [metadataPDA] = await solanaWeb3.PublicKey.findProgramAddress(
      [new TextEncoder().encode("metadata"), TOKEN_METADATA_PROGRAM_ID.toBytes(), mintPub.toBytes()],
      TOKEN_METADATA_PROGRAM_ID
    );
    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if (accountInfo) {
      const decoded = new TextDecoder("utf-8").decode(accountInfo.data);
      const urlMatch = decoded.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const metadataUrl = urlMatch[0].replace(/\u0000/g, "");
        try {
          const resp = await fetch(metadataUrl);
          const json = await resp.json().catch(() => ({}));
          report.name = json.name || report.name;
          report.symbol = json.symbol || report.symbol;
          report.website = json.extensions?.website || "N/A";
          report.twitter = json.extensions?.twitter || "N/A";
          report.discord = json.extensions?.discord || "N/A";
          report.criteria.push({ name: "Metadata Name", value: report.name, points: report.name !== "Unknown" ? 10 : 0 });
          report.criteria.push({ name: "Metadata Symbol", value: report.symbol, points: report.symbol !== "Unknown" ? 10 : 0 });
          report.criteria.push({ name: "Website", value: report.website, points: report.website !== "N/A" ? 5 : 0 });
          report.criteria.push({ name: "Twitter", value: report.twitter, points: report.twitter !== "N/A" ? 5 : 0 });
          report.criteria.push({ name: "Discord", value: report.discord, points: report.discord !== "N/A" ? 5 : 0 });
        } catch (e) { console.warn("JSON inválido", e); }
      }
    }

    // --- Data de criação do mint ---
    try {
      const mintInfo = await connection.getAccountInfo(mintPub);
      if (mintInfo) {
        const blockTime = await connection.getBlockTime(mintInfo.lamports); // Helius não fornece direto, placeholder
        if (blockTime) report.creationDate = new Date(blockTime * 1000).toLocaleDateString();
        else report.creationDate = "N/A";
      }
    } catch (e) { report.creationDate = "N/A"; }

    // --- Placeholders para preço, liquidez, taxa de venda, queimado ---
    report.price = "N/A"; 
    report.liquidity = "N/A"; 
    report.taxSell = "N/A"; 
    report.burned = "N/A";

    // --- Score e status ---
    report.score = report.criteria.reduce((a, c) => a + c.points, 0);
    let status = "", badgeClass = "";
    if (report.score >= 70) { status = "✅ Confiável"; badgeClass = "badge-safe"; }
    else if (report.score >= 50) { status = "⚠️ Risco Médio"; badgeClass = "badge-medium"; }
    else { status = "❌ Possível SCAM"; badgeClass = "badge-scam"; }

    const meme = memes[Math.floor(Math.random() * memes.length)];
    const tableRows = report.criteria.map(c => `<tr><td>${c.name}</td><td>${c.value}</td><td class="score-badge">${c.points}</td></tr>`).join("");
    const topHoldersHTML = report.topHolders.map(h => `<li>${h.address}: ${h.amount}</li>`).join("");

    document.getElementById("report").innerHTML = `
      <div id="reportContent">
        <h2>📊 Turbo Tuga Token Report</h2>
        <img src="${meme}" class="meme"/>
        <table class="table-score">
          <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
          ${tableRows}
        </table>
        <p><b>Score Total:</b> ${report.score}/100 <span class="${badgeClass}">${status}</span></p>
        <p><b>Mint Turbo Tuga:</b> 9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ</p>
        <p><b>Data de Criação:</b> ${report.creationDate}</p>
        <p><b>Preço:</b> ${report.price} | <b>Liquidez:</b> ${report.liquidity} | <b>Taxa de venda:</b> ${report.taxSell} | <b>Queimado:</b> ${report.burned}</p>
        <p><b>Top 10 Holders:</b></p>
        <ul>${topHoldersHTML}</ul>
        <p>
          <a href="https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112" target="_blank">Comprar Turbo Tuga em DEX Orca</a> | 
          <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank">Comprar Token Turbo Tuga dex Jupiter</a>
        </p>
        <p><i>⚠️ Este material é educativo e não é indicação de compra ou venda.</i></p>
      </div>
      <div style="margin-top:20px;">
        <button onclick="exportPDF()">📄 Exportar PDF</button>
        <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
        <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
      </div>
    `;

  } catch (err) {
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
  }
}

// --- PDF ---
function exportPDF() {
  const element = document.getElementById("reportContent");
  html2pdf().from(element).save("TurboTuga_Report.pdf");
}

// --- Redes sociais ---
function shareTwitter() {
  const text = document.getElementById("reportContent").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}
function shareTelegram() {
  const text = document.getElementById("reportContent").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}
