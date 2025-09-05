import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// suas chaves
const HELIUS_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";
const SHYFT_KEY = "VzPp9y_hw4dFfmfF";
const SOLSCAN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // encurtado

// rota principal
app.get("/token/:mint", async (req, res) => {
  const mint = req.params.mint;
  try {
    // supply e autoridades
    const heliusRes = await fetch(
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
    const heliusData = await heliusRes.json();

    // preço
    const priceRes = await fetch(
      `https://pro-api.solscan.io/v2.0/token/price?address=${mint}`,
      { headers: { token: SOLSCAN_KEY } }
    );
    const priceData = await priceRes.json();

    // pools/liquidez
    const shyftRes = await fetch(
      `https://api.shyft.to/solana/defi/pools?network=mainnet&token=${mint}`,
      { headers: { "x-api-key": SHYFT_KEY } }
    );
    const shyftData = await shyftRes.json();

    res.json({
      mint,
      supply: heliusData?.result?.value?.amount || "N/A",
      decimals: heliusData?.result?.value?.decimals || "N/A",
      price: priceData?.data?.priceUsdt || "N/A",
      liquidity: shyftData?.result?.[0]?.liquidity || "N/A",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar informações" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));
