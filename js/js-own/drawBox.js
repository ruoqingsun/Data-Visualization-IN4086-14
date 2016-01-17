var labels = true;

var margin = {top: 30, right: 50, bottom: 70, left: 50}
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var stage = Math.floor((Math.random() * 4));    //0: win-mean; 1: win-variance; 2: lose-mean; 3: lose-variance
var stage = 0;
var min = [Infinity, Infinity, Infinity, Infinity];
var max = [-Infinity, -Infinity, -Infinity, -Infinity];
var yLabel = ["Mean", "Variance", "Mean", "Variance"];


var data_distance = [];
data_distance[0] = [];
data_distance[1] = [];
data_distance[2] = [];
data_distance[3] = [];


var chart = d3.box()
    .whiskers(iqr(1.5))
    .height(height)       //the height of the box
    .showLabels(labels);  //labels = true;


var x = d3.scale.ordinal()     
    .rangeRoundBands([0 - 30 , width - 30], 0.75, 0.25);

var x_lose = d3.scale.ordinal()     
    .rangeRoundBands([0 + 50 , width + 50], 0.75, 0.25);

var xAixsScale = d3.scale.ordinal()     
    .rangeRoundBands([0 , width], 0.75, 0.25);

var xAxis = d3.svg.axis()
    .scale(xAixsScale)
    .orient("bottom");

var y = d3.scale.linear()
    .range([height + margin.top, 0 + margin.top]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg;
var legend;
var boxes_win;
var boxes_lose;

//parse in the data
d3.csv("data/data_distance_normal.csv", function(error, csv){

  //data[i][0] The name of the tiers
  //data[i][1] The Array of values for this tier

  var data_normal = [];

  data_normal[0] = [];
  data_normal[1] = [];
  data_normal[2] = [];
  data_normal[3] = [];

  data_normal[0][0] = "Normal";
  data_normal[1][0] = "Normal";
  data_normal[2][0] = "Normal";
  data_normal[3][0] = "Normal";

  data_normal[0][1] = [];   //Win_mean
  data_normal[1][1] = [];   //Win_Variance
  data_normal[2][1] = [];   //Lose_mean
  data_normal[3][1] = [];   //Lose_distance

  csv.forEach(function(x){

    var match = x.match;
    var team = x.team;
    var win_lose = x.win_lose;
    var tier = x.tier;
    var mean = parseFloat(x.mean);
    var std = parseFloat(x.std);

    if(win_lose == "Win")
    {
      data_normal[0][1].push(mean);
      data_normal[1][1].push(std);

      min[0] = Math.min(min[0], mean);
      max[0] = Math.max(max[0], mean);

      min[1] = Math.min(min[1], std);
      max[1] = Math.max(max[1], std);

    }

    if(win_lose == "Lose")
    {
      data_normal[2][1].push(mean);
      data_normal[3][1].push(std);

      min[2] = Math.min(min[2], mean);
      max[2] = Math.max(max[2], mean);

      min[3] = Math.min(min[3], std);
      max[3] = Math.max(max[3], std);
    }

  });

  //console.log(data_normal);
  for(var i = 0; i < 4; i++){

      data_normal[i][1].sort();
      data_distance[i].push(data_normal[i]);
  } 

});

d3.csv("data/data_distance_high.csv", function(error, csv){

  //data[i][0] The name of the tiers
  //data[i][1] The Array of values for this tier

  var data_high = [];

  data_high[0] = [];
  data_high[1] = [];
  data_high[2] = [];
  data_high[3] = [];

  data_high[0][0] = "High";
  data_high[1][0] = "High";
  data_high[2][0] = "High";
  data_high[3][0] = "High";

  data_high[0][1] = [];   //Win_mean
  data_high[1][1] = [];   //Win_Variance
  data_high[2][1] = [];   //Lose_mean
  data_high[3][1] = [];   //Lose_distance

  csv.forEach(function(x){

    var match = x.match;
    var team = x.team;
    var win_lose = x.win_lose;
    var tier = x.tier;
    var mean = parseFloat(x.mean);
    var std = parseFloat(x.std);

    if(win_lose == "Win")
    {
      data_high[0][1].push(mean);
      data_high[1][1].push(std);

      min[0] = Math.min(min[0], mean);
      max[0] = Math.max(max[0], mean);

      min[1] = Math.min(min[1], std);
      max[1] = Math.max(max[1], std);

    }

    if(win_lose == "Lose")
    {
      data_high[2][1].push(mean);
      data_high[3][1].push(std);

      min[2] = Math.min(min[2], mean);
      max[2] = Math.max(max[2], mean);

      min[3] = Math.min(min[3], std);
      max[3] = Math.max(max[3], std);
    }

  });

  //console.log(data_normal);
  for(var i = 0; i < 4; i++){
      data_high[i][1].sort();
      data_distance[i].push(data_high[i]);
  } 

});

d3.csv("data/data_distance_vhigh.csv", function(error, csv){

  var data_vhigh = [];

  data_vhigh[0] = [];
  data_vhigh[1] = [];
  data_vhigh[2] = [];
  data_vhigh[3] = [];

  data_vhigh[0][0] = "Very High";
  data_vhigh[1][0] = "Very High";
  data_vhigh[2][0] = "Very High";
  data_vhigh[3][0] = "Very High";

  data_vhigh[0][1] = [];   //Win_mean
  data_vhigh[1][1] = [];   //Win_Variance
  data_vhigh[2][1] = [];   //Lose_mean
  data_vhigh[3][1] = [];   //Lose_distance

  csv.forEach(function(x){

    var match = x.match;
    var team = x.team;
    var win_lose = x.win_lose;
    var tier = x.tier;
    var mean = parseFloat(x.mean);
    var std = parseFloat(x.std);

    if(win_lose == "Win")
    {
      data_vhigh[0][1].push(mean);
      data_vhigh[1][1].push(std);

      min[0] = Math.min(min[0], mean);
      max[0] = Math.max(max[0], mean);

      min[1] = Math.min(min[1], std);
      max[1] = Math.max(max[1], std);

    }

    if(win_lose == "Lose")
    {
      data_vhigh[2][1].push(mean);
      data_vhigh[3][1].push(std);

      min[2] = Math.min(min[2], mean);
      max[2] = Math.max(max[2], mean);

      min[3] = Math.min(min[3], std);
      max[3] = Math.max(max[3], std);
    }

  });

  //console.log(data_normal);
  for(var i = 0; i < 4; i++){
      data_vhigh[i][1].sort();
      data_distance[i].push(data_vhigh[i]);
  } 

});

d3.csv("data/data_distance_pro.csv", function(error, csv){

  var data_pro = [];

  data_pro[0] = [];
  data_pro[1] = [];
  data_pro[2] = [];
  data_pro[3] = [];

  data_pro[0][0] = "Pro";
  data_pro[1][0] = "Pro";
  data_pro[2][0] = "Pro";
  data_pro[3][0] = "Pro";

  data_pro[0][1] = [];   //Win_mean
  data_pro[1][1] = [];   //Win_Variance
  data_pro[2][1] = [];   //Lose_mean
  data_pro[3][1] = [];   //Lose_distance

  csv.forEach(function(x){

    var match = x.match;
    var team = x.team;
    var win_lose = x.win_lose;
    var tier = x.tier;
    var mean = parseFloat(x.mean);
    var std = parseFloat(x.std);

    if(win_lose == "Win")
    {
      data_pro[0][1].push(mean);
      data_pro[1][1].push(std);

      min[0] = Math.min(min[0], mean);
      max[0] = Math.max(max[0], mean);

      min[1] = Math.min(min[1], std);
      max[1] = Math.max(max[1], std);

    }

    if(win_lose == "Lose")
    {
      data_pro[2][1].push(mean);
      data_pro[3][1].push(std);

      min[2] = Math.min(min[2], mean);
      max[2] = Math.max(max[2], mean);

      min[3] = Math.min(min[3], std);
      max[3] = Math.max(max[3], std);
    }

  });

  //console.log(data_pro);
  for(var i = 0; i < 4; i++){
      data_pro[i][1].sort();
      data_distance[i].push(data_pro[i]);
  }

  //Draw Win-Mean Chart
  chart.domain([Math.min(min[stage], min[stage+2]), Math.max(max[stage], max[stage+2])])   

  svg = d3.select("#boxPlotSvg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "box")    
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", width - 65)
    .attr("y", 25)
    .attr("height", 100)
    .attr("width", 100);

  legend.append("rect")
    .attr("x", width - 65)
    .attr("y", 25)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "steelblue");

  legend.append("text")
    .attr("x", width - 45)
    .attr("y", 34)
    .text("Win")
    .attr("font-size", 16);

  legend.append("rect")
    .attr("x", width - 65)
    .attr("y", 45)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "lightcoral");

  legend.append("text")
    .attr("x", width - 45)
    .attr("y", 54)
    .text("Lose")
    .attr("font-size", 16);

  // the x-axis
  x.domain( data_distance[stage].map(function(d) { console.log(d); return d[0] } ) );

  x_lose.domain( data_distance[stage+2].map(function(d) { console.log(d); return d[0] } ) );

  xAixsScale.domain( data_distance[stage].map(function(d) { console.log(d); return d[0] } ) );

  // the y-axis
  y.domain([Math.min(min[stage], min[stage+2]), Math.max(max[stage], max[stage+2])]);


  // draw the boxplots  
  boxes_win = svg.selectAll(".box_win")    
      .data(data_distance[stage])
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
      .attr("class", "box_win")
      .call(chart.width(x.rangeBand()));

  boxes_lose = svg.selectAll(".box_lose")
      .data(data_distance[stage+2])
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x_lose(d[0])  + "," + margin.top + ")"; } )
      .attr("class", "box_lose")
      .call(chart.width(x_lose.rangeBand()));

  // add a title
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 + (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        //.style("text-decoration", "underline")  
        .text("Within-Group Distance Analysis");
 
   // draw y axis
  svg.append("g")
        .attr("class", "y axis")
        .attr("id", "yAxis")
        .call(yAxis)
        .append("text") // and text1
          .attr("id", "yLabel")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("font-size", "16px") 
          .text(yLabel[stage]);    
  
  // draw x axis  
  svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
      .call(xAxis)
      .append("text")             // text label for the x axis
        .attr("x", (width) )
        .attr("y",  10 )
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", "16px") 
        .text("Tier");

  // d3.select("#container")
  //   .attr("position", "absolute" )
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("left", 0)
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // d3.select("#selectionUI")
  //   .attr("position", "relative")
  //   .attr("left", (width + margin.left + margin.right)/2);


});

function drawBoxPot(stage){

    // the y-axis
    y.domain([Math.min(min[stage], min[stage+2]), Math.max(max[stage], max[stage+2])]);
    yAxis.scale(y);

    d3.select("#yLabel").text(yLabel[stage]);
    d3.select("#yAxis").call(yAxis);

    console.log(yLabel[[stage]]);

    //labels = true;

    // boxes_win = svg.selectAll(".box_win")  
    //   .call(chart.width(x.rangeBand()));  
    //   //.remove();

    // boxes_lose = svg.selectAll(".box_lose")
    //   .call(chart.width(x.rangeBand()));
      //.remove();

    // chart = d3.box()
    //   .whiskers(iqr(1.5))
    //   .height(height)       //the height of the box
    //   .showLabels(labels);

    boxes_win = svg.selectAll(".box_win")    
      .data(data_distance[stage])
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
      .attr("class", "box_win")
      .call(chart.width(x.rangeBand()).domain([Math.min(min[stage], min[stage+2]), Math.max(max[stage], max[stage+2])]));

    boxes_lose = svg.selectAll(".box_lose")
      .data(data_distance[stage+2])
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x_lose(d[0])  + "," + margin.top + ")"; } )
      .attr("class", "box_lose")
      .call(chart.width(x_lose.rangeBand()).domain([Math.min(min[stage], min[stage+2]), Math.max(max[stage], max[stage+2])]));

    boxes_win = svg.selectAll(".box_win")  
      .call(chart.width(x.rangeBand()));  
      //.remove();

    boxes_lose = svg.selectAll(".box_lose")
      .call(chart.width(x.rangeBand()));
      //.remove();

}

function selectVariable(){

    var e = document.getElementById("meanOrVariance");
    stage = e.selectedIndex;

    drawBoxPot(stage);

}


// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}