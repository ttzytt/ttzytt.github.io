(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale fa');
  }
  window.Plotly.register({"moduleType":"locale","name":"fa","dictionary":{},"format":{"days":["يکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"],"shortDays":["ي","د","س","چ","پ","ج","ش"],"months":["فروردين","ارديبهشت","خرداد","تير","مرداد","شهريور","مهر","آبان","آذر","دي","بهمن","اسفند"],"shortMonths":["1","2","3","4","5","6","7","8","9","10","11","12"],"date":"%Y/%m/%d"}});
})();
