(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale sl');
  }
  window.Plotly.register({"moduleType":"locale","name":"sl","dictionary":{},"format":{"days":["Nedelja","Ponedeljek","Torek","Sreda","Četrtek","Petek","Sobota"],"shortDays":["Ned","Pon","Tor","Sre","Čet","Pet","Sob"],"months":["Januar","Februar","Marec","April","Maj","Junij","Julij","Avgust","September","Oktober","November","December"],"shortMonths":["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"],"date":"%d.%m.%Y"}});
})();
