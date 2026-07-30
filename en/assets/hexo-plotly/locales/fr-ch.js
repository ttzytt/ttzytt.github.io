(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale fr-ch');
  }
  window.Plotly.register({"moduleType":"locale","name":"fr-CH","dictionary":{},"format":{"days":["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],"shortDays":["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"],"months":["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],"shortMonths":["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"],"date":"%d.%m.%Y"}});
})();
