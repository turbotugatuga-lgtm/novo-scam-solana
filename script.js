// ----------------------------- CONFIG -----------------------------
const HELIUS_RPC_KEY = "66d627c2-34b8-4c3e-9123-14f16e196ab8";
const SHYFT_KEY = "VzPp9y_hw4dFfmfF";
const SOLSCAN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NTcwMzQwMjcyODIsImVtYWlsIjoidHVyYm90dWdhdHVnYUBnbWFpbC5jb20iLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3NTcwMzQwMjd9.244yHHTSQhMb-afA0r9HlWhvhTuMAcdqj91bru0BvHM";

// RPC endpoints (use Helius RPC + fallback)
const RPC_ENDPOINTS = [
  `https://mainnet.helius-rpc.com/?api-key=${HELIUS_RPC_KEY}`,
  "https://rpc.ankr.com/solana",
  "https://rpc.solana.fyi"
];
let rpcIndex = 0;
let connection = new solanaWeb3.Connection(RPC_ENDPOINTS[rpcIndex], "confirmed");

// Turbo Tuga mint (sempre mostrado no fim)
const TURBO_MINT = "9QLR3WrENnBGsv6kL33d4kDHvak71k2hBvKbHgEDwQtQ";

// tokens 'oficiais' que não devem ser marcados como SCAM
const OFFICIAL_TOKENS = new Set([
  "So11111111111111111111111111111111111111112", // SOL
  "mSo111111111111111111111111111111111111111", // wrapped SOL variant sometimes
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" // USDC
]);

// big meme bank (50+)
// for brevity some gifs repeat but it's 50+ items in real deploy you can expand
const MEMES = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3ohhwJ7h5wcC2D5nna/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/3oKIPCSX4UHmuS41TG/giphy.gif",
  "https://media.giphy.com/media/xT1Ra4uO6t8U6uR8Le/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
  "https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif",
  "https://media.giphy.com/media/3o6fJ1BM7r60LymVji/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/26gsspf0C0j7M2z20/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/3ohhwJ7h5wcC2D5nna/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/3oKIPCSX4UHmuS41TG/giphy.gif",
  "https://media.giphy.com/media/xT1Ra4uO6t8U6uR8Le/giphy.gif",
  "https://media.giphy.com/media/3o6fJ1BM7r60LymVji/giphy.gif",
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif",
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif"
];

// ----------------------------- HELPERS -----------------------------
function switchRpc() {
  rpcIndex = (rpcIndex + 1) % RPC_ENDPOINTS.length;
  connection = new solanaWeb3.Connection(RPC_ENDPOINTS[rpcIndex], "confirmed");
  alert("RPC trocado para: " + RPC_ENDPOINTS[rpcIndex]);
}

function chooseMeme() {
  return MEMES[Math.floor(Math.random() * MEMES.length)];
}

function safeFetchJson(url, opts = {}) {
  return fetch(url, opts).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json().catch(() => ({}));
  });
}

function short(addr) {
  return addr?.slice(0,6) + "…" + addr?.slice(-6);
}

// ----------------------------- CORE: gerar relatório -----------------------------
async function generateReport() {
  const mintInput = document.getElementById("tokenInput").value.trim();
  const reportDiv = document.getElementById("report");
  if (!mintInput) { alert("⚠️ Cole um mint válido"); return; }

  // Atualiza links de compra do Turbo Tuga
  document.getElementById("buy-orca").href = `https://www.orca.so/?tokenIn=${TURBO_MINT}&tokenOut=So11111111111111111111111111111111111111112`;
  document.getElementById("buy-jup").href = `https://jup.ag/swap?sell=${TURBO_MINT}&buy=So11111111111111111111111111111111111111112`;

  // Loading
  reportDiv.innerHTML = `<div class="card"><p class="hint">Carregando relatório… aguarde <span class="small">(se demorar, troque o RPC)</span></p></div>`;

  const mintPub = new solanaWeb3.PublicKey(mintInput);
  const report = {
    mint: mintInput,
    name: "Unknown",
    symbol: "Unknown",
    supply: "N/A",
    decimals: "N/A",
    mintAuthority: "N/A",
    freezeAuthority: "N/A",
    holders: "N/A",
    topHolders: [],
    creationDate: "N/A",
    website: "N/A",
    twitter: "N/A",
    discord: "N/A",
    price: "N/A",
    liquidity: "N/A",
    taxSell: "N/A",
    burned: "N/A",
    criteria: []
  };

  try {
    // 1) Detecta tokens oficiais
    if (OFFICIAL_TOKENS.has(mintInput)) {
      report.name = (mintInput === "So11111111111111111111111111111111111111112") ? "SOL" : "OFFICIAL";
      report.symbol = report.name;
      report.score = 100;
      const badgeClass = "badge-safe";
      const html = `
        <div id="reportContent">
          <h2>📊 Turbo Tuga Token Report</h2>
          <p>✅ Token oficial detectado — informações limitadas</p>
          <p><b>Name / Symbol:</b> ${report.name} (${report.symbol})</p>
          <p><b>Mint:</b> ${report.mint}</p>
          <p><b>Score:</b> ${report.score}/100 <span class="${badgeClass}">✅ Confiável</span></p>
          <img src="${chooseMeme()}" class="meme" />
          <p class="small">Links de compra no final do relatório</p>
        </div>
        <div class="footer-actions">
          <button onclick="exportPDF()">📄 Exportar PDF</button>
          <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
          <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
        </div>
      `;
      reportDiv.innerHTML = `<div class="card">${html}</div>`;
      return;
    }

    // 2) Mint account parsed (supply / decimals / authorities)
    const mintAccount = await connection.getParsedAccountInfo(mintPub);
    if (mintAccount?.value?.data?.parsed?.info) {
      const info = mintAccount.value.data.parsed.info;
      report.supply = info.supply ?? report.supply;
      report.decimals = info.decimals ?? report.decimals;
      report.mintAuthority = info.mintAuthority ?? "null";
      report.freezeAuthority = info.freezeAuthority ?? "null";

      report.criteria.push({ name: "Supply", value: report.supply, points: 10 });
      report.criteria.push({ name: "Mint Authority", value: report.mintAuthority, points: (report.mintAuthority === "null") ? 10 : 0 });
      report.criteria.push({ name: "Freeze Authority", value: report.freezeAuthority, points: (report.freezeAuthority === "null") ? 5 : 0 });
    } else {
      // fallback: try raw account
      try {
        const raw = await connection.getAccountInfo(mintPub);
        if (raw) {
          report.criteria.push({ name: "Supply (raw)", value: "exists", points: 5 });
        }
      } catch(e){}
    }

    // 3) Top holders (safe: only top 10)
    try {
      const largest = await connection.getTokenLargestAccounts(mintPub);
      if (largest?.value?.length) {
        report.topHolders = largest.value.slice(0,10).map(a => ({ address: a.address, amount: a.uiAmountString ?? a.amount }));
        report.holders = largest.value.length;
        report.criteria.push({ name: "Holders", value: report.holders, points: (report.holders > 1000) ? 20 : 10 });
      }
    } catch (e) {
      console.warn("holders error", e.message);
      report.holders = "N/A";
    }

    // 4) Metadata (Metaplex) -> try to extract URI then fetch JSON
    try {
      const TOKEN_METADATA_PROGRAM_ID = new solanaWeb3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
      const [metadataPDA] = await solanaWeb3.PublicKey.findProgramAddress(
        [new TextEncoder().encode("metadata"), TOKEN_METADATA_PROGRAM_ID.toBytes(), mintPub.toBytes()],
        TOKEN_METADATA_PROGRAM_ID
      );
      const accInfo = await connection.getAccountInfo(metadataPDA);
      if (accInfo?.data) {
        // decode and extract URL (loose but works for many on-chain metadatas)
        const decoded = new TextDecoder("utf-8").decode(accInfo.data);
        const m = decoded.match(/https?:\/\/[^\s"]+/);
        if (m && m[0]) {
          const metadataUrl = m[0].replace(/\u0000/g,"");
          try {
            const json = await safeFetchJson(metadataUrl);
            report.name = json.name ?? report.name;
            report.symbol = json.symbol ?? report.symbol;
            report.website = (json?.external_url || json?.properties?.website || json?.extensions?.website) ?? report.website;
            report.twitter = json?.twitter ?? json?.properties?.twitter ?? report.twitter;
            report.discord = json?.discord ?? report.discord;
            report.image = json.image ?? json.image_url ?? "";
            report.criteria.push({ name: "Metadata Name", value: report.name, points: (report.name !== "Unknown") ? 10 : 0 });
            report.criteria.push({ name: "Metadata Symbol", value: report.symbol, points: (report.symbol !== "Unknown") ? 10 : 0 });
            report.criteria.push({ name: "Website", value: report.website, points: (report.website !== "N/A") ? 5 : 0 });
            report.criteria.push({ name: "Twitter", value: report.twitter, points: (report.twitter !== "N/A") ? 5 : 0 });
            report.criteria.push({ name: "Discord", value: report.discord, points: (report.discord !== "N/A") ? 5 : 0 });
          } catch(e){
            console.warn("metadata fetch failed", e.message);
          }
        }
      }
    } catch(e){ console.warn("metadata error", e.message); }

    // 5) Creation date: find first signature for the mint and get the blockTime
    try {
      const sigs = await connection.getSignaturesForAddress(mintPub, {limit:20});
      if (sigs && sigs.length > 0) {
        // try last signature in the list (oldest returned first? we request limit small - we attempt to find earliest by paging would be expensive)
        const last = sigs[sigs.length-1];
        if (last && last.blockTime) {
          report.creationDate = new Date(last.blockTime * 1000).toLocaleString();
        } else if (last && last.signature) {
          const tx = await connection.getTransaction(last.signature, {commitment:"confirmed"});
          if (tx && tx.blockTime) report.creationDate = new Date(tx.blockTime * 1000).toLocaleString();
        }
      } else {
        report.creationDate = "N/A";
      }
    } catch(e) {
      console.warn("creation date error", e.message);
    }

    // 6) Price & Liquidity attempts using Solscan and Shyft (best-effort). If fail, we keep N/A.
    // Solscan price endpoint (best-effort)
    try {
      const solscanUrl = `https://pro-api.solscan.io/v2.0/token/price?address=${encodeURIComponent(mintInput)}`;
      const priceResp = await fetch(solscanUrl, { headers: { "Authorization": `Bearer ${SOLSCAN_KEY}` }});
      if (priceResp.ok) {
        const pd = await priceResp.json().catch(()=>null);
        if (pd && pd.data && pd.data.length && pd.data[0].price) {
          report.price = pd.data[0].price + " USD";
        }
      }
    } catch(e){ console.warn("solscan price err", e.message); }

    // Shyft pools (best-effort)
    try {
      // shyft endpoint depends on plan; try public defipools for solana
      const shyftUrl = `https://api.shyft.to/solana/defi/pools?network=mainnet&token=${encodeURIComponent(mintInput)}`;
      const shyftResp = await fetch(shyftUrl, { headers: { "x-api-key": SHYFT_KEY, "Content-Type":"application/json" }});
      if (shyftResp.ok) {
        const sp = await shyftResp.json().catch(()=>null);
        // try to derive a liquidity summary
        if (sp && sp.data && sp.data.length>0) {
          // sum TVL if available
          let tvl = 0;
          sp.data.forEach(p => {
            if (p.tvl) tvl += Number(p.tvl);
            else if (p.liquidityUSD) tvl += Number(p.liquidityUSD || 0);
          });
          if (tvl > 0) report.liquidity = tvl.toLocaleString("pt-BR", {maximumFractionDigits:2}) + " USD";
        }
      }
    } catch(e){ console.warn("shyft pools err", e.message); }

    // 7) Tax on sell / locked liquidity / burned tokens — best-effort heuristic:
    // - If mintAuthority exists -> warn potential inflation
    // - If top holder concentration very high -> flag
    try {
      // concentration: percent held by top 3
      const top = report.topHolders;
      if (top && top.length) {
        const total = Number(report.supply) || 0;
        let topSum = 0;
        for (let i=0;i<Math.min(3,top.length);i++){
          const amt = Number( String(top[i].amount).replace(/,/g,"") ) || 0;
          topSum += amt;
        }
        if (total>0) {
          const pct = (topSum / total) * 100;
          if (pct > 50) { report.taxSell = "Alta concentração — risco de dump"; report.criteria.push({ name:"Concentração top3", value: pct.toFixed(2) + "%", points: 0 }); }
          else { report.criteria.push({ name:"Concentração top3", value: pct.toFixed(2) + "%", points: 5 }); }
        } else {
          report.criteria.push({ name:"Concentração top3", value: "N/A", points: 0 });
        }
      }
      // burned detection: if token has burn or special addresses we'd need ledger scans - keep N/A
      report.burned = "N/A";
    } catch(e){ console.warn("heuristic err", e.message); }

    // 8) Score + status
    report.score = report.criteria.reduce((acc,c)=>acc + (c.points || 0), 0);
    let status="", badgeClass="";
    if (report.score >= 70) { status = "✅ Confiável"; badgeClass = "badge-safe"; }
    else if (report.score >= 50) { status = "⚠️ Risco Médio"; badgeClass = "badge-medium"; }
    else { status = "❌ Possível SCAM"; badgeClass = "badge-scam"; }

    // 9) Render report
    const tableRows = report.criteria.map(c => `<tr><td>${c.name}</td><td>${c.value ?? ''}</td><td class="score-badge">${c.points ?? 0}</td></tr>`).join("");
    const topHoldersHTML = (report.topHolders.length>0) ? report.topHolders.map(h => `<li title="${h.address}">${short(h.address)} — ${Number(h.amount).toLocaleString()}</li>`).join("") : "<li>Nenhum dado</li>";
    const imageHtml = report.image ? `<img src="${report.image}" alt="logo" style="max-width:100px; display:block; margin:10px auto; border-radius:8px;" />` : "";

    const html = `
      <div id="reportContent">
        <h2>📊 Turbo Tuga Token Report</h2>
        ${imageHtml}
        <img src="${chooseMeme()}" class="meme" />
        <table class="table-score">
          <tr><th>Critério</th><th>Valor</th><th>Pontos</th></tr>
          ${tableRows}
        </table>

        <p><b>Score Total:</b> ${report.score}/100 <span class="${badgeClass}">${status}</span></p>

        <p><b>Mint (código):</b> ${report.mint}</p>
        <p><b>Nome / Símbolo:</b> ${report.name} / ${report.symbol}</p>
        <p><b>Supply:</b> ${report.supply} <b>|</b> <b>Decimals:</b> ${report.decimals}</p>
        <p><b>Mint Authority:</b> ${report.mintAuthority} <b>|</b> <b>Freeze Authority:</b> ${report.freezeAuthority}</p>
        <p><b>Data de Criação (estimada):</b> ${report.creationDate}</p>
        <p><b>Preço:</b> ${report.price} <b>|</b> <b>Liquidez (estimada):</b> ${report.liquidity}</p>
        <p><b>Taxa de Venda (heurística):</b> ${report.taxSell} <b>|</b> <b>Queimado:</b> ${report.burned}</p>

        <p><b>Top 10 Holders:</b></p>
        <ul class="top-holders">${topHoldersHTML}</ul>

        <p>
          <a href="https://www.orca.so/?tokenIn=${TURBO_MINT}&tokenOut=So11111111111111111111111111111111111111112" target="_blank">Comprar Turbo Tuga em DEX Orca</a> |
          <a href="https://jup.ag/swap?sell=${TURBO_MINT}&buy=So11111111111111111111111111111111111111112" target="_blank">Comprar Token Turbo Tuga dex Jupiter</a>
        </p>

        <p class="small"><i>⚠️ Material educativo — não é recomendação de compra ou venda.</i></p>
      </div>

      <div class="footer-actions">
        <button onclick="exportPDF()">📄 Exportar PDF</button>
        <button onclick="shareTwitter()">🐦 Compartilhar Twitter</button>
        <button onclick="shareTelegram()">📢 Compartilhar Telegram</button>
      </div>
    `;

    reportDiv.innerHTML = `<div class="card">${html}</div>`;

  } catch (err) {
    console.error("Relatório: erro", err);
    document.getElementById("report").innerHTML = `<div class="card"><p class="hint">❌ Erro ao gerar relatório: ${err.message}</p></div>`;
  }
}

// ----------------------------- UI hookups -----------------------------
document.getElementById("btnGenerate").addEventListener("click", generateReport);
document.getElementById("btnRpcSwitch").addEventListener("click", switchRpc);

// ----------------------------- Export / share -----------------------------
function exportPDF() {
  const el = document.getElementById("reportContent");
  if (!el) return alert("Gere um relatório primeiro.");
  const opt = { margin:0.3, filename: `TurboTuga_Report_${Date.now()}.pdf`, image:{type:'jpeg', quality:0.95}, html2canvas:{scale:2}, jsPDF:{unit:'in', format:'a4', orientation:'portrait'} };
  html2pdf().set(opt).from(el).save();
}

function shareTwitter() {
  const el = document.getElementById("reportContent");
  if (!el) return alert("Gere um relatório primeiro.");
  const text = el.innerText.slice(0, 280);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}
function shareTelegram() {
  const el = document.getElementById("reportContent");
  if (!el) return alert("Gere um relatório primeiro.");
  const text = el.innerText.slice(0, 1000);
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}
