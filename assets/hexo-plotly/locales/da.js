(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale da');
  }
  window.Plotly.register({"moduleType":"locale","name":"da","dictionary":{},"format":{"days":["Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag"],"shortDays":["Søn","Man","Tir","Ons","Tor","Fre","Lør"],"months":["Januar","Februar","Marts","April","Maj","Juni","Juli","August","September","Oktober","November","December"],"shortMonths":["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],"date":"%d-%m-%Y"}});
})();
