// 🔑 RPC configurado com sua chave da Helius
const RPC_ENDPOINT = "https://mainnet.helius-rpc.com/?api-key=66d627c2-34b8-4c3e-9123-14f16e196ab8";
const connection = new solanaWeb3.Connection(RPC_ENDPOINT);

const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif"
];

async function generateReport(){
  const mintInput = document.getElementById("tokenInput").value.trim();
  if(!mintInput) return alert("⚠️ Informe um token mint válido");

  const mintPub = new solanaWeb3.PublicKey(mintInput);

  let report = {
    name:"Unknown", symbol:"Unknown", image:"", website:"N/A", twitter:"N/A", discord:"N/A",
    supply:"N/A", decimals:"N/A", holders:"N/A", score: 0
  };

  try {
    // --- Supply ---
    const supplyInfo = await connection.getTokenSupply(mintPub);
    report.supply = supplyInfo.value.uiAmountString;
    report.decimals = supplyInfo.value.decimals;

    // --- Holders ---
    const largestAccounts = await connection.getTokenLargestAccounts(mintPub);
    report.holders = largestAccounts.value.length;

    // --- Metaplex Metadata ---
    const TOKEN_METADATA_PROGRAM_ID = new solanaWeb3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

    const [metadataPDA] = await solanaWeb3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPub.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if (accountInfo) {
      const decoded = new TextDecoder("utf-8").decode(accountInfo.data);
      const urlMatch = decoded.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const metadataUrl = urlMatch[0].replace(/\u0000/g, "");
        const resp = await fetch(metadataUrl);
        const json = await resp.json();
        report.name = json.name || "Unknown";
        report.symbol = json.symbol || "Unknown";
        report.image = json.image || "";
        if (json.extensions) {
          report.website = json.extensions.website || "N/A";
          report.twitter = json.extensions.twitter || "N/A";
          report.discord = json.extensions.discord || "N/A";
        }
      }
    }

    // --- Score ---
    let score = 20;
    if(report.holders > 1000) score += 30;
    if(parseFloat(report.supply) > 0) score += 30;
    if(report.website !== "N/A") score += 10;
    if(report.twitter !== "N/A") score += 5;
    report.score = score;

    const status = score >= 70 ? "✅ Confiável" : score >= 50 ? "⚠️ Risco Médio" : "❌ Possível SCAM";

    const meme = memes[Math.floor(Math.random()*memes.length)];

    document.getElementById("report").innerHTML = `
      <div id="reportContent">
        <h2>📊 Token Report</h2>
        <p><b>Name / Symbol:</b> ${report.name} (${report.symbol})</p>
        <p><b>Mint:</b> ${mintInput}</p>
        <p><b>Supply / Decimals:</b> ${report.supply} / ${report.decimals}</p>
        <p><b>Holders:</b> ${report.holders}</p>
        <p><b>Website:</b> ${report.website}</p>
        <p><b>Twitter:</b> ${report.twitter}</p>
        <p><b>Discord:</b> ${report.discord}</p>
        <p><b>Score:</b> ${report.score}/100</p>
        <p><b>Status:</b> ${status}</p>
        ${report.image ? `<img src="${report.image}" alt="Logo" style="max-width:120px; border-radius:8px;"/>` : ""}
        <img src="${meme}" class="meme"/>
      </div>
      <div style="margin-top:20px;">
        <button onclick="window.open('https://app.orca.so', '_blank')">🐬 Buy on Orca</button>
        <button onclick="window.open('https://jup.ag', '_blank')">🚀 Buy on Jupiter</button>
        <button onclick="exportPDF()">📄 PDF</button>
        <button onclick="shareTwitter()">🐦 Share Twitter</button>
        <button onclick="shareTelegram()">📢 Share Telegram</button>
      </div>
    `;

  } catch(err){
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
  }
}

// --- Exportar PDF ---
function exportPDF(){
  const element = document.getElementById("reportContent");
  html2pdf().from(element).save("TurboTuga_Report.pdf");
}

// --- Compartilhar ---
function shareTwitter(){
  const text = document.getElementById("reportContent").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}
function shareTelegram(){
  const text = document.getElementById("reportContent").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}
