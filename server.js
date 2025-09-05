// Instalar dependências: npm install express node-fetch cors
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3000;
const HELIUS_API_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";

app.use(cors());
app.use(express.json());

// Endpoint proxy para token info
app.get("/token/:mint", async (req, res) => {
  const { mint } = req.params;
  try {
    const heliusUrl = `https://api.helius.xyz/v1/tokens/${mint}?api-key=${HELIUS_API_KEY}`;
    const response = await fetch(heliusUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao consultar Helius API" });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));
