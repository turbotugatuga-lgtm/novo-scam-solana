// --- Configurações ---
const Helius_API_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";
const TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const OFFICIAL_TOKENS = {
  "So11111111111111111111111111111111111111112": true,
  "9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ": true // Turbo Tuga
};

// Lista de memes/GIFs
const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/3o6fJ1BM7r60LymVji/giphy.gif"
];

// --- Auxiliares ---
function short(addr) {
  if (!addr || typeof addr !== "string") return "N/A";
  return addr.slice(0,5) + "…" + addr.slice(-5);
}

// --- Geração de relatório ---
async function generateReport() {
  const mintInput = document.getElementById("tokenInput").value.trim();
  if(!mintInput) return alert("⚠️ Informe um token mint válido");

  let report = {
    name: "Unknown", symbol: "Unknown", supply: "N/A", decimals: "N/A",
    holders: "N/A", mintAuthority: "N/A", freezeAuthority: "N/A",
    website: "N/A", twitter: "N/A", discord: "N/A",
    price: "N/A", liquidity: "N/A", burned: "N/A",
    concentrationTop3: "N/A", creationDate: "N/A", topHolders: []
  };

  try {
    // --- Helius Token Info ---
    const heliusUrl = `https://api.helius.xyz/v1/tokens/${mintInput}?api-key=${Helius_API_KEY}`;
    const heliusResp = await fetch(heliusUrl);
    if (!heliusResp.ok) throw new Error("Erro Helius: " + heliusResp.status);
    const heliusData = await heliusResp.json();

    if (heliusData && heliusData.length > 0) {
      const token = heliusData[0];
      report.supply = token.supply || report.supply;
      report.decimals = token.decimals || report.decimals;
      report.mintAuthority = token.mintAuthority || report.mintAuthority;
      report.freezeAuthority = token.freezeAuthority || report.freezeAuthority;
      report.holders = token.holderCount || report.holders;
      report.topHolders = token.topHolders || [];
      report.creationDate = token.creationDate || report.creationDate;
      report.price = token.price || report.price;
      report.liquidity = token.liquidity || report.liquidity;
      report.burned = token.burned || report.burned;
      report.concentrationTop3 = token.top3Concentration || report.concentrationTop3;

      // --- Metaplex metadata ---
      if(token.metadataUri){
        try {
          const metaResp = await fetch(token.metadataUri);
          if(metaResp.ok){
            const metaJSON = await metaResp.json();
            report.name = metaJSON.name || report.name;
            report.symbol = metaJSON.symbol || report.symbol;
            report.website = metaJSON.website || report.website;
            report.twitter = metaJSON.twitter || report.twitter;
            report.discord = metaJSON.discord || report.discord;
          }
        } catch(e){
          console.warn("Erro ao buscar Metaplex metadata:", e);
        }
      }
    }

    // --- Score ---
    let score = 0;
    if (report.supply && report.supply>0) score+=10;
    if (report.mintAuthority==="null") score+=10;
    if (report.freezeAuthority==="null") score+=5;
    if (report.holders && report.holders>0) score+=10;
    if (report.price!=="N/A") score+=10;
    if (report.liquidity!=="N/A") score+=10;
    if (report.concentrationTop3 && report.concentrationTop3<50) score+=10;

    // --- Status ---
    let status="", badgeClass="";
    if (OFFICIAL_TOKENS[mintInput]){
      status="✅ Oficial"; badgeClass="badge-safe";
    } else {
      if(score>=70){ status="✅ Confiável"; badgeClass="badge-safe"; }
      else if(score>=50){ status="⚠️ Risco Médio"; badgeClass="badge-medium"; }
      else{ status="❓ Desconhecido / Informação limitada"; badgeClass="badge-medium"; }
    }

    // --- Meme aleatório ---
    const meme = memes[Math.floor(Math.random()*memes.length)];

    // --- Top Holders ---
    let topHoldersHTML = report.topHolders.map(h => `${short(h.address)} — ${h.amount}`).join("<br>");
    if(!topHoldersHTML) topHoldersHTML="N/A";

    // --- Montar HTML ---
    document.getElementById("report").innerHTML = `
      <h2>📊 Turbo Tuga Token Report</h2>
      <p><b>Status:</b> <span class="${badgeClass}">${status}</span></p>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
        <tr><td>Supply</td><td>${report.supply}</td><td>${report.supply?10:0}</td></tr>
        <tr><td>Mint Authority</td><td>${report.mintAuthority}</td><td>${report.mintAuthority==="null"?10:0}</td></tr>
        <tr><td>Freeze Authority</td><td>${report.freezeAuthority}</td><td>${report.freezeAuthority==="null"?5:0}</td></tr>
        <tr><td>Holders (approx.)</td><td>${report.holders}</td><td>${report.holders>0?10:0}</td></tr>
        <tr><td>Preço</td><td>${report.price}</td><td>${report.price!=="N/A"?10:0}</td></tr>
        <tr><td>Liquidez</td><td>${report.liquidity}</td><td>${report.liquidity!=="N/A"?10:0}</td></tr>
        <tr><td>Concentração top3</td><td>${report.concentrationTop3}</td><td>${report.concentrationTop3<50?10:0}</td></tr>
      </table>
      <p><b>Score Total:</b> ${score}/100</p>
      <p><b>Mint:</b> ${mintInput}</p>
      <p><b>Nome / Símbolo:</b> ${report.name} / ${report.symbol}</p>
      <p><b>Supply / Decimals:</b> ${report.supply} / ${report.decimals}</p>
      <p><b>Mint Authority / Freeze Authority:</b> ${report.mintAuthority} / ${report.freezeAuthority}</p>
      <p><b>Data de Criação:</b> ${report.creationDate}</p>
      <p><b>Queimado:</b> ${report.burned}</p>
      <p><b>Preço:</b> ${report.price} | Liquidez:</b> ${report.liquidity}</p>
      <p><b>Website:</b> ${report.website} | Twitter: ${report.twitter} | Discord: ${report.discord}</p>
      <p><b>Concentração top3:</b> ${report.concentrationTop3}</p>
      <p><b>Top 10 Holders:</b><br>${topHoldersHTML}</p>
      <p>⚠️ Este material é educativo — não é recomendação de compra/venda.</p>
      <img src="${meme}" class="meme"/>
      <div style="margin-top:20px;">
        <button onclick="window.open('https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112','_blank')">🐬 Comprar Turbo Tuga em DEX Orca</button>
        <button onclick="window.open('https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112','_blank')">🚀 Comprar Turbo Tuga em DEX Jupiter</button>
        <button onclick="exportPDF()">📄 Exportar PDF</button>
        <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
        <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
      </div>
    `;
  } catch(err){
    console.error("Relatório: erro", err);
    document.getElementById("report").innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
  }
}

// --- Funções PDF e redes sociais ---
function exportPDF(){ alert("Função PDF em desenvolvimento"); }
function shareTwitter(){
  const text = document.getElementById("report").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}
function shareTelegram(){
  const text = document.getElementById("report").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}
