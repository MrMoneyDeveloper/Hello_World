import { j, fmtUSD, renderCard } from '../utils.js';

export async function render(el){
  try{
    const data = await j('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const body = `<ul class="list">
      <li>Bitcoin: ${fmtUSD(data.bitcoin.usd)}</li>
      <li>Ethereum: ${fmtUSD(data.ethereum.usd)}</li>
    </ul>`;
    renderCard(el, 'Crypto', body);
  }catch(e){ renderCard(el, 'Crypto', '<div class="small error">Crypto failed to load</div>'); }
}
