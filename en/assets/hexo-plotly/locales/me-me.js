(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale me-me');
  }
  window.Plotly.register({"moduleType":"locale","name":"me-ME","dictionary":{},"format":{"days":["Neđelja","Poneđeljak","Utorak","Srijeda","Četvrtak","Petak","Subota"],"shortDays":["Neđ","Pon","Uto","Sri","Čet","Pet","Sub"],"months":["Januar","Februar","Mart","April","Maj","Jun","Jul","Avgust","Septembar","Oktobar","Novembar","Decembar"],"shortMonths":["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"],"date":"%d/%m/%Y"}});
})();
