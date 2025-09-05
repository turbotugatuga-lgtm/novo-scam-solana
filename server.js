import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Permite apenas seu frontend do Vercel
app.use(
  cors({
    origin: "https://novo-scam-solana.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.send("✅ Turbo Tuga Backend rodando com CORS liberado para Vercel!");
});

// Exemplo de rota proxy para buscar dados de token
app.get("/token/:address", async (req, res) => {
  try {
    const { address } = req.params;

    // Exemplo: chamada ao Solscan
    const response = await fetch(
      `https://pro-api.solscan.io/v2.0/token/meta?address=${address}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SOLSCAN_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erro no backend:", error);
    res.status(500).json({ error: "Erro ao buscar dados do token" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
});
