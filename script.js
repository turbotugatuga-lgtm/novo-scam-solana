// Função para buscar dados JSON com tratamento de erros
async function safeFetchJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const text = await resp.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    return null;
  }
}

// Função para gerar o relatório
async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  const reportDiv = document.getElementById("report");
  if (!mint) return alert("Informe um token mint válido");

  reportDiv.innerHTML = "⏳ Gerando relatório...";

  try {
    // URLs das APIs públicas da Solscan
    const metadataUrl = `https://public-api.solscan.io/token/meta?tokenAddress=${mint}`;
    const supplyUrl = `https://public-api.solscan.io/token/supply?tokenAddress=${mint}`;
    const holdersUrl = `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=10`;
    const priceUrl = `https://public-api.solscan.io/token/price?tokenAddress=${mint}`;
    const transfersUrl = `https://public-api.solscan.io/token/transfer?tokenAddress=${mint}&limit=10`;

    // Buscando dados das APIs
    const metadata = await safeFetchJSON(metadataUrl) ?? { data: {} };
    const supplyData = await safeFetchJSON(supplyUrl) ?? { data: { tokenAmount: 0 } };
    const holdersData = await safeFetchJSON(holdersUrl) ?? { data: [] };
    const priceData = await safeFetchJSON(priceUrl) ?? { data: { price: "N/A" } };
    const transfersData = await safeFetchJSON(transfersUrl) ?? { data: [] };

    // Extraindo informações dos dados
    const name = metadata.data?.tokenName ?? "N/A";
    const symbol = metadata.data?.tokenSymbol ?? "N/A";
    const supply = Number(supplyData.data?.tokenAmount ?? 0);
    const decimals = metadata.data?.decimals ?? 0;
    const price = priceData.data?.price ?? "N/A";
    const transfers = transfersData.data ?? [];
    const holders = holdersData.data ?? [];

    // Gerando HTML do relatório
    reportDiv.innerHTML = `
      <h2>📊 Relatório do Token Turbo Tuga</h2>
      <p><b>Nome:</b> ${name}</p>
      <p><b>Símbolo:</b> ${symbol}</p>
      <p><b>Preço Atual:</b> ${price}</p>
      <p><b>Supply Total:</b> ${supply}</p>
      <p><b>Decimals:</b> ${decimals}</p>
      <p><b>Total de Holders:</b> ${holders.length}</p>
      <p><b>Últimas Transferências:</b></p>
      <ul>
        ${transfers.map(t => `<li>${t.timestamp} - ${t.fromAddress} → ${t.toAddress} (${t.amount} ${symbol})</li>`).join("")}
      </ul>
    `;
  } catch (err) {
    console.error("Erro ao gerar relatório:", err);
    reportDiv.innerHTML = "❌ Erro ao gerar relatório.";
  }
}
