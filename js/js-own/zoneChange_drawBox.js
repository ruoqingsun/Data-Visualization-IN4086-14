var stage = 0;
var labels = true;

var margin = {top: 30, right: 50, bottom: 70, left: 50}
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var min = [Infinity, Infinity];
var max = [-Infinity, -Infinity];

var data = [];
data[0] = [];   //win data
data[1] = [];   //lose data

data[0][0] = [];
data[0][1] = [];
data[0][2] = [];
data[0][3] = [];

data[1][0] = [];
data[1][1] = [];
data[1][2] = [];
data[1][3] = [];

data[0][0][0] = "Normal";
data[0][1][0] = "High";
data[0][2][0] = "Very High";
data[0][3][0] = "Professional";

data[0][0][1] = [];
data[0][1][1] = [];
data[0][2][1] = [];
data[0][3][1] = [];

data[1][0][0] = "Normal";
data[1][1][0] = "High";
data[1][2][0] = "Very High";
data[1][3][0] = "Professional";

data[1][0][1] = [];
data[1][1][1] = [];
data[1][2][1] = [];
data[1][3][1] = [];

data[2] = [];   //win data for Perminute zone change
data[3] = [];   //lose data for Perminute zone change

data[2][0] = [];  
data[2][1] = [];
data[2][2] = [];
data[2][3] = [];

data[3][0] = [];
data[3][1] = [];
data[3][2] = [];
data[3][3] = [];

data[2][0][0] = "Normal";
data[2][1][0] = "High";
data[2][2][0] = "Very High";
data[2][3][0] = "Professional";

data[2][0][1] = [];
data[2][1][1] = [];
data[2][2][1] = [];
data[2][3][1] = [];

data[3][0][0] = "Normal";
data[3][1][0] = "High";
data[3][2][0] = "Very High";
data[3][3][0] = "Professional";

data[3][0][1] = [];
data[3][1][1] = [];
data[3][2][1] = [];
data[3][3][1] = [];

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

var yLabel = ["Change", "Change/min/person"];

var svg;
var legend;
var boxes_win;
var boxes_lose;

d3.csv("data/zoneChange_perMinute.csv", function(error, csv){

  var winFlag;
  var tierFlag;

  csv.forEach(function(x){

    var match = x.match;
    var team = x.team;
    var won = x.won;
    var tier = x.tier;
    var change_per_min_person = parseFloat(x.change_per_min_person);

    winFlag = 1 - parseInt(x.won);

    min[1] = Math.min(min[1], change_per_min_person);
    max[1] = Math.max(max[1], change_per_min_person);

    // console.log("Min: " + min[stage] + "Max: " + max[stage]);

    if (tier == "Normal"){
      data[winFlag + 2][0][1].push(change_per_min_person);
    }

    else if(tier == "High"){
      data[winFlag + 2][1][1].push(change_per_min_person);
    }

    else if(tier == "VeryHigh"){
      data[winFlag + 2][2][1].push(change_per_min_person);
    }

    else if(tier == "Pro"){
      data[winFlag + 2][3][1].push(change_per_min_person);
    }

  });

  //console.log(data_pro);
  for (var i = 2; i < 4; i++){
    for(var j = 0; j < 4; j++){
      data[i][j][1].sort();
    }
  }



});

d3.csv("data/zoneChange.csv", function(error, csv){

  var winFlag;
  var tierFlag;

  csv.forEach(function(x){

    var match = x.match;
    var team = x.team;
    var won = x.won;
    var tier = x.tier;
    var change_zone_count = parseFloat(x.change_zone_count);

    winFlag = 1 - parseInt(x.won);

    min[0] = Math.min(min[0], change_zone_count);
    max[0] = Math.max(max[0], change_zone_count);

    if (tier == "Normal"){
      data[winFlag][0][1].push(change_zone_count);
    }

    else if(tier == "High"){
      data[winFlag][1][1].push(change_zone_count);
    }

    else if(tier == "VeryHigh"){
      data[winFlag][2][1].push(change_zone_count);
    }

    else if(tier == "Pro"){
      data[winFlag][3][1].push(change_zone_count);
    }

  });

  //console.log(data_pro);
  for (var i = 0; i < 2; i++){
    for(var j = 0; j < 4; j++){
      data[i][j][1].sort();
    }
  }

  //Draw Win-Mean Chart
  chart.domain([min[stage], max[stage]]);

  svg = d3.select("#boxPlotZoneChange")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "box")    
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Start from here!!!!!!!!!!!!!
  var legend = svg.append("g")
      .attr("class", "legend")
      .attr("x", width - 45)
      .attr("y", 5)
      .attr("height", 100)
      .attr("width", 100);

  legend.append("rect")
    .attr("x", width - 45)
    .attr("y", 5)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "steelblue");

  legend.append("text")
    .attr("x", width - 25)
    .attr("y", 14)
    .text("Win")
    .attr("font-size", 16);

  legend.append("rect")
    .attr("x", width - 45)
    .attr("y", 25)
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "lightcoral");

  legend.append("text")
    .attr("x", width - 25)
    .attr("y", 34)
    .text("Lose")
    .attr("font-size", 16);

  // the x-axis
  x.domain( data[0].map(function(d) { console.log(d); return d[0] } ) );

  x_lose.domain( data[1].map(function(d) { console.log(d); return d[0] } ) );

  xAixsScale.domain( data[0].map(function(d) { console.log(d); return d[0] } ) );

  // the y-axis
  y.domain([min[stage], max[stage]]);

  // draw the boxplots  
  boxes_win = svg.selectAll(".box_win")    
      .data(data[0])
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
      .attr("class", "box_win")
      .call(chart.width(x.rangeBand()));

  boxes_lose = svg.selectAll(".box_lose")
      .data(data[1])
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
        .text("Zone Change Analysis");
 
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
          .style("font-size", "12px") 
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
        .style("font-size", "12px") 
        .text("Tier");


});

function selectVariable()
{
  var e = document.getElementById("winOrLose");
  stage = e.selectedIndex;

  drawzoneChange(stage);
}

function drawzoneChange(stage){

  // the y-axis
    y.domain([min[stage], max[stage]]);
    // console.log("Min: " + min[stage] + "Max: " + max[stage]);
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
      .data(data[stage * 2 + 0])
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x(d[0])  + "," + margin.top + ")"; } )
      .attr("class", "box_win")
      .call(chart.width(x.rangeBand()).domain([min[stage], max[stage]]));

    boxes_lose = svg.selectAll(".box_lose")
      .data(data[stage * 2 + 1])
      .enter().append("g")
      .attr("transform", function(d) { return "translate(" +  x_lose(d[0])  + "," + margin.top + ")"; } )
      .attr("class", "box_lose")
      .call(chart.width(x_lose.rangeBand()).domain([min[stage], max[stage]]));

    boxes_win = svg.selectAll(".box_win")  
      .call(chart.width(x.rangeBand()));  
      //.remove();

    boxes_lose = svg.selectAll(".box_lose")
      .call(chart.width(x.rangeBand()));
      //.remove();

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