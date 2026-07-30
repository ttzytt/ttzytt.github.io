(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale ar-dz');
  }
  window.Plotly.register({"moduleType":"locale","name":"ar-DZ","dictionary":{},"format":{"days":["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"shortDays":["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"months":["جانفي","فيفري","مارس","أفريل","ماي","جوان","جويلية","أوت","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],"shortMonths":["1","2","3","4","5","6","7","8","9","10","11","12"],"date":"%d/%m/%Y"}});
})();
