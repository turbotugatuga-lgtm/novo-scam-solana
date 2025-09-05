const MEMES = [
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif"
];

async function safeFetchJSON(url) {
  try {
    const res = await fetch(url);
    if(!res.ok) return null;
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
  } catch(e){
    return null;
  }
}

function shortAddr(addr) {
  if(!addr) return "N/A";
  return addr.slice(0,5)+"…"+addr.slice(-4);
}

async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  if(!mint) return alert("⚠️ Informe um token mint válido");

  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "⏳ Gerando relatório divertido...";

  // URLs APIs públicas
  const metadataUrl = `https://public-api.solscan.io/token/meta?tokenAddress=${mint}`;
  const supplyUrl = `https://public-api.solscan.io/token/supply?tokenAddress=${mint}`;
  const holdersUrl = `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=10`;
  const priceUrl = `https://public-api.solscan.io/token/price?tokenAddress=${mint}`;

  const metadata = await safeFetchJSON(metadataUrl) ?? { data:{} };
  const supplyData = await safeFetchJSON(supplyUrl) ?? { data:{ tokenAmount:0 } };
  const holdersData = await safeFetchJSON(holdersUrl) ?? { data:[] };
  const priceData = await safeFetchJSON(priceUrl) ?? { data:{ price:"N/A" } };

  const name = metadata.data?.tokenName ?? "Unknown";
  const symbol = metadata.data?.tokenSymbol ?? "Unknown";
  const decimals = metadata.data?.decimals ?? 0;
  const supply = Number(supplyData.data?.tokenAmount ?? 0);
  const mintAuth = metadata.data?.mintAuthority ?? "null";
  const freezeAuth = metadata.data?.freezeAuthority ?? "null";
  const holders = holdersData.data ?? [];
  const price = priceData.data?.price ?? "N/A";

  // top3 holders concentração %
  const top3Sum = holders.slice(0,3).reduce((s,h)=>s+h.amount,0);
  const top3Perc = supply>0 ? ((top3Sum/supply)*100).toFixed(2) : "N/A";

  // Score
  let score = 0;
  if(supply>0) score+=10;
  if(holders.length>0) score+=10;
  if(mintAuth==="null" || mintAuth==="N/A") score+=10;
  if(freezeAuth==="null" || freezeAuth==="N/A") score+=5;

  const status = score>=70 ? "✅ Confiável" : score>=40 ? "⚠️ Médio Risco" : "❌ Possível SCAM";
  const badge = score>=70 ? "badge-safe" : score>=40 ? "badge-warning" : "badge-scam";

  // memes aleatórios
  const selectedMemes = [];
  while(selectedMemes.length<3){
    const m = MEMES[Math.floor(Math.random()*MEMES.length)];
    if(!selectedMemes.includes(m)) selectedMemes.push(m);
  }

  // Render relatório
  reportDiv.innerHTML = `
    <h2>📊 Turbo Tuga Token Report <span class="badge ${badge}">${status}</span></h2>
    <table class="table-report">
      <tr><th>Critério</th><th>Valor</th></tr>
      <tr><td>Nome / Símbolo</td><td>${name} / ${symbol}</td></tr>
      <tr><td>Supply / Decimals</td><td>${supply} / ${decimals}</td></tr>
      <tr><td>Mint Authority</td><td>${shortAddr(mintAuth)}</td></tr>
      <tr><td>Freeze Authority</td><td>${shortAddr(freezeAuth)}</td></tr>
      <tr><td>Top3 Holders %</td><td>${top3Perc}%</td></tr>
      <tr><td>Total de Holders</td><td>${holders.length}</td></tr>
      <tr><td>Preço</td><td>${price}</td></tr>
      <tr><td>Score Total</td><td>${score}/100</td></tr>
    </table>

    <div class="memes">
      ${selectedMemes.map(m=>`<img src="${m}">`).join('')}
    </div>

    <p>⚠️ Este material é educativo — não é recomendação de compra/venda.</p>

    <div style="margin-top:10px;">
      <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
      <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
      <button onclick="exportPDF()">📄 Exportar PDF</button>
    </div>
  `;
}

function shareTwitter() {
  const text = document.getElementById("report").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}

function shareTelegram() {
  const text = document.getElementById("report").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}

function exportPDF() {
  alert("Função PDF em desenvolvimento — pode ser implementada com jsPDF e imagens");
}
