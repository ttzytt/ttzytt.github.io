(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale bs');
  }
  window.Plotly.register({"moduleType":"locale","name":"bs","dictionary":{},"format":{"days":["Nedelja","Ponedeljak","Utorak","Srijeda","Četvrtak","Petak","Subota"],"shortDays":["Ned","Pon","Uto","Sri","Čet","Pet","Sub"],"months":["Januar","Februar","Mart","April","Maj","Juni","Juli","August","Septembar","Oktobar","Novembar","Decembar"],"shortMonths":["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],"date":"%d.%m.%Y"}});
})();
