// ---------------- CONFIG (substitua se quiser/precisar) ----------------
const HELIUS_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";
const SOLSCAN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NTcwMzQwMjcyODIsImVtYWlsIjoidHVyYm90dWdhdHVnYUBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NTcwMzQwMjd9.244yHHTSQhMb-afA0r9HlWhvhTuMAcdqj91bru0BvHM";
const SHYFT_KEY = "VzPp9y_hw4dFfmfF";

// Helius RPC endpoint (browser)
const RPC_ENDPOINT = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;

// create connection
let connection = new solanaWeb3.Connection(RPC_ENDPOINT, "confirmed");

// ---------------- lista de tokens "oficiais" (tratamento especial) ----------------
const OFFICIAL_TOKENS = {
  "So11111111111111111111111111111111111111112": { name: "Solana", symbol: "SOL", coingeckoId: "solana" },
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": { name: "USD Coin", symbol: "USDC", coingeckoId: "usd-coin" },
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": { name: "Tether", symbol: "USDT", coingeckoId: "tether" },
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": { name: "Bonk", symbol: "BONK", coingeckoId: "bonk" },
  "mSo111111111111111111111111111111111111111": { name: "Wrapped SOL (mSOL)", symbol: "mSOL", coingeckoId: "msol" }
};

// meme bank (amplie se quiser)
const MEMES = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif"
];

function chooseMeme(){ return MEMES[Math.floor(Math.random()*MEMES.length)]; }

function sanitizeMint(s){
  if(!s) return "";
  // remove whitespaces, nulls, weird zero bytes, control chars
  return s.trim().replace(/\u0000/g,"").replace(/[\u0000-\u001F\u007F]/g,"").replace(/\s+/g,"");
}

function short(addr){
  if(!addr) return "N/A";
  const s = String(addr);
  return s.length>10 ? s.slice(0,6)+"…"+s.slice(-6) : s;
}

async function fetchCoinGecko(id){
  try{
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    if(!res.ok) throw new Error("CoinGecko failed");
    const j = await res.json();
    return {
      price: j.market_data?.current_price?.usd ?? "N/A",
      marketCap: j.market_data?.market_cap?.usd ?? "N/A",
      volume24h: j.market_data?.total_volume?.usd ?? "N/A",
      genesis: j.genesis_date ?? "N/A"
    };
  }catch(e){
    console.warn("CoinGecko err", e);
    return { price:"N/A", marketCap:"N/A", volume24h:"N/A", genesis:"N/A" };
  }
}

// Solscan token price (try header token first, then bearer)
async function fetchSolscanPrice(mint){
  const url = `https://pro-api.solscan.io/v2.0/token/price?address=${encodeURIComponent(mint)}`;
  try{
    let r = await fetch(url, { headers: { "token": SOLSCAN_KEY } });
    if(r.status === 401 || r.status === 403){
      // try bearer fallback
      r = await fetch(url, { headers: { "Authorization": `Bearer ${SOLSCAN_KEY}` } });
    }
    if(!r.ok) throw new Error("solscan err "+r.status);
    const j = await r.json();
    // j.data may be array or object depending on plan
    if(j?.data){
      if(Array.isArray(j.data) && j.data.length) return j.data[0].price ?? "N/A";
      if(typeof j.data === "object") return j.data.price ?? j.data.value ?? "N/A";
    }
    return "N/A";
  }catch(e){ console.warn("solscan price err", e); return "N/A"; }
}

async function fetchShyftPools(mint){
  try{
    const url = `https://api.shyft.to/solana/defi/pools?network=mainnet&token=${encodeURIComponent(mint)}`;
    const r = await fetch(url, { headers: { "x-api-key": SHYFT_KEY, "Content-Type":"application/json" }});
    if(!r.ok) throw new Error("shyft err "+r.status);
    const j = await r.json();
    // try to extract TVL / liquidity
    if(j?.data && Array.isArray(j.data) && j.data.length>0){
      // sum tvl if present
      let tvl = 0;
      j.data.forEach(p => { if(p.tvl) tvl += Number(p.tvl); else if(p.liquidityUSD) tvl += Number(p.liquidityUSD); });
      if(tvl>0) return tvl;
    }
    return "N/A";
  }catch(e){ console.warn("shyft err", e); return "N/A"; }
}

// ----------------- Função principal -----------------
async function generateReport(){
  const raw = document.getElementById("tokenInput").value;
  const mintInput = sanitizeMint(raw);
  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = `<p class="small">⏳ Gerando relatório…</p>`;
  console.log("Gerando para:", JSON.stringify(mintInput));

  if(!mintInput){
    alert("Cole um mint válido.");
    return;
  }

  // if official token -> immediate official report and return
  if(OFFICIAL_TOKENS[mintInput]){
    const info = OFFICIAL_TOKENS[mintInput];
    const cg = await fetchCoinGecko(info.coingeckoId);
    const html = `
      <h2>📊 ${info.name} (${info.symbol}) — Relatório Oficial</h2>
      <img src="${chooseMeme()}" class="meme" />
      <table><tr><th>Critério</th><th>Valor</th></tr>
        <tr><td>Preço (USD)</td><td>$${cg.price}</td></tr>
        <tr><td>Market Cap (USD)</td><td>$${Number(cg.marketCap).toLocaleString()}</td></tr>
        <tr><td>Volume 24h (USD)</td><td>$${Number(cg.volume24h).toLocaleString()}</td></tr>
        <tr><td>Data de criação</td><td>${cg.genesis}</td></tr>
      </table>
      <p class="small">✅ Token oficial — não classificado como SCAM.</p>
      <p><b>Mint:</b> ${mintInput}</p>
      <div style="margin-top:10px;">
        <button onclick="exportPDF()">📄 Exportar PDF</button>
        <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
        <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
      </div>
    `;
    reportDiv.innerHTML = html;
    return; // IMPORTANTISSIMO: encerra aqui para não rodar o algoritmo de SCAM
  }

  // ---------- para tokens SPL "normais" ----------
  try{
    // create PublicKey
    let mintPub;
    try { mintPub = new solanaWeb3.PublicKey(mintInput); }
    catch(e){ reportDiv.innerHTML = `<p>Endereço inválido.</p>`; console.error(e); return; }

    // supply (getTokenSupply)
    let supply = "N/A", decimals="N/A", mintAuthority="N/A", freezeAuthority="N/A";
    try {
      const s = await connection.getTokenSupply(mintPub);
      if(s?.value) { supply = s.value.uiAmountString ?? String(s.value.amount); decimals = s.value.decimals; }
    } catch(e){ console.warn("getTokenSupply err", e); }

    // mint parsed info (authorities)
    try{
      const parsed = await connection.getParsedAccountInfo(mintPub);
      if(parsed?.value?.data?.parsed?.info){
        const info = parsed.value.data.parsed.info;
        mintAuthority = info.mintAuthority ?? "null";
        freezeAuthority = info.freezeAuthority ?? "null";
      }
    } catch(e){ console.warn("getParsedAccountInfo err", e); }

    // top holders (safe: only top 10)
    let holdersCount = "N/A", topHolders = [];
    try{
      const largest = await connection.getTokenLargestAccounts(mintPub);
      if(largest?.value){
        holdersCount = largest.value.length;
        topHolders = largest.value.slice(0,10).map(x => ({
          address: x.address,
          amount: x.uiAmountString ?? x.amount ?? x.uiAmount ?? 0
        }));
      }
    } catch(e){ console.warn("getTokenLargestAccounts err", e); }

    // metadata (Metaplex) — best-effort: try to find URI in account bytes
    let name = "Unknown", symbol = "Unknown", image = "", website="N/A", twitter="N/A", discord="N/A";
    try{
      const TOKEN_METADATA_PROGRAM_ID = new solanaWeb3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
      const [metadataPDA] = await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("metadata"), TOKEN_METADATA_PROGRAM_ID.toBytes(), mintPub.toBytes()],
        TOKEN_METADATA_PROGRAM_ID
      );
      const metaAcc = await connection.getAccountInfo(metadataPDA);
      if(metaAcc?.data){
        // try to extract http(s) URL inside the bytes
        const text = new TextDecoder().decode(metaAcc.data);
        const m = text.match(/https?:\/\/[^\s"']+/);
        if(m && m[0]){
          const metadataUrl = m[0].replace(/\u0000/g,"");
          try{
            const resp = await fetch(metadataUrl);
            if(resp.ok){
              const j = await resp.json().catch(()=>null);
              if(j){
                name = j.name ?? name;
                symbol = j.symbol ?? symbol;
                image = j.image ?? j.image_url ?? "";
                website = j.external_url ?? j.properties?.website ?? j?.extensions?.website ?? website;
                twitter = j.twitter ?? j?.properties?.twitter ?? twitter;
                discord = j.discord ?? discord;
              }
            } else {
              console.warn("metadata fetch failed HTTP", resp.status, metadataUrl);
            }
          }catch(e){ console.warn("fetch metadata json err", e); }
        }
      }
    }catch(e){ console.warn("metadata PDA err", e); }

    // creation date: best-effort (getSignaturesForAddress, take last returned)
    let creation = "N/A";
    try{
      const sigs = await connection.getSignaturesForAddress(mintPub, {limit:1000});
      if(Array.isArray(sigs) && sigs.length>0){
        const last = sigs[sigs.length-1];
        if(last?.blockTime) creation = new Date(last.blockTime*1000).toLocaleString();
        else if(last?.signature){
          const tx = await connection.getTransaction(last.signature);
          if(tx?.blockTime) creation = new Date(tx.blockTime*1000).toLocaleString();
        }
      }
    }catch(e){ console.warn("creation date err", e); }

    // price (solscan) & liquidity (shyft) best-effort
    let price = "N/A", liquidity = "N/A";
    try{ price = await fetchSolscanPrice(mintInput); } catch(e){ console.warn("price err", e); }
    try{ 
      const shy = await fetchShyftPools(mintInput);
      if(shy !== "N/A") liquidity = typeof shy === "number" ? shy.toLocaleString("pt-BR",{maximumFractionDigits:2}) + " USD" : shy;
    }catch(e){ console.warn("shyft err", e); }

    // concentration top3
    let concentrationTop3 = "N/A";
    try{
      const tot = Number(supply) || 0;
      if(tot>0 && topHolders.length>0){
        let sumTop3 = 0;
        for(let i=0;i<Math.min(3,topHolders.length);i++){
          const a = Number(String(topHolders[i].amount).replace(/,/g,"")) || 0;
          sumTop3 += a;
        }
        concentrationTop3 = ((sumTop3 / tot) * 100).toFixed(2) + "%";
      }
    }catch(e){ console.warn("concentration err", e); }

    // ---------- scoring ----------
    const criteria = [];
    // supply
    criteria.push({name:"Supply", value: supply, points: supply!=="N/A"?10:0});
    // metadata
    criteria.push({name:"Metadata Name", value: name, points: name!=="Unknown"?10:0});
    criteria.push({name:"Metadata Symbol", value: symbol, points: symbol!=="Unknown"?10:0});
    // authorities
    criteria.push({name:"Mint Authority", value: mintAuthority, points: mintAuthority==="null"?10:0});
    criteria.push({name:"Freeze Authority", value: freezeAuthority, points: freezeAuthority==="null"?5:0});
    // holders
    let holderPoints = 0;
    const hnum = (holdersCount => {
      if(holdersCount === "N/A") return -1;
      return Number(holdersCount);
    })(holdersCount);
    // Note: earlier we used 'holdersCount' but variable name is 'holdersCount' vs 'holdersCount'? ensure consistent - we used holdersCount var earlier but here we used topHolders length and earlier set holdersCount variable. Let's define holdersCount variable used above.
    // (the code above used 'holdersCount' variable; ensure consistent in final code)
    // for scoring:
    if(hnum >= 1000) holderPoints = 20;
    else if(hnum >= 100) holderPoints = 10;
    else if(hnum >= 10) holderPoints = 5;
    else holderPoints = 0;
    criteria.push({name:"Holders (approx.)", value: holdersCount ?? "N/A", points: holderPoints});
    // price / liquidity
    criteria.push({name:"Preço (solscan)", value: price, points: price!=="N/A"?10:0});
    criteria.push({name:"Liquidez (Shyft est.)", value: liquidity, points: (liquidity && liquidity!=="N/A")?10:0});
    // concentration
    let concPoints = 0;
    if(typeof concentrationTop3 === "string" && concentrationTop3.endsWith("%")){
      const pct = parseFloat(concentrationTop3.replace("%",""));
      if(!isNaN(pct)){
        if(pct <= 20) concPoints = 10;
        else if(pct <= 50) concPoints = 5;
        else concPoints = 0;
      }
    }
    criteria.push({name:"Concentração top3", value: concentrationTop3, points: concPoints});

    // total score
    let score = criteria.reduce((acc,c)=>acc + (c.points || 0), 0);
    if(score > 100) score = 100;

    let status = "", badgeClass = "";
    if(score >= 70){ status = "✅ Confiável"; badgeClass="badge-safe"; }
    else if(score >= 50){ status = "⚠️ Risco Médio"; badgeClass="badge-medium"; }
    else { status = "❌ Possível SCAM"; badgeClass="badge-scam"; }

    // render
    const rowsHtml = criteria.map(c => `<tr><td>${c.name}</td><td>${c.value}</td><td>${c.points}</td></tr>`).join("");
    const topHtml = topHolders.length ? topHolders.map(h => `<li title="${h.address}">${short(h.address)} — ${Number(h.amount).toLocaleString()}</li>`).join("") : "<li>Nenhum dado</li>";

    const out = `
      <h2>📊 Turbo Tuga Token Report</h2>
      <img src="${chooseMeme()}" class="meme" />
      <table><tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>${rowsHtml}</table>
      <p><b>Score Total:</b> ${score}/100 <span class="${badgeClass}">${status}</span></p>
      <p><b>Mint:</b> ${mintInput}</p>
      <p><b>Nome / Símbolo:</b> ${name} / ${symbol}</p>
      <p><b>Supply:</b> ${supply} | <b>Decimals:</b> ${decimals}</p>
      <p><b>Mint Authority:</b> ${mintAuthority} | <b>Freeze Authority:</b> ${freezeAuthority}</p>
      <p><b>Data de Criação (estimada):</b> ${creation}</p>
      <p><b>Preço:</b> ${price} | <b>Liquidez (est.):</b> ${liquidity}</p>
      <p><b>Concentração top3:</b> ${concentrationTop3}</p>
      <p><b>Top 10 Holders:</b></p><ul class="small">${topHtml}</ul>
      <p class="small">⚠️ Este material é educativo — não é recomendação de compra/venda.</p>

      <div style="margin-top:12px;">
        <button onclick="exportPDF()">📄 Exportar PDF</button>
        <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
        <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
      </div>
    `;
    reportDiv.innerHTML = out;

  }catch(err){
    console.error("Relatório erro", err);
    reportDiv.innerHTML = `<p>❌ Erro ao gerar relatório: ${err.message || String(err)}</p>`;
  }
}

// ---------------- export / share (simples) ----------------
function exportPDF(){
  const el = document.getElementById("report");
  if(!el) return alert("Gere um relatório primeiro.");
  const opt = { margin:0.3, filename:`TurboTuga_Report_${Date.now()}.pdf`, image:{type:'jpeg',quality:0.95}, html2canvas:{scale:2}, jsPDF:{unit:'in',format:'a4',orientation:'portrait'} };
  html2pdf().set(opt).from(el).save();
}
function shareTwitter(){
  const el = document.getElementById("report");
  if(!el) return alert("Gere um relatório primeiro.");
  const text = el.innerText.slice(0,280);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,"_blank");
}
function shareTelegram(){
  const el = document.getElementById("report");
  if(!el) return alert("Gere um relatório primeiro.");
  const text = el.innerText.slice(0,1000);
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`,"_blank");
}

// ---------------- UI bindings ----------------
document.getElementById("generateBtn").addEventListener("click", generateReport);
document.getElementById("switchRpcBtn").addEventListener("click", () => {
  // quick fallback cycle — toggles to a different public RPC if Helius blocks
  try {
    if(connection.rpcEndpoint && connection.rpcEndpoint.includes("helius")) {
      connection = new solanaWeb3.Connection("https://rpc.ankr.com/solana", "confirmed");
      alert("RPC trocado para rpc.ankr.com/solana (fallback). Se erros persistirem, verifique CORS / chaves.");
    } else {
      connection = new solanaWeb3.Connection(RPC_ENDPOINT, "confirmed");
      alert("RPC trocado para Helius novamente.");
    }
  } catch(e) { console.warn(e); alert("Não foi possível trocar RPC: "+e.message); }
});
