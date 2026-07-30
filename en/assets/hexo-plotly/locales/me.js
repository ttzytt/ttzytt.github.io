(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale me');
  }
  window.Plotly.register({"moduleType":"locale","name":"me","dictionary":{},"format":{"days":["Неђеља","Понеђељак","Уторак","Сриједа","Четвртак","Петак","Субота"],"shortDays":["Неђ","Пон","Уто","Сри","Чет","Пет","Суб"],"months":["Јануар","Фебруар","Март","Април","Мај","Јун","Јул","Август","Септембар","Октобар","Новембар","Децембар"],"shortMonths":["Јан","Феб","Мар","Апр","Мај","Јун","Јул","Авг","Сеп","Окт","Нов","Дец"],"date":"%d/%m/%Y"}});
})();
