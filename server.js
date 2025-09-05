import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 🔑 suas chaves (coloque as reais)
const HELIUS_KEY = "SUA_KEY_HELIUS";
const SHYFT_KEY = "SUA_KEY_SHYFT";
const SOLSCAN_KEY = "SUA_KEY_SOLSCAN";

// Função utilitária para pegar JSON com tratamento
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    return await res.json();
  } catch (e) {
    console.error("Erro ao buscar:", url, e);
    return null;
  }
}

// Rota principal
app.get("/token/:mint", async (req, res) => {
  const mint = req.params.mint;

  try {
    // Supply + autoridades (Helius)
    const supplyData = await safeFetch(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "helius",
          method: "getTokenSupply",
          params: [mint],
        }),
      }
    );

    const metadataData = await safeFetch(
      `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "helius-metadata",
          method: "getAsset",
          params: { id: mint },
        }),
      }
    );

    // Preço (Solscan)
    const priceData = await safeFetch(
      `https://pro-api.solscan.io/v2.0/token/price?address=${mint}`,
      { headers: { token: SOLSCAN_KEY } }
    );

    // Liquidez (Shyft)
    const shyftData = await safeFetch(
      `https://api.shyft.to/solana/defi/pools?network=mainnet&token=${mint}`,
      { headers: { "x-api-key": SHYFT_KEY } }
    );

    // Holders (Solscan)
    const holdersData = await safeFetch(
      `https://pro-api.solscan.io/v1.0/token/holders?address=${mint}&limit=10`,
      { headers: { token: SOLSCAN_KEY } }
    );

    // --- Monta resposta ---
    const result = {
      mint,
      supply: supplyData?.result?.value?.amount || "N/A",
      decimals: supplyData?.result?.value?.decimals || "N/A",
      name: metadataData?.result?.content?.metadata?.name || "N/A",
      symbol: metadataData?.result?.content?.metadata?.symbol || "N/A",
      mintAuthority: metadataData?.result?.mint_authority || "N/A",
      freezeAuthority: metadataData?.result?.freeze_authority || "N/A",
      price: priceData?.data?.priceUsdt || "N/A",
      liquidity: shyftData?.result?.[0]?.liquidity || "N/A",
      holdersCount: holdersData?.data?.total || 0,
      topHolders: holdersData?.data?.result?.map(h => ({
        owner: h.owner,
        amount: h.uiAmount,
        percent: h.uiAmountPercent
      })) || []
    };

    res.json(result);
  } catch (err) {
    console.error("Erro geral:", err);
    res.status(500).json({ error: "Erro ao buscar informações" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Backend rodando na porta ${PORT}`)
);
