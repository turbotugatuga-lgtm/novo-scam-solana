// Instalar dependências: npm install express node-fetch cors
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Chaves
const HELIUS_API_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";

app.use(cors());
app.use(express.json());

app.get("/token/:mint", async (req, res) => {
  const { mint } = req.params;
  try {
    // --- Helius: Token Info ---
    const heliusUrl = `https://api.helius.xyz/v1/tokens/${mint}?api-key=${HELIUS_API_KEY}`;
    const heliusResp = await fetch(heliusUrl);
    const heliusData = await heliusResp.json();
    const token = Array.isArray(heliusData) && heliusData.length > 0 ? heliusData[0] : {};

    // --- Campos base ---
    const supply = token.supply ?? 0;
    const decimals = token.decimals ?? 0;
    const holders = token.holderCount ?? 0;
    const mintAuthority = token.mintAuthority ?? "null";
    const freezeAuthority = token.freezeAuthority ?? "null";
    const topHolders = Array.isArray(token.topHolders) ? token.topHolders.slice(0,10) : [];

    // --- Score ---
    let score = 0;
    if(supply>0) score+=10;
    if(mintAuthority==="null") score+=10;
    if(freezeAuthority==="null") score+=5;
    if(holders>0) score+=10;
    if(topHolders.length>0) score+=5;

    let status = score>=35 ? "✅ Confiável" : score>=20 ? "⚠️ Risco Médio" : "❌ Possível SCAM";

    // --- Concentração Top3 ---
    let top3Sum = topHolders.slice(0,3).reduce((acc,h)=> acc + Number(h.amount),0);
    let totalSupply = Number(supply) || 1;
    let concentrationTop3 = ((top3Sum/totalSupply)*100).toFixed(2);

    // --- Data estimada ---
    let creationDate = token.creationTime ? new Date(token.creationTime*1000).toLocaleString() : "N/A";

    // --- Preço e liquidez (estimativa Helius) ---
    const price = token.price ?? "N/A";
    const liquidity = token.liquidity ?? "N/A";
    const burned = token.burned ?? "N/A";

    res.json({
      mint,
      supply,
      decimals,
      holders,
      mintAuthority,
      freezeAuthority,
      topHolders,
      score,
      status,
      concentrationTop3,
      creationDate,
      price,
      liquidity,
      burned
    });

  } catch(err){
    console.error(err);
    res.status(500).json({ error: "Erro ao consultar Helius API" });
  }
});

app.listen(PORT, () => console.log(`Proxy rodando em http://localhost:${PORT}`));
