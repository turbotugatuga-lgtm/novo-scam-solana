// 🔑 Configure aqui sua API KEY da Helius ou Alchemy
const RPC_ENDPOINT = "https://mainnet.helius-rpc.com/?api-key=SUA_API_KEY";
// Exemplo Alchemy: "https://solana-mainnet.g.alchemy.com/v2/SUA_API_KEY"

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
    name:"Unknown", symbol:"Unknown", supply:"N/A", decimals:"N/A",
    holders:"N/A", score: 0
  };

  try {
    // --- Supply ---
    const supplyInfo = await connection.getTokenSupply(mintPub);
    report.supply = supplyInfo.value.uiAmountString;
    report.decimals = supplyInfo.value.decimals;

    // --- Holders ---
    const largestAccounts = await connection.getTokenLargestAccounts(mintPub);
    report.holders = largestAccounts.value.length;

    // --- Score simples ---
    let score = 20;
    if(report.holders > 1000) score += 30;
    if(parseFloat(report.supply) > 0) score += 30;
    report.score = score;

    const status = score >= 70 ? "✅ Confiável" : score >= 50 ? "⚠️ Risco Médio" : "❌ Possível SCAM";

    // --- Meme aleatório ---
    const meme = memes[Math.floor(Math.random()*memes.length)];

    document.getElementById("report").innerHTML = `
      <h2>📊 Token Report</h2>
      <p><b>Mint:</b> ${mintInput}</p>
      <p><b>Supply / Decimals:</b> ${report.supply} / ${report.decimals}</p>
      <p><b>Holders:</b> ${report.holders}</p>
      <p><b>Score:</b> ${report.score}/100</p>
      <p><b>Status:</b> ${status}</p>
      <img src="${meme}" class="meme"/>
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

function exportPDF(){ alert("📄 Função PDF em desenvolvimento"); }
function shareTwitter(){
  const text = document.getElementById("report").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}
function shareTelegram(){
  const text = document.getElementById("report").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}
