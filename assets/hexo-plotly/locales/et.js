(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale et');
  }
  window.Plotly.register({"moduleType":"locale","name":"et","dictionary":{},"format":{"days":["Pühapäev","Esmaspäev","Teisipäev","Kolmapäev","Neljapäev","Reede","Laupäev"],"shortDays":["Pühap","Esmasp","Teisip","Kolmap","Neljap","Reede","Laup"],"months":["Jaanuar","Veebruar","Märts","Aprill","Mai","Juuni","Juuli","August","September","Oktoober","November","Detsember"],"shortMonths":["Jaan","Veebr","Märts","Apr","Mai","Juuni","Juuli","Aug","Sept","Okt","Nov","Dets"],"date":"%d.%m.%Y"}});
})();
