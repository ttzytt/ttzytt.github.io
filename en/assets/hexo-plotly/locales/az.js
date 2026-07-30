(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale az');
  }
  window.Plotly.register({"moduleType":"locale","name":"az","dictionary":{},"format":{"days":["Bazar","Bazar ertəsi","Çərşənbə axşamı","Çərşənbə","Cümə axşamı","Cümə","Şənbə"],"shortDays":["B","Be","Ça","Ç","Ca","C","Ş"],"months":["Yanvar","Fevral","Mart","Aprel","May","İyun","İyul","Avqust","Sentyabr","Oktyabr","Noyabr","Dekabr"],"shortMonths":["Yan","Fev","Mar","Apr","May","İyun","İyul","Avq","Sen","Okt","Noy","Dek"],"date":"%d.%m.%Y"}});
})();
