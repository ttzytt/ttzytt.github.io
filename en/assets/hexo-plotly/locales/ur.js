(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale ur');
  }
  window.Plotly.register({"moduleType":"locale","name":"ur","dictionary":{},"format":{"days":["اتوار","پير","منگل","بدھ","جمعرات","جمعہ","ہفتہ"],"shortDays":["اتوار","پير","منگل","بدھ","جمعرات","جمعہ","ہفتہ"],"months":["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"],"shortMonths":["1","2","3","4","5","6","7","8","9","10","11","12"],"date":"%d/%m/%Y"}});
})();
