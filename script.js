const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));

const TOKEN_METADATA_PROGRAM_ID = new solanaWeb3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/26gsspf0C0j7M2z20/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/3o6fJ1BM7r60LymVji/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
  "https://media.giphy.com/media/3oKIPCSX4UHmuS41TG/giphy.gif",
  "https://media.giphy.com/media/xT1Ra4uO6t8U6uR8Le/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
  "https://media.giphy.com/media/3ohhwJ7h5wcC2D5nna/giphy.gif",
  "https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif",
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/xT0GqeSlGSRQutnWHe/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3ohhwJ7h5wcC2D5nna/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif"
];

async function generateReport(){
  const mintInput = document.getElementById("tokenInput").value.trim();
  if(!mintInput) return alert("⚠️ Informe um token mint válido");

  const mintPub = new solanaWeb3.PublicKey(mintInput);

  let report = {
    name:"Unknown", symbol:"Unknown", supply:"N/A", decimals:"N/A",
    holders:"N/A", mintAuthority:"N/A", freezeAuthority:"N/A",
    website:"N/A", twitter:"N/A", discord:"N/A"
  };

  try {
    // --- Metaplex metadata ---
    const [metadataPDA] = await solanaWeb3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintPub.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if(accountInfo){
      const metadataBuffer = accountInfo.data;
      // Decoding Metaplex metadata (simplificado)
      const metadataStr = metadataBuffer.toString();
      report.name = "Token Name";
      report.symbol = "SYMBOL";
      report.website = "https://example.com";
    }

    // --- Token supply & holders ---
    const supplyInfo = await connection.getTokenSupply(mintPub);
    report.supply = supplyInfo.value.uiAmountString;
    report.decimals = supplyInfo.value.decimals;

    const largestAccounts = await connection.getTokenLargestAccounts(mintPub);
    report.holders = largestAccounts.value.length;

    // --- Score simplificado ---
    let score = 50;
    if(report.holders > 1000) score +=20;

    // --- Meme aleatório ---
    const meme = memes[Math.floor(Math.random()*memes.length)];

    document.getElementById("report").innerHTML = `
      <h2>📊 Token Report</h2>
      <p><b>Name / Symbol:</b> ${report.name} (${report.symbol})</p>
      <p><b>Mint:</b> ${mintInput}</p>
      <p><b>Score:</b> ${score}/100</p>
      <p><b>Supply / Decimals:</b> ${report.supply} / ${report.decimals}</p>
      <p><b>Holders:</b> ${report.holders}</p>
      <p><b>Website:</b> ${report.website}</p>
      <p><b>Twitter:</b> ${report.twitter}</p>
      <p><b>Discord:</b> ${report.discord}</p>
      <img src="${meme}" class="meme"/>
      <div style="margin-top:20px;">
        <button onclick="window.open('https://app.orca.so', '_blank')">🐬 Buy on Orca</button>
        <button onclick="window.open('https://jup.ag', '_blank')">🚀 Buy on Jupiter</button>
        <button onclick="window.open('https://solscan.io/account/2NERt9zLBG2tKbcPXwfBYsRrPhFMVAxpR6ajfeEWeJSB','_blank')">❤️ Donate</button>
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
