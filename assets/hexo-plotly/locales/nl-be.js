(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale nl-be');
  }
  window.Plotly.register({"moduleType":"locale","name":"nl-BE","dictionary":{},"format":{"days":["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],"shortDays":["zo","ma","di","wo","do","vr","za"],"months":["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],"shortMonths":["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],"date":"%d/%m/%Y"}});
})();
