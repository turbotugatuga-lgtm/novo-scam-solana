const MEMES = [
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"
];

async function safeFetchJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const text = await resp.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  if (!mint) return alert("⚠️ Informe um token mint válido");
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "⏳ Gerando relatório...";

  // URLs APIs públicas (Solscan/Helius)
  const metadataUrl = `https://public-api.solscan.io/token/meta?tokenAddress=${mint}`;
  const supplyUrl = `https://public-api.solscan.io/token/supply?tokenAddress=${mint}`;
  const holdersUrl = `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=10`;
  const priceUrl = `https://public-api.solscan.io/token/price?tokenAddress=${mint}`;

  const metadata = await safeFetchJSON(metadataUrl) ?? { data: {} };
  const supplyData = await safeFetchJSON(supplyUrl) ?? { data: { tokenAmount: 0 } };
  const holdersData = await safeFetchJSON(holdersUrl) ?? { data: [] };
  const priceData = await safeFetchJSON(priceUrl) ?? { data: { price: "N/A" } };

  const name = metadata.data?.tokenName ?? "N/A";
  const symbol = metadata.data?.tokenSymbol ?? "N/A";
  const supply = Number(supplyData.data?.tokenAmount ?? 0);
  const decimals = metadata.data?.decimals ?? 0;
  const mintAuth = metadata.data?.mintAuthority ?? "N/A";
  const freezeAuth = metadata.data?.freezeAuthority ?? "N/A";
  const holders = holdersData.data ?? [];
  const price = priceData.data?.price ?? "N/A";

  // Concentração top3 holders
  const top3Sum = holders.slice(0,3).reduce((sum,h)=>sum+h.amount,0);
  const top3Perc = supply > 0 ? ((top3Sum/supply)*100).toFixed(2) : "N/A";

  // Score simplificado
  let score = 0;
  if (supply > 0) score += 10;
  if (holders.length > 0) score += 10;
  if (mintAuth === "null" || mintAuth === "N/A") score += 10;
  if (freezeAuth === "null" || freezeAuth === "N/A") score += 5;

  const status = score>=70 ? "✅ Confiável" : score>=40 ? "⚠️ Médio Risco" : "❌ Possível SCAM";

  // Escolher 3 memes aleatórios
  const selectedMemes = [];
  while(selectedMemes.length<3){
    const m = MEMES[Math.floor(Math.random()*MEMES.length)];
    if(!selectedMemes.includes(m)) selectedMemes.push(m);
  }

  // Renderizar relatório
  reportDiv.innerHTML = `
    <h2>📊 Turbo Tuga Token Report</h2>
    <p>Status: ${status}</p>
    <p>Nome / Símbolo: ${name} / ${symbol}</p>
    <p>Supply: ${supply} | Decimals: ${decimals}</p>
    <p>Mint Authority: ${mintAuth} | Freeze Authority: ${freezeAuth}</p>
    <p>Top3 Holders: ${top3Perc}%</p>
    <p>Total Holders: ${holders.length}</p>
    <p>Preço Atual: ${price}</p>

    <div class="memes">
      ${selectedMemes.map(m=>`<img src="${m}">`).join("")}
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
  alert("Função PDF em desenvolvimento (pode usar jsPDF para gerar PDF com memes)");
}
