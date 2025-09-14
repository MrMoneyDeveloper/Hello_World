import { j, fmtNum, renderCard, bus } from '../utils.js';

export async function render(el){
  try{
    const data = await j('https://api.exchangerate.host/latest?base=USD&symbols=ZAR');
    const rate = data && data.rates && data.rates.ZAR;
    if (rate) bus.emit('fx:rate', rate);
    renderCard(el, 'FX', `<div>1 USD = ${fmtNum(rate,{maximumFractionDigits:2})} ZAR</div>`);
  }catch(e){ renderCard(el, 'FX', '<div class="small error">FX failed to load</div>'); }
}
