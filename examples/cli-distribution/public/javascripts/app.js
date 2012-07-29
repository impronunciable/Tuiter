
;(function(){

var data = []
  , torender = []
  , total = 0
  , others = 0
  , chart;

$(document).ready(function() {
  chart = new Highcharts.Chart({
    chart: {
      renderTo: 'container',
      plotBackgroundColor: null,
      backgroundColor: 'transparent',
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: 'Twitter client distribution'
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' % (' + this.point.y + ')';
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          color: '#000000',
          connectorColor: '#000000',
          formatter: function() {
            return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' % (' + this.point.y + ')';
          }
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Twitter clients distribution',
      data: [
      ]
    }]
  });

  var socket = io.connect();

  var b;
  socket.on('tweet', function(client){
    b = false;
    total++;
    for(var i in data){
      if(data[i].name === client){ 
        data[i].y++;
        b = true;
      }
    }

    if(!b){ 
      data.push({name: client, y: 1});
    }

  });
});

var refresh = function(){
  others = 0;
  for(var i in data){
      if(data[i].y / total > 0.001) torender.push(data[i]);
      else others += data[i].y;
  }
  if(others)
    torender.push({name: 'others', y: others});

  chart.series[0].setData(torender);   
  chart.redraw();
  torender = [];
  
  setTimeout(arguments.callee, 500);
};

setTimeout(refresh, 500);

})();
