async function generateReport() {
  const mint = document.getElementById("tokenInput").value.trim();
  if (!mint) {
    alert("⚠️ Informe um token mint address válido.");
    return;
  }

  const shyftKey = window.CONFIG.SHYFT_API_KEY;
  const birdeyeKey = window.CONFIG.BIRDEYE_API_KEY;

  let report = {
    name: "Unknown",
    symbol: "Unknown",
    supply: "N/A",
    decimals: "N/A",
    holders: "N/A",
    mintAuthority: "N/A",
    freezeAuthority: "N/A",
    price: "N/A",
    volume24h: "N/A",
    liquidity: "N/A",
    marketCap: "N/A",
    website: "N/A"
  };

  try {
    // --- Shyft ---
    const shyftRes = await fetch(
      `https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`,
      { headers: { "x-api-key": shyftKey } }
    );
    const shyftData = await shyftRes.json();
    if (shyftData.success) {
      const d = shyftData.result;
      report.name = d.name || report.name;
      report.symbol = d.symbol || report.symbol;
      report.supply = d.supply || report.supply;
      report.decimals = d.decimals || report.decimals;
      report.mintAuthority = d.mint_authority || "Revoked";
      report.freezeAuthority = d.freeze_authority || "None";
    }

    // --- Birdeye ---
    if (birdeyeKey) {
      const beRes = await fetch(
        `https://public-api.birdeye.so/defi/token_overview?address=${mint}`,
        { headers: { "X-API-KEY": birdeyeKey } }
      );
      const beData = await beRes.json();
      if (beData.success && beData.data) {
        report.price = beData.data.price || report.price;
        report.volume24h = beData.data.volume24h || report.volume24h;
        report.liquidity = beData.data.liquidity || report.liquidity;
        report.marketCap = beData.data.mc || report.marketCap;
        report.website = beData.data.website || report.website;
      }
    }

    // --- Solscan (holders) ---
    const solscanRes = await fetch(`https://public-api.solscan.io/token/holders?tokenAddress=${mint}&limit=1`);
    const solscanData = await solscanRes.json();
    if (solscanData && solscanData.data) {
      report.holders = solscanData.total || report.holders;
    }

    // --- Jupiter (preço fallback) ---
    const jupRes = await fetch(`https://price.jup.ag/v6/price?ids=${mint}`);
    const jupData = await jupRes.json();
    if (jupData.data && jupData.data[mint]) {
      report.price = jupData.data[mint].price || report.price;
    }

    // --- Score simples ---
    let score = 50;
    if (report.holders !== "N/A" && report.holders > 1000) score += 10;
    if (report.liquidity !== "N/A" && report.liquidity > 10000) score += 10;
    if (report.mintAuthority === "Revoked") score += 5;

    // --- Lista de 30 GIFs engraçados ---
    const gifs = [
      "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
      "https://media.giphy.com/media/l3vR85PnGsBwu1PFK/giphy.gif",
      "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
      "https://media.giphy.com/media/xT5LMzIK1AdZJ2y2dC/giphy.gif",
      "https://media.giphy.com/media/jUwpNzg9IcyrK/giphy.gif",
      "https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif",
      "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif",
      "https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif",
      "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif",
      "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
      "https://media.giphy.com/media/l4KibWpBGWchSqCRy/giphy.gif",
      "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
      "https://media.giphy.com/media/26u4hLq6uB6D4jUuk/giphy.gif",
      "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
      "https://media.giphy.com/media/26n6xBpxNXExDfuKk/giphy.gif",
      "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
      "https://media.giphy.com/media/3o7aD4K2kpkj8cYFLO/giphy.gif",
      "https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif",
      "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif",
      "https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif",
      "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif",
      "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
      "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif",
      "https://media.giphy.com/media/3o7TKQb2g2y5PNeHFS/giphy.gif",
      "https://media.giphy.com/media/xT9IgGKHj7KnwS0wA0/giphy.gif",
      "https://media.giphy.com/media/l0ExncehJzexFpRHq/giphy.gif",
      "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
      "https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif",
      "https://media.giphy.com/media/26gR1K3H4wbG5P2Zy/giphy.gif",
      "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif"
    ];
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

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
      <p><b>Mint authority:</b> ${report.mintAuthority}</p>
      <p><b>Freeze authority:</b> ${report.freezeAuthority}</p>
      <p><b>Website:</b> ${report.website}</p>
      <div class="gif-box"><img src="${randomGif}" width="300"></div>
      <hr>
      <button onclick="exportPDF()">📄 Exportar PDF</button>
      <button onclick="shareReport()">📢 Compartilhar</button>
    `;
  } catch (err) {
    console.error("Erro detalhado:", err);
    document.getElementById("report").innerHTML = `❌ Erro: ${err.message}`;
  }
}

// --- Export PDF (placeholder) ---
function exportPDF() {
  alert("📄 Export PDF será implementado futuramente.");
}

// --- Share (Twitter + Telegram) ---
function shareReport() {
  const text = document.getElementById("report").innerText;
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  const telegram = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
  window.open(twitter, "_blank");
  window.open(telegram, "_blank");
}
