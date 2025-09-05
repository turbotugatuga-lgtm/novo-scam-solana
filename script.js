// script.js

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

// Função utilitária para pegar dados da CoinGecko
async function fetchCoinGeckoData(id) {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    if (!res.ok) throw new Error("CoinGecko fetch failed");
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

// Função principal do relatório
async function generateReport(mint) {
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "⏳ Gerando relatório...";

  // Se for token oficial → bypass SCAM checker
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
    return;
  }

  // Caso contrário → continua o relatório normal (simplificado exemplo)
  let score = 0;
  let rows = "";

  // Exemplo de checagem fake só pra estruturar
  const checks = [
    { criterio: "Supply", valor: "1000000000", pontos: 10 },
    { criterio: "Mint Authority", valor: "null", pontos: 10 },
    { criterio: "Freeze Authority", valor: "null", pontos: 5 },
    { criterio: "Holders", valor: "1234", pontos: 10 },
    { criterio: "Preço", valor: "N/A", pontos: 0 }
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

// Exemplo de binding
document.getElementById("generateBtn").addEventListener("click", () => {
  const mint = document.getElementById("tokenMint").value.trim();
  if (!mint) {
    alert("Digite o endereço do token!");
    return;
  }
  generateReport(mint);
});
