// script.js

// -----------------------------
// Configurações
// -----------------------------
const HELIUS_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";
const SHYFT_KEY = "VzPp9y_hw4dFfmfF";
const SOLSCAN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NTcwMzQwMjcyODIsImVtYWlsIjoidHVyYm90dWdhdHVnYUBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NTcwMzQwMjd9.244yHHTSQhMb-afA0r9HlWhvhTuMAcdqj91bru0BvHM";

// Tokens oficiais
const OFFICIAL_TOKENS = {
  "So11111111111111111111111111111111111111112": {
    name: "Solana",
    symbol: "SOL",
    coingeckoId: "solana"
  },
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
    name: "USD Coin",
    symbol: "USDC",
    coingeckoId: "usd-coin"
  },
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": {
    name: "Tether",
    symbol: "USDT",
    coingeckoId: "tether"
  },
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": {
    name: "Bonk",
    symbol: "BONK",
    coingeckoId: "bonk"
  }
};

// -----------------------------
// Funções utilitárias
// -----------------------------

async function fetchCoinGeckoData(id) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    const data = await res.json();
    return {
      price: data.market_data.current_price.usd,
      marketCap: data.market_data.market_cap.usd,
      liquidity: data.market_data.total_value_locked?.usd || "N/A",
      creationDate: data.genesis_date || "N/A"
    };
  } catch (e) {
    console.error("Erro CoinGecko:", e);
    return { price: "N/A", marketCap: "N/A", liquidity: "N/A", creationDate: "N/A" };
  }
}

// Helius - dados básicos
async function fetchHelius(mint) {
  try {
    const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "token",
        method: "getTokenSupply",
        params: [mint]
      })
    });
    const data = await res.json();
    return data?.result?.value?.uiAmountString || "N/A";
  } catch {
    return "N/A";
  }
}

// Shyft - pools/liquidez
async function fetchShyft(mint) {
  try {
    const res = await fetch(
      `https://api.shyft.to/solana/defi/pools?network=mainnet&token=${mint}`,
      { headers: { "x-api-key": SHYFT_KEY } }
    );
    if (!res.ok) return "N/A";
    const data = await res.json();
    return data?.result?.[0]?.liquidity || "N/A";
  } catch {
    return "N/A";
  }
}

// Solscan - preço
async function fetchSolscanPrice(mint) {
  try {
    const res = await fetch(`https://pro-api.solscan.io/v2.0/token/price?address=${mint}`, {
      headers: { Authorization: `Bearer ${SOLSCAN_KEY}` }
    });
    if (!res.ok) return "N/A";
    const data = await res.json();
    return data?.data?.value || "N/A";
  } catch {
    return "N/A";
  }
}

// -----------------------------
// Relatório
// -----------------------------
async function generateReport(mint) {
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "⏳ Gerando relatório...";

  // ✅ Token oficial → bypass SCAM
  if (OFFICIAL_TOKENS[mint]) {
    const info = OFFICIAL_TOKENS[mint];
    const gecko = await fetchCoinGeckoData(info.coingeckoId);

    reportDiv.innerHTML = `
      <h2>📊 ${info.name} (${info.symbol}) Report Oficial</h2>
      <table border="1">
        <tr><th>Critério</th><th>Valor</th></tr>
        <tr><td>Preço</td><td>$${gecko.price}</td></tr>
        <tr><td>Market Cap</td><td>$${gecko.marketCap}</td></tr>
        <tr><td>Liquidez</td><td>${gecko.liquidity}</td></tr>
        <tr><td>Data de Criação</td><td>${gecko.creationDate}</td></tr>
      </table>
      <p>✅ Token oficial da Solana Network, não classificado como SCAM.</p>
      <p>Mint: ${mint}</p>
    `;
    return; // encerra aqui
  }

  // 🟠 SPL Token comum
  const supply = await fetchHelius(mint);
  const liquidity = await fetchShyft(mint);
  const price = await fetchSolscanPrice(mint);

  let score = 0;
  let rows = "";

  const checks = [
    { criterio: "Supply", valor: supply, pontos: 10 },
    { criterio: "Liquidez", valor: liquidity, pontos: liquidity !== "N/A" ? 10 : 0 },
    { criterio: "Preço", valor: price, pontos: price !== "N/A" ? 10 : 0 },
    { criterio: "Mint Authority", valor: "null", pontos: 10 },
    { criterio: "Freeze Authority", valor: "null", pontos: 5 }
  ];

  checks.forEach(c => {
    rows += `<tr><td>${c.criterio}</td><td>${c.valor}</td><td>${c.pontos}</td></tr>`;
    score += c.pontos;
  });

  const status = score >= 70 ? "✅ Confiável" : score >= 40 ? "⚠️ Médio Risco" : "❌ Possível SCAM";

  reportDiv.innerHTML = `
    <h2>📊 Turbo Tuga Token Report</h2>
    <table border="1">
      <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
      ${rows}
    </table>
    <p><b>Score Total:</b> ${score}/100 ${status}</p>
    <p>Mint: ${mint}</p>
    <p>⚠️ Observação: Este relatório é apenas um meme educativo. Não é recomendação de compra/venda.</p>
    <p>🐬 <a href="https://www.orca.so/?tokenIn=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&tokenOut=So11111111111111111111111111111111111111112" target="_blank">Comprar Turbo Tuga em DEX Orca</a> 🚀 
    <a href="https://jup.ag/swap?sell=9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ&buy=So11111111111111111111111111111111111111112" target="_blank">Comprar Turbo Tuga em DEX Jupiter</a></p>
  `;
}

// -----------------------------
// Bind do botão
// -----------------------------
document.getElementById("generateBtn").addEventListener("click", () => {
  const mint = document.getElementById("tokenMint").value.trim();
  if (!mint) {
    alert("Digite o endereço do token!");
    return;
  }
  generateReport(mint);
});

