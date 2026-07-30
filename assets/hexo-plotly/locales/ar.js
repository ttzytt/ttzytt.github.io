(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale ar');
  }
  window.Plotly.register({"moduleType":"locale","name":"ar","dictionary":{},"format":{"days":["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"shortDays":["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"months":["كانون الثاني","شباط","آذار","نيسان","آذار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول"],"shortMonths":["1","2","3","4","5","6","7","8","9","10","11","12"],"date":"%d/%m/%Y"}});
})();
