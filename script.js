const RPC_ENDPOINT = "https://mainnet.helius-rpc.com/?api-key=66d627c2-34b8-4c3e-9123-14f16e196ab8";
const connection = new solanaWeb3.Connection(RPC_ENDPOINT);

// Banco de memes + 50+ GIFs
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
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/3oKIPCSX4UHmuS41TG/giphy.gif",
  "https://media.giphy.com/media/xT1Ra4uO6t8U6uR8Le/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
  "https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif",
  "https://media.giphy.com/media/3o6fJ1BM7r60LymVji/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/26gsspf0C0j7M2z20/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/3oKIPCSX4UHmuS41TG/giphy.gif",
  "https://media.giphy.com/media/xT1Ra4uO6t8U6uR8Le/giphy.gif",
  "https://media.giphy.com/media/3o6fJ1BM7r60LymVji/giphy.gif",
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif",
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif"
];

async function generateReport(){
  const mintInput = document.getElementById("tokenInput").value.trim();
  if(!mintInput) return alert("⚠️ Informe um token mint válido");

  const mintPub = new solanaWeb3.PublicKey(mintInput);
  let report = {name:"Unknown", symbol:"Unknown", image:"", website:"N/A", twitter:"N/A", discord:"N/A", supply:"N/A", decimals:"N/A", holders:"N/A", score:0, criteria:[]};

  try {
    // --- Supply ---
    const supplyInfo = await connection.getTokenSupply(mintPub);
    report.supply = supplyInfo.value.uiAmountString;
    report.decimals = supplyInfo.value.decimals;
    report.criteria.push({name:"Supply", value: report.supply, points: report.supply>0?10:0});

    // --- Holders ---
    const largestAccounts = await connection.getTokenLargestAccounts(mintPub);
    report.holders = largestAccounts.value.length;
    report.criteria.push({name:"Holders", value: report.holders, points: report.holders>1000?20:10});

    // --- Metaplex Metadata ---
    const TOKEN_METADATA_PROGRAM_ID = new solanaWeb3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    const [metadataPDA] = await solanaWeb3.PublicKey.findProgramAddress(
      [new TextEncoder().encode("metadata"), TOKEN_METADATA_PROGRAM_ID.toBytes(), mintPub.toBytes()],
      TOKEN_METADATA_PROGRAM_ID
    );

    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if(accountInfo){
      const decoded = new TextDecoder("utf-8").decode(accountInfo.data);
      const urlMatch = decoded.match(/https?:\/\/[^\s]+/);
      if(urlMatch){
        const metadataUrl = urlMatch[0].replace(/\u0000/g,"");
        try{
          const resp = await fetch(metadataUrl);
          const json = await resp.json().catch(()=>({}));
          report.name = json.name||"Unknown";
          report.symbol = json.symbol||"Unknown";
          report.image = json.image||"";
          report.criteria.push({name:"Metadata Name", value: report.name, points: report.name!=="Unknown"?10:0});
          report.criteria.push({name:"Metadata Symbol", value: report.symbol, points: report.symbol!=="Unknown"?10:0});
          if(json.extensions){
            report.website = json.extensions.website||"N/A";
            report.twitter = json.extensions.twitter||"N/A";
            report.discord = json.extensions.discord||"N/A";
            report.criteria.push({name:"Website", value: report.website, points: report.website!=="N/A"?5:0});
            report.criteria.push({name:"Twitter", value: report.twitter, points: report.twitter!=="N/A"?5:0});
            report.criteria.push({name:"Discord", value: report.discord, points: report.discord!=="N/A"?5:0});
          }
        } catch(e){ console.warn("JSON inválido", e); }
      }
    }

    // --- Score e status ---
    report.score = report.criteria.reduce((a,c)=>a+c.points,0);
    let status="", badgeClass="";
    if(report.score>=70){ status="✅ Confiável"; badgeClass="badge-safe"; }
    else if(report.score>=50){ status="⚠️ Risco Médio"; badgeClass="badge-medium"; }
    else { status="❌ Possível SCAM"; badgeClass="badge-scam"; }

    const meme = memes[Math.floor(Math.random()*memes.length)];
    const tableRows = report.criteria.map(c=>`<tr><td>${c.name}</td><td>${c.value}</td><td class="score-badge">${c.points}</td></tr>`).join("");

    document.getElementById("report").innerHTML = `
      <div id="reportContent">
        <h2>📊 Turbo Tuga Token Report</h2>
        ${report.image?`<img src="${report.image}" alt="Logo" style="max-width:120px; border-radius:8px; display:block; margin:auto;"/>`:""}
        <img src="${meme}" class="meme"/>
        <table class="table-score">
          <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
          ${tableRows}
        </table>
        <p><b>Score Total:</b> ${report.score}/100 <span class="${badgeClass}">${status}</span></p>
        <p><b>Mint Turbo Tuga:</b> 9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ</p>
        <p>
          <a href="https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112" target="_blank">Comprar Turbo Tuga em DEX Orca</a> | 
          <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank">Comprar Token Turbo Tuga dex Jupiter</a>
        </p>
      </div>
      <div style="margin-top:20px;">
        <button onclick="exportPDF()">📄 Exportar PDF</button>
        <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
        <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
      </div>
    `;
  } catch(err){
    console.error(err);
    document.getElementById("report").innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
  }
}

// --- PDF ---
function exportPDF(){
  const element = document.getElementById("reportContent");
  html2pdf().from(element).save("TurboTuga_Report.pdf");
}

// --- Redes sociais ---
function shareTwitter(){
  const text = document.getElementById("reportContent").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,"_blank");
}
function shareTelegram(){
  const text = document.getElementById("reportContent").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`,"_blank");
}
