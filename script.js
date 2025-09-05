// 🚀 Turbo Tuga Scam Detector - script.js

const HELIUS_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";
const SOLSCAN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NTcwMzQwMjcyODIsImVtYWlsIjoidHVyYm90dWdhdHVnYUBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NTcwMzQwMjd9.244yHHTSQhMb-afA0r9HlWhvhTuMAcdqj91bru0BvHM";
const SHYFT_KEY = "VzPp9y_hw4dFfmfF";

const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif"
];

function short(addr) {
  if (!addr) return "N/A";
  const s = String(addr);
  return s.length > 10 ? s.slice(0, 4) + "..." + s.slice(-4) : s;
}

async function fetchHelius(method, params) {
  const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "helius", method, params })
  });
  return res.json();
}

async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  if (!mint) return alert("⚠️ Informe um token mint válido");

  let report = {
    supply: "N/A",
    decimals: "N/A",
    mintAuthority: "N/A",
    freezeAuthority: "N/A",
    holders: "N/A",
    name: "Unknown",
    symbol: "Unknown",
    website: "N/A",
    twitter: "N/A",
    discord: "N/A",
    price: "N/A",
    liquidity: "N/A",
    burn: "N/A",
    creation: "N/A",
    topHolders: []
  };

  try {
    // Supply + Mint info
    const supplyRes = await fetchHelius("getTokenSupply", [mint]);
    if (supplyRes.result) {
      report.supply = supplyRes.result.value.uiAmountString;
      report.decimals = supplyRes.result.value.decimals;
    }

    // Mint account info
    const accRes = await fetchHelius("getAccountInfo", [mint, { encoding: "jsonParsed" }]);
    if (accRes.result?.value?.data?.parsed?.info) {
      const info = accRes.result.value.data.parsed.info;
      report.mintAuthority = info.mintAuthority ?? "null";
      report.freezeAuthority = info.freezeAuthority ?? "null";
    }

    // Top holders
    const holdersRes = await fetchHelius("getTokenLargestAccounts", [mint]);
    if (holdersRes.result?.value) {
      report.holders = holdersRes.result.value.length;
      report.topHolders = holdersRes.result.value.slice(0, 10).map(h => ({
        addr: short(h.address),
        amount: h.uiAmount
      }));
    }

    // Preço via Solscan
    try {
      const solscanRes = await fetch(`https://pro-api.solscan.io/v2.0/token/price?address=${mint}`, {
        headers: { "token": SOLSCAN_KEY }
      });
      if (solscanRes.ok) {
        const data = await solscanRes.json();
        if (data.data) {
          report.price = data.data.value ?? "N/A";
          report.liquidity = data.data.liquidity ?? "N/A";
        }
      }
    } catch (e) {
      console.warn("Solscan price fetch failed", e);
    }

    // Score
    let score = 0;
    if (report.supply !== "N/A") score += 10;
    if (report.mintAuthority === "null") score += 10;
    if (report.freezeAuthority === "null") score += 5;
    if (report.holders !== "N/A" && report.holders > 50) score += 10;
    if (report.price !== "N/A") score += 10;

    // Status
    let status = "❌ Possível SCAM";
    if (score > 70) status = "✅ Confiável";
    else if (score > 40) status = "⚠️ Médio Risco";

    // Meme
    const meme = memes[Math.floor(Math.random() * memes.length)];

    // HTML Report
    document.getElementById("report").innerHTML = `
      <h2>📊 Turbo Tuga Token Report</h2>
      <table border="1" style="margin: auto; border-collapse: collapse;">
        <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
        <tr><td>Supply</td><td>${report.supply}</td><td>10</td></tr>
        <tr><td>Mint Authority</td><td>${report.mintAuthority}</td><td>${report.mintAuthority === "null" ? 10 : 0}</td></tr>
        <tr><td>Freeze Authority</td><td>${report.freezeAuthority}</td><td>${report.freezeAuthority === "null" ? 5 : 0}</td></tr>
        <tr><td>Holders</td><td>${report.holders}</td><td>${report.holders > 50 ? 10 : 0}</td></tr>
        <tr><td>Preço</td><td>${report.price}</td><td>${report.price !== "N/A" ? 10 : 0}</td></tr>
        <tr><td>Liquidez</td><td>${report.liquidity}</td><td>${report.liquidity !== "N/A" ? 10 : 0}</td></tr>
      </table>
      <p><b>Score Total:</b> ${score}/100 ${status}</p>
      <p><b>Mint:</b> ${mint}</p>
      <p><b>Data de Criação:</b> ${report.creation}</p>
      <p><b>Queimado:</b> ${report.burn}</p>
      <h3>Top 10 Holders:</h3>
      <ul>${report.topHolders.map(h => `<li>${h.addr}: ${h.amount}</li>`).join("")}</ul>
      <img src="${meme}" style="max-width:200px; margin:10px;"/>
      <p>⚠️ Observação: Este relatório é apenas um meme educativo. Não é recomendação de compra/venda.</p>
      <div style="margin-top:20px;">
        <button onclick="window.open('https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112', '_blank')">🐬 Comprar Turbo Tuga em DEX Orca</button>
        <button onclick="window.open('https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112', '_blank')">🚀 Comprar Turbo Tuga em DEX Jupiter</button>
      </div>
    `;
  } catch (err) {
    console.error("Relatório: erro", err);
    document.getElementById("report").innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
  }
}
