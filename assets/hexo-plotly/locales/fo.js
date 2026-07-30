(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale fo');
  }
  window.Plotly.register({"moduleType":"locale","name":"fo","dictionary":{},"format":{"days":["Sunnudagur","Mánadagur","Týsdagur","Mikudagur","Hósdagur","Fríggjadagur","Leyardagur"],"shortDays":["Sun","Mán","Týs","Mik","Hós","Frí","Ley"],"months":["Januar","Februar","Mars","Apríl","Mei","Juni","Juli","August","September","Oktober","November","Desember"],"shortMonths":["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Des"],"date":"%d-%m-%Y"}});
})();
