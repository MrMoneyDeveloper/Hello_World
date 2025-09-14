import { fmtNum, renderCard, bus } from '../utils.js';
import { getZarRate } from '../rates.js';

export async function render(el){
  try{
    const data = await getZarRate('USD');
    const rate = data && data.rates && Number(data.rates.ZAR);
    if (Number.isFinite(rate)) {
      bus.emit('fx:rate', rate);
      renderCard(el, 'FX', `<div>1 USD = ${fmtNum(rate,{maximumFractionDigits:2})} ZAR</div>`);
    } else {
      renderCard(el, 'FX', `<div class="small error">Rate unavailable</div>`);
    }
  }catch(e){ renderCard(el, 'FX', '<div class="small error">FX failed to load</div>'); }
}
