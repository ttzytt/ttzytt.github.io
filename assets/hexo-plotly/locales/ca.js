(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale ca');
  }
  window.Plotly.register({"moduleType":"locale","name":"ca","dictionary":{},"format":{"days":["Diumenge","Dilluns","Dimarts","Dimecres","Dijous","Divendres","Dissabte"],"shortDays":["Dug","Dln","Dmt","Dmc","Djs","Dvn","Dsb"],"months":["Gener","Febrer","Març","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"],"shortMonths":["Gen","Feb","Mar","Abr","Mai","Jun","Jul","Ago","Set","Oct","Nov","Des"],"date":"%d/%m/%Y"}});
})();
