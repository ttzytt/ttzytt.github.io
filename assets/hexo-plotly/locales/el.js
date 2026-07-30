(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale el');
  }
  window.Plotly.register({"moduleType":"locale","name":"el","dictionary":{},"format":{"days":["Κυριακή","Δευτέρα","Τρίτη","Τετάρτη","Πέμπτη","Παρασκευή","Σάββατο"],"shortDays":["Κυρ","Δευ","Τρι","Τετ","Πεμ","Παρ","Σαβ"],"months":["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος"],"shortMonths":["Ιαν","Φεβ","Μαρ","Απρ","Μαι","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"],"date":"%d/%m/%Y"}});
})();
