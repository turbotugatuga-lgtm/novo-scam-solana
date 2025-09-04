async function safeFetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.warn("⚠️ Resposta não-JSON de:", url, text.slice(0,100));
      return null;
    }
  } catch (err) {
    console.error("❌ Erro de rede:", err);
    return null;
  }
}

// 30 memes/GIFs
const memes = [
  "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
  "https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif",
  "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
  "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
  "https://media.giphy.com/media/26gsspf0C0j7M2z20/giphy.gif",
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/3oKIPwoeGErMmaI43C/giphy.gif",
  "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
  "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/3o6fJ1BM7r60LymVji/giphy.gif",
  "https://media.giphy.com/media/UqZ9m6R7gqC8w/giphy.gif",
  "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
  "https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif",
  "https://media.giphy.com/media/3oKIPCSX4UHmuS41TG/giphy.gif",
  "https://media.giphy.com/media/xT1Ra4uO6t8U6uR8Le/giphy.gif",
  "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
  "https://media.giphy.com/media/3ohhwJ7h5wcC2D5nna/giphy.gif",
  "https://media.giphy.com/media/l1J3preURPiwjRPvG/giphy.gif",
  "https://media.giphy.com/media/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
  "https://media.giphy.com/media/xT0GqeSlGSRQutnWHe/giphy.gif",
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/3ohhwJ7h5wcC2D5nna/giphy.gif",
  "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
  "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif"
];

async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  if (!mint) return alert("⚠️ Informe um token mint address válido.");

  const shyftKey = window.CONFIG.SHYFT_API_KEY;
  const birdeyeKey = window.CONFIG.BIRDEYE_API_KEY;

  let report = {
    name: "Unknown", symbol: "Unknown", supply: "N/A", decimals: "N/A",
    holders: "N/A", mintAuthority: "N/A", freezeAuthority: "N/A",
    price: "N/A", volume24h: "N/A", liquidity: "N/A", marketCap: "N/A",
    website: "N/A", twitter: "N/A", discord: "N/A"
  };

  try {
    // --- Shyft ---
    const shyftData = await safeFetchJson(
      `https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`,
      { headers: { "x-api-key": shyftKey } }
    );
    if (shyftData?.success) {
      const d = shyftData.result;
      report.name = d.name || report.name;
      report.symbol = d.symbol || report.symbol;
      report.supply = d.supply || report.supply;
      report.decimals = d.decimals || report.decimals;
      report.mintAuthority = d.mint_authority || "Revoked";
      report.freezeAuthority = d.freeze_authority || "None";

      // --- Metadados on-chain (uri)
      if(d.uri){
        const metadata = await safeFetchJson(d.uri);
        if(metadata){
          report.website = metadata?.properties?.website || report.website;
          report.twitter = metadata?.properties?.twitter || report.twitter;
          report.discord = metadata?.properties?.discord || report.discord;
        }
      }
    }

    // --- Birdeye ---
    if(birdeyeKey){
      const beData = await safeFetchJson(
        `https://public-api.birdeye.so/public/token_overview?address=${mint}&chain=solana`,
        { headers: {"X-API-KEY": birdeyeKey} }
      );
      if(beData?.success && beData?.data){
        report.price = beData.data.price || report.price;
        report.volume24h = beData.data.volume24h || report.volume24h;
        report.liquidity = beData.data.liquidity || report.liquidity;
        report.marketCap = beData.data.mc || report.marketCap;
      }
    }

    // --- Solscan ---
    const solscanData = await safeFetchJson(
      `https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=1`
    );
    if(solscanData?.data) report.holders = solscanData.total || report.holders;

    // --- Jupiter ---
    const jupData = await safeFetchJson(`https://price.jup.ag/v6/price?ids=${mint}`);
    if(jupData?.data?.[mint]) report.price = jupData.data[mint].price || report.price;

    // --- Score ---
    let score = 50;
    if(report.mintAuthority==="Revoked") score+=10;
    if(report.freezeAuthority==="None") score+=10;
    if(report.holders!=="N/A" && report.holders>1000) score+=20;

    // --- Meme aleatório ---
    const meme = memes[Math.floor(Math.random()*memes.length)];

    // --- Render ---
    document.getElementById("report").innerHTML = `
      <h2>📊 Token Report</h2>
      <p><b>Name / Symbol:</b> ${report.name} (${report.symbol})</p>
      <p><b>Mint:</b> ${mint}</p>
      <p><b>Score:</b> ${score}/100</p>
      <p><b>Price:</b> ${report.price}</p>
      <p><b>24h Volume:</b> ${report.volume24h}</p>
      <p><b>Liquidity:</b> ${report.liquidity}</p>
      <p><b>Market Cap:</b> ${report.marketCap}</p>
      <p><b>Supply / Decimals:</b> ${report.supply} / ${report.decimals}</p>
      <p><b>Holders:</b> ${report.holders}</p>
      <p><b>Mint Authority:</b> ${report.mintAuthority}</p>
      <p><b>Freeze Authority:</b> ${report.freezeAuthority}</p>
      <p><b>Website:</b> <a href="${report.website}" target="_blank">${report.website}</a></p>
      <p><b>Twitter:</b> ${report.twitter}</p>
      <p><b>Discord:</b> ${report.discord}</p>
      <p><b>Risk:</b> ⚠️ Medium risk — caution advised</p>
      <img src="${meme}" class="meme"/>
      <div style="margin-top:20px;">
        <button onclick="window.open('https://app.orca.so', '_blank')">🐬 Buy on Orca</button>
        <button onclick="window.open('https://jup.ag', '_blank')">🚀 Buy on Jupiter</button>
        <button onclick="window.open('https://solscan.io/account/2NERt9zLBG2tKbcPXwfBYsRrPhFMVAxpR6ajfeEWeJSB','_blank')">❤️ Donate</button>
        <button onclick="exportPDF()">📄 PDF</button>
        <button onclick="shareTwitter()">🐦 Share Twitter</button>
        <button onclick="shareTelegram()">📢 Share Telegram</button>
      </div>
    `;
  } catch(err){
    console.error("❌ Erro final:", err);
    document.getElementById("report").innerHTML = `❌ Erro ao gerar relatório: ${err.message}`;
  }
}

function exportPDF(){ alert("📄 Função PDF ainda em desenvolvimento"); }
function shareTwitter(){
  const text=document.getElementById("report").innerText;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
}
function shareTelegram(){
  const text=document.getElementById("report").innerText;
  window.open(`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`, "_blank");
}
