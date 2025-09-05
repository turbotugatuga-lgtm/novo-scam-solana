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
  reportDiv.innerHTML = "⏳ Gerando relatório Turbo Tuga Ultra Meme...";

  // APIs públicas
  const metadataUrl = `https://public-api.solscan.io/token/meta?tokenAddress=${mint}`;
  const supplyUrl = `https://public-api.solscan.io/token/supply?tokenAddress=${mint}`;
  const holdersUrl = `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=5`;
  const priceUrl = `https://public-api.solscan.io/token/price?tokenAddress=${mint}`;
  const poolsUrl = `https://api.shyft.to/solana/defi/pools?network=mainnet&token=${mint}`;

  const [metadata, supplyData, holdersData, priceData, poolsData] = await Promise.all([
    safeFetchJSON(metadataUrl) ?? { data:{} },
    safeFetchJSON(supplyUrl) ?? { data:{ tokenAmount:0 } },
    safeFetchJSON(holdersUrl) ?? { data:[] },
    safeFetchJSON(priceUrl) ?? { data:{ price:"N/A" } },
    safeFetchJSON(poolsUrl) ?? { data:[] }
  ]);

  const name = metadata.data?.tokenName ?? "Unknown";
  const symbol = metadata.data?.tokenSymbol ?? "Unknown";
  const decimals = metadata.data?.decimals ?? 0;
  const supply = Number(supplyData.data?.tokenAmount ?? 0);
  const mintAuth = metadata.data?.mintAuthority ?? "null";
  const freezeAuth = metadata.data?.freezeAuthority ?? "null";
  const holders = holdersData.data ?? [];
  const price = priceData.data?.price ?? "N/A";
  const liquidity = poolsData.data.length > 0 ? poolsData.data.reduce((sum,p)=>sum+Number(p.liquidity),0) : "N/A";

  // top3 holders concentração %
  const top3Sum = holders.slice(0,3).reduce((s,h)=>s+Number(h.amount),0);
  const top3Perc = supply>0 ? ((top3Sum/supply)*100).toFixed(2) : "N/A";

  // Queimado / burned (estimativa simples)
  const burned = metadata.data?.burned ?? "N/A";

  // Bloqueio mint / venda
  const mintLocked = !mintAuth || mintAuth==="null" ? "Sim" : "Não";
  const saleLocked = freezeAuth==="null" ? "Não" : "Sim";

  // Score
  let score = 0;
  if(supply>0) score+=10;
  if(holders.length>0) score+=10;
  if(mintLocked==="Sim") score+=10;
  if(saleLocked==="Não") score+=10;
  if(liquidity!=="N/A" && liquidity>0) score+=10;

  const status = score>=50 ? "✅ Confiável" : score>=25 ? "⚠️ Médio Risco" : "❌ Possível SCAM";
  const badge = score>=50 ? "badge-safe" : score>=25 ? "badge-warning" : "badge-scam";

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
      <tr><td>Bloqueio Mint</td><td>${mintLocked}</td></tr>
      <tr><td>Bloqueio Venda</td><td>${saleLocked}</td></tr>
      <tr><td>Top3 Holders %</td><td>${top3Perc}%</td></tr>
      <tr><td>Total de Holders</td><td>${holders.length}</td></tr>
      <tr><td>Preço</td><td>${price}</td></tr>
      <tr><td>Liquidez Estimada</td><td>${liquidity}</td></tr>
      <tr><td>Queimado</td><td>${burned}</td></tr>
      <tr><td>Score Total</td><td>${score}/100</td></tr>
    </table>

    <h3>Top 5 Holders</h3>
    <ul>
      ${holders.map(h=>`<li>${shortAddr(h.owner)} — ${Number(h.amount).toLocaleString()}</li>`).join('')}
    </ul>

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
