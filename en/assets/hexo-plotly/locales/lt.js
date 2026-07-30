(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale lt');
  }
  window.Plotly.register({"moduleType":"locale","name":"lt","dictionary":{},"format":{"days":["sekmadienis","pirmadienis","antradienis","trečiadienis","ketvirtadienis","penktadienis","šeštadienis"],"shortDays":["sek","pir","ant","tre","ket","pen","šeš"],"months":["Sausis","Vasaris","Kovas","Balandis","Gegužė","Birželis","Liepa","Rugpjūtis","Rugsėjis","Spalis","Lapkritis","Gruodis"],"shortMonths":["Sau","Vas","Kov","Bal","Geg","Bir","Lie","Rugp","Rugs","Spa","Lap","Gru"],"date":"%Y-%m-%d"}});
})();
