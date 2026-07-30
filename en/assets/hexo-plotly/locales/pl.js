(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale pl');
  }
  window.Plotly.register({"moduleType":"locale","name":"pl","dictionary":{},"format":{"days":["Niedziela","Poniedziałek","Wtorek","Środa","Czwartek","Piątek","Sobota"],"shortDays":["Nie","Pn","Wt","Śr","Czw","Pt","So"],"months":["Styczeń","Luty","Marzec","Kwiecień","Maj","Czerwiec","Lipiec","Sierpień","Wrzesień","Październik","Listopad","Grudzień"],"shortMonths":["Sty","Lu","Mar","Kw","Maj","Cze","Lip","Sie","Wrz","Pa","Lis","Gru"],"date":"%Y-%m-%d"}});
})();
