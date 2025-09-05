const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"
];

// Função para encurtar endereços
function short(addr) {
  if (!addr || typeof addr !== "string") return "N/A";
  return addr.slice(0,5) + "…" + addr.slice(-5);
}

// Função segura para buscar JSON (fallback se erro)
async function safeFetchJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const text = await resp.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    return null;
  }
}

// Gera o relatório
async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  const reportDiv = document.getElementById("report");
  if(!mint) return alert("Informe um token mint válido");

  reportDiv.innerHTML = "⏳ Gerando relatório...";

  try {
    // APIs públicas Solana
    const metadataUrl = `https://public-api.solscan.io/token/meta?tokenAddress=${mint}`;
    const supplyUrl = `https://public-api.solscan.io/token/supply?tokenAddress=${mint}`;
    const holdersUrl = `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=10`;

    const metadata = await safeFetchJSON(metadataUrl) ?? { data: {} };
    const supplyData = await safeFetchJSON(supplyUrl) ?? { data: { tokenAmount: 0 } };
    const holdersData = await safeFetchJSON(holdersUrl) ?? { data: [] };

    const name = metadata.data?.tokenName ?? "Unknown";
    const symbol = metadata.data?.tokenSymbol ?? "Unknown";
    const supply = Number(supplyData.data?.tokenAmount ?? 0);
    const decimals = metadata.data?.decimals ?? 0;
    const mintAuthority = metadata.data?.mintAuthority ?? "null";
    const freezeAuthority = metadata.data?.freezeAuthority ?? "null";
    const topHolders = holdersData.data?.map(h => ({ address:h.owner, amount:h.amount })) ?? [];

    // Score
    let score = 0;
    if (supply>0) score+=10;
    if (mintAuthority==="null") score+=10;
    if (freezeAuthority==="null") score+=5;
    if (topHolders.length>0) score+=10;

    let status = score>=35 ? "✅ Confiável" : score>=20 ? "⚠️ Risco Médio" : "❌ Possível SCAM";

    // Concentração Top3
    const top3Sum = topHolders.slice(0,3).reduce((a,b)=> a+Number(b.amount),0);
    const concentrationTop3 = supply ? ((top3Sum/supply)*100).toFixed(2) : "N/A";

    const meme = memes[Math.floor(Math.random()*memes.length)];

    let topHoldersHTML = topHolders.length>0 ?
      topHolders.map(h=>`${short(h.address)} — ${Number(h.amount).toLocaleString()}`).join("<br>") : "N/A";

    reportDiv.innerHTML = `
      <h2>📊 Turbo Tuga Token Report</h2>
      <p><b>Status:</b> ${status}</p>
      <p><b>Nome / Símbolo:</b> ${name} / ${symbol}</p>
      <p><b>Supply:</b> ${supply} | Decimals: ${decimals}</p>
      <p><b>Mint Authority:</b> ${short(mintAuthority)} | Freeze Authority: ${short(freezeAuthority)}</p>
      <p><b>Concentração Top3:</b> ${concentrationTop3}%</p>
      <p><b>Top 10 Holders:</b><br>${topHoldersHTML}</p>
      <img src="${meme}" class="meme"/>
      <p>⚠️ Este material é educativo — não é recomendação de compra/venda.</p>
      <div style="margin-top:20px;">
        <button onclick="window.open('https://www.orca.so/?tokenIn=${mint}&tokenOut=So11111111111111111111111111111111111111112','_blank')">🐬 Comprar Turbo Tuga em DEX Orca</button>
        <button onclick="window.open('https://jup.ag/swap?sell=${mint}&buy=So11111111111111111111111111111111111111112','_blank')">🚀 Comprar Turbo Tuga em DEX Jupiter</button>
      </div>
    `;
  } catch(err){
    console.error(err);
    reportDiv.innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
  }
}
