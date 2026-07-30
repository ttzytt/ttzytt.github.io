(() => {
  'use strict';
  if (!window.Plotly || typeof window.Plotly.register !== 'function') {
    throw new Error('Plotly must load before locale ka');
  }
  window.Plotly.register({"moduleType":"locale","name":"ka","dictionary":{},"format":{"days":["კვირა","ორშაბათი","სამშაბათი","ოთხშაბათი","ხუთშაბათი","პარასკევი","შაბათი"],"shortDays":["კვ","ორშ","სამ","ოთხ","ხუთ","პარ","შაბ"],"months":["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი","ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"],"shortMonths":["იან","თებ","მარ","აპრ","მაისი","ივნ","ივლ","აგვ","სექ","ოქტ","ნოე","დეკ"],"date":"%d/%m/%Y"}});
})();
