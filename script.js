// --- Shyft (on-chain data) ---
let shyftOk = false;
try {
  const shyftRes = await fetch(
    `https://api.shyft.to/sol/v1/token/get_info?network=mainnet-beta&token_address=${mint}`,
    { headers: { "x-api-key": shyftKey } }
  );
  const shyftData = await shyftRes.json();
  if (shyftData.success && shyftData.result) {
    const d = shyftData.result;
    report.name = d.name || report.name;
    report.symbol = d.symbol || report.symbol;
    report.supply = d.supply || report.supply;
    report.decimals = d.decimals || report.decimals;
    report.mintAuthority = d.mint_authority || report.mintAuthority;
    report.freezeAuthority = d.freeze_authority || report.freezeAuthority;
    report.holders = d.holder || report.holders;
    report.website = d.extensions?.website || report.website;
    shyftOk = true;
  }
} catch (e) {
  console.warn("Shyft error", e);
}

// --- Solscan fallback (se Shyft falhar) ---
if (!shyftOk) {
  try {
    const solscanRes = await fetch(`https://public-api.solscan.io/token/meta?tokenAddress=${mint}`);
    const solscanData = await solscanRes.json();
    if (solscanData) {
      report.name = solscanData.name || report.name;
      report.symbol = solscanData.symbol || report.symbol;
      report.decimals = solscanData.decimals || report.decimals;
      report.supply = solscanData.totalSupply || report.supply;
      report.holders = solscanData.holder || report.holders;
      if (solscanData.website) report.website = solscanData.website;
    }
  } catch (e) {
    console.warn("Solscan error", e);
  }
}
