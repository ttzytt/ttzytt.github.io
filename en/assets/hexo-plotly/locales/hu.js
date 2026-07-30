(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale hu');
  }
  window.Plotly.register({"moduleType":"locale","name":"hu","dictionary":{},"format":{"days":["Vasárnap","Hétfö","Kedd","Szerda","Csütörtök","Péntek","Szombat"],"shortDays":["Vas","Hét","Ked","Sze","Csü","Pén","Szo"],"months":["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"],"shortMonths":["Jan","Feb","Már","Ápr","Máj","Jún","Júl","Aug","Szep","Okt","Nov","Dec"],"date":"%Y-%m-%d"}});
})();
