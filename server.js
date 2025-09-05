import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Só permite chamadas vindas do seu Vercel
app.use(
  cors({
    origin: "https://novo-scam-solana.vercel.app",
    methods: ["GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rota raiz
app.get("/", (req, res) => {
  res.send("✅ Turbo Tuga Ultra Meme Backend rodando!");
});

// Rota que unifica Solscan, Shyft e Helius
app.get("/token/:address", async (req, res) => {
  const { address } = req.params;

  try {
    // 🔹 Solscan Metadata
    const solscanMeta = await fetch(
      `https://pro-api.solscan.io/v2.0/token/meta?address=${address}`,
      {
        headers: { Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}` },
      }
    ).then((r) => r.json());

    // 🔹 Solscan Price
    const solscanPrice = await fetch(
      `https://pro-api.solscan.io/v2.0/token/price?address=${address}`,
      {
        headers: { Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}` },
      }
    ).then((r) => r.json());

    // 🔹 Shyft Pools
    const shyftPools = await fetch(
      `https://api.shyft.to/solana/defi/pools?network=mainnet&token=${address}`,
      {
        headers: { "x-api-key": process.env.SHYFT_API_KEY },
      }
    ).then((r) => r.json());

    // 🔹 Helius Holder Data
    const heliusHolders = await fetch(
      `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.HELIUS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mintAccounts: [address] }),
      }
    ).then((r) => r.json());

    res.json({
      solscanMeta,
      solscanPrice,
      shyftPools,
      heliusHolders,
    });
  } catch (err) {
    console.error("❌ Erro ao buscar dados:", err);
    res.status(500).json({ error: "Erro ao buscar dados do token" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
