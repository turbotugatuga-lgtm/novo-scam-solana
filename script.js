// ===== RPC fallback: tenta múltiplos endpoints para evitar 403 no browser =====
candidates.push(`https://cloudflare-ipfs.com/ipfs/${p}`);
candidates.push(`https://ipfs.io/ipfs/${p}`);
} else {
candidates.push(uri);
}
for (const url of candidates){
try{
const r = await fetch(url, {mode:'cors'});
if (r.ok) return await r.json();
}catch(_){/* tenta o próximo */}
}
throw new Error('Falha ao baixar metadata JSON');
}


async function getMetadataUri(mintPub){
const METADATA_SEED = new TextEncoder().encode('metadata');
const [pda] = await solanaWeb3.PublicKey.findProgramAddress(
[METADATA_SEED, TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintPub.toBuffer()],
TOKEN_METADATA_PROGRAM_ID
);
const acc = await connection.getAccountInfo(pda);
if (!acc) return null;
// Heurística simples: procurar primeira URL (http/https/ipfs) no buffer
const txt = new TextDecoder('utf-8').decode(acc.data);
const m = txt.match(/(https?:\/\/|ipfs:\/\/)[^"'\s]+/);
return m ? m[0] : null;
}


function short(str){
return str && str.length>16 ? `${str.slice(0,6)}…${str.slice(-6)}` : (str||'');
}


async function generateReport(){
const mint = $('#tokenInput').value.trim();
if (!mint) { alert('⚠️ Informe um token mint válido'); return; }


loading(true); $('#report').classList.remove('error'); $('#report').innerHTML='';


let report = { name:'Unknown', symbol:'Unknown', logo:'', supply:'N/A', decimals:'N/A', holders:'N/A', website:'N/A', twitter:'N/A', discord:'N/A' };


try{
const mintPub = new solanaWeb3.PublicKey(mint);


// 1) Supply & Decimals
const supplyInfo = await connection.getTokenSupply(mintPub);
report.supply = supplyInfo.value.uiAmountString;
report.decimals = supplyInfo.value.decimals;


// 2) Holders aprox (conta maiores detentores)
const largest = await connection.getTokenLargestAccounts(mintPub);
report.holders = largest.value.length;


// 3) Metaplex Metadata -> JSON
const uri = await getMetadataUri(mintPub);
if (uri){
const meta = await fetchJsonFollowGateways(uri);
report.name = meta.name || report.name;
report.symbol = meta.symbol || report.symbol;
report.logo = resolveUri(meta.image || meta.logo || '');
if (meta.extensions){
report.website = meta.extensions.website || report.website;
report.twitter = meta.extensions.twitter || report.twitter;
report.discord = meta.extensions.discord || report.discord;
}
// se alguns projeto
