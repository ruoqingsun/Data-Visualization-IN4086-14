var stage = 0;

var margin = {top: 40, right: 30, bottom: 70, left: 40},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var visWidth = 430;

var svg = d3.select("#barchart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var vis = d3.select("#vis")
    .attr("width", visWidth)
    .attr("height", visWidth)
  .append("g")
    // .attr("transform", "translate(" + width + margin.left *2 +margin.right + "," + margin.top + ")");
    .attr("transform", "translate( 0, 0 )");

var background = d3.select("#background_image");
    background.selectAll("*").remove();

var defs= background.append('defs')
  defs.append("pattern")
    .attr("id", "bg_image")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", visWidth)
    .attr("height", visWidth)
  .append("svg:image")
    .attr("id","url_to_image")
    .attr("xlink:href", "image/map.png")
    .attr("width", visWidth)
    .attr("height", visWidth)
    .attr("x", 0)
    .attr("y", 0);

  background.append("a")
    .append("path")
    .attr("id","texture_path")
    .attr("d", "M 0,0, "+visWidth+",0, "+visWidth+","+visWidth+", 0,"+visWidth+", 0,0 z")
    .attr("transform", "translate(0, 0)")
    .attr("fill", "url(#bg_image)");


var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var imageSize = {x:128, y:128};
var xScale = d3.scale.linear()
  .domain([0, imageSize.x])
  .range([0, visWidth]);

var yScale = d3.scale.linear()
  .domain([0, imageSize.y])
  .range([visWidth, 0]);

// var color = d3.scale.ordinal()
//     .range(["#98abc5", "#7b6888", "#a05d56", "#ff8c00"]);

var colors = ["F08080", "#FFD700", "#32CD32", "#4682B4"];

var color = d3.scale.ordinal()
    .range(colors);


var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
    .tickFormat(function(d) {  

      var res = d.split("");
      //console.log("tick value: " + res);
      var returnLabel = "";
      
      for(var i = 0; i < res.length; i++){

        returnLabel += res[i] + " ";

      }

      return returnLabel;

    });

// var formatValue = d3.format(".2s");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".0%"));
    // .tickFormat(function(d) { return formatValue(d).replace('M', 'million'); });

var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

var min = [1.0, 1.0];
var max = [0.0, 0.0];

var strategies_all = [];
var strategies = [];
strategies[0] = [];
strategies[1] = [];
var tiers = [];

var detail;
var total;
var percent;

var state;
var bars;


d3.csv("data/open_strategy_new.csv", function(error, data) {
  if (error) throw error;

  tiers = d3.set(data.map(function(d) { return d.tier; })).values();
  console.log(tiers);

  strategies_all = d3.set(data.map(function(d) { return d.match_strategy; })).values();console.log(strategies_all);
  // console.log(ageNames);

  detail = createArray(2, strategies_all.length, tiers.length);
  total = createArray(2, tiers.length);
  percent = [];
  coordinate = createArray(2, strategies_all.length, tiers.length);

  for(var m = 0; m < 2; m++){

    percent[m] = [];

    for(var n = 0; n < strategies_all.length; n++){

      percent[m][n] = [];
      percent[m][n][0] = strategies_all[n];
      percent[m][n][1] = [];

      for(var o = 0; o < tiers.length; o ++){

        percent[m][n][1][o] = [];
        percent[m][n][1][o][0] = tiers[o]; 
        percent[m][n][1][o][1] = 0.0;
        detail[m][n][o] = 0;        
        total[m][o] = 0;
        coordinate[m][n][o] = [];
      }    
    }
  }

  data.forEach(function(d) {
    
    var match = d.match;
    var team = d.team;
    var player = d.player;
    var won = 1 - parseInt(d.won);
    var tier = d.tier;
    var xPosition = d.x;
    var yPosition = d.y;
    var zone = d.zone;
    var match_strategy = d.match_strategy;

    var tierIndex = tiers.indexOf(tier);
    var strategyIndex = strategies_all.indexOf(match_strategy);

    detail[won][strategyIndex][tierIndex] += 1;
    total[won][tierIndex] += 1;

    strategies[won].push(match_strategy);
    coordinate[won][strategyIndex][tierIndex].push([xPosition, yPosition]);

  });

  strategies[0] = d3.set(strategies[0]).values();
  strategies[1] = d3.set(strategies[1]).values();

  console.log("strategies win: " + strategies[0].length);
  console.log("strategies lose: " + strategies[1].length);

  console.log(detail);
  console.log(total);

  for(var m = 0; m < 2; m++){
    for(var n = 0; n < strategies_all.length; n++){
      for(var o = 0; o < tiers.length; o ++){
        percent[m][n][1][o][1] = detail[m][n][o] * 1.0 / total[m][o];

        min[m] = Math.min(min[m], percent[m][n][1][o][1]);
        max[m] = Math.max(max[m], percent[m][n][1][o][1]);

        console.log("Min: " + min[m] + " Max: " + max[m] + " position: " + m  + " "+ n + " " + o);
      }
    }
  }

  console.log(percent);

  x0.domain(strategies[stage]);
  x1.domain(tiers).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([min[stage], max[stage]]);

  console.log("max: " + max);

  var myXAxis = svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  myXAxis.selectAll(".tick text")
      .call(wrap, x0.rangeBand()/3);

  myXAxis.append("text")
      .attr("x", (width) + 30 )
      .attr("y",  8 )
      .attr("dy", ".71em")
      .attr("transform", "rotate(-65)" )            // text label for the x axis
      .style("text-anchor", "end")
      .style("font-size", "12px") 
      .text("Strategy"); 

  svg.append("g")
      .attr("class", "y axis")
      .attr("id", "yAxis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage");

  // add a title
  svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", -15 )
      .attr("text-anchor", "middle")  
      .style("font-size", "18px") 
      //.style("text-decoration", "underline")  
      .text("Openning Strategy Analysis");



  state = svg.selectAll(".state")
      .data(percent[stage])
    .enter().append("g")
      //.attr("class", "g")
      .attr("class", function(d) { return d[0]})
      .attr("transform", function(d) {console.log("strategy: " + d[0]);return "translate(" + x0(d[0]) + ",0)"; });

  bars = state.selectAll("rect")
      .data(function(d) { console.log("rect: " + d[1]); return d[1]; })
    .enter().append("rect")
      .on("mouseover", function(d) {
          
          var parent = this.parentNode;
          var currentStrategy = parent.getAttribute('class');

          showToolTip(stage, currentStrategy, d[0], d[1]);

            //console.log("this: " + this);
          var parent = this.parentNode;
          //console.log("parent: " + parent);
          var currentStrategy = parent.getAttribute('class');

          drawPoints(stage, currentStrategy, d[0]);

      })
      .on("mouseout", function(d) {

          hideToolTip();

      })
      .on("click", function(d){
        // //console.log("this: " + this);
        // var parent = this.parentNode;
        // //console.log("parent: " + parent);
        // var currentStrategy = parent.getAttribute('class');

        // drawPoints(stage, currentStrategy, d[0]);
      })
      .attr("width", x1.rangeBand())
      .attr("class", function(d){return d[0];})
      .attr("x", function(d, i) { console.log("x: " + d[0]); return x1(d[0]);})
      .attr("y", function(d, i) { console.log("y: " + d[1]); return height;})
      .attr("height", function(d, i) { return 0; })
      .style("fill", function(d, i) { return color(d[0]); })
      .transition()
      .duration(1000)
      .attr("y", function(d, i) { console.log("y: " + d[1]); return y(d[1]); })
      .attr("height", function(d, i) { return height - y(d[1]); });

  var legend = svg.selectAll(".legend")
      .data(tiers.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("class", function(d){return d;})
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .on("mouseover", function(d, i){
        changeOpacity(d);    
      })
      .on("mouseout", function(d){
        bars = d3.selectAll("rect")
          .transition()
          .duration(500)
          .style("opacity", 1);  
      });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

function selectVariable()
{
  var e = document.getElementById("winOrLose");
  stage = e.selectedIndex;

  
  d3.selectAll(".dot").remove();
  drawBarChart(stage);
}

function drawBarChart(myStage){

  stage = myStage;

  x0.domain(strategies[stage]);
  x1.domain(tiers).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([min[stage], max[stage]]);

  console.log("max: " + max);

  d3.select("#xAxis").remove();
  d3.select("#yAxis").call(yAxis);

  var myXAxis = svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  myXAxis.selectAll(".tick text")
      .call(wrap, x0.rangeBand()/2.5);

  myXAxis.append("text")
      .attr("x", (width) + 30 )
      .attr("y",  8 )
      .attr("dy", ".71em")
      .attr("transform", "rotate(-65)" )            // text label for the x axis
      .style("text-anchor", "end")
      .style("font-size", "12px") 
      .text("Strategy");  

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .attr("id", "yAxis")
  //     .call(yAxis)
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Percentage");

  state = svg.selectAll(".state").remove();
  bars = svg.selectAll("rect").remove();

  state = svg.selectAll(".state")
      .data(percent[stage])
    .enter().append("g")
      //.attr("class", "g")
      .attr("class", function(d) { return d[0]})
      .attr("transform", function(d) {console.log("strategy: " + d[0]);return "translate(" + x0(d[0]) + ",0)"; });
  

  bars = state.selectAll("rect")
      .data(function(d) { console.log("rect: " + d[1]); return d[1]; })
    .enter().append("rect")
      .on("mouseover", function(d) {
          
          var parent = this.parentNode;
          var currentStrategy = parent.getAttribute('class');

          showToolTip(stage, currentStrategy, d[0], d[1]);

          var parent = this.parentNode;
          //console.log("parent: " + parent);
          var currentStrategy = parent.getAttribute('class');

          drawPoints(stage, currentStrategy, d[0]);
      })
      .on("mouseout", function(d) {

          hideToolTip();
          // tooltip.transition()
          //    .duration(500)
          //    .style("opacity", 0);
      })
      .on("click", function(d){
        // //console.log("this: " + this);
        // var parent = this.parentNode;
        // //console.log("parent: " + parent);
        // var currentStrategy = parent.getAttribute('class');

        // drawPoints(stage, currentStrategy, d[0]);
      })
      .attr("width", x1.rangeBand())
      .attr("class", function(d){return d[0];})
      .attr("x", function(d, i) { console.log("x: " + d[0]); return x1(d[0]);})
      .attr("y", function(d, i) { console.log("y: " + d[1]); return height;})
      .attr("height", function(d, i) { return 0; })
      .style("fill", function(d, i) { return color(d[0]); })
      .transition()
      .duration(1000)
      .attr("y", function(d, i) { console.log("y: " + d[1]); return y(d[1]); })
      .attr("height", function(d, i) { return height - y(d[1]); });


  var legend = svg.selectAll(".legend").remove(); 

  legend = svg.selectAll(".legend")
      .data(tiers.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color)
      .on("mouseover", function(d, i){
        changeOpacity(d);    
      })
      .on("mouseout", function(d){
        bars = d3.selectAll("rect")
          .transition()
          .duration(500)
          .style("opacity", 1);  
      });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

}


function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}


function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function drawPoints(myWin, myStrategy, myTier){

  console.log("drawPoints: " + myWin + " " + myStrategy + " " + myTier);

  var myStrategy_index = strategies_all.indexOf(myStrategy);
  var myTier_index = tiers.indexOf(myTier);
  dots = vis.selectAll(".dot").remove();
  dots = vis.selectAll(".dot")
    .data(coordinate[myWin][myStrategy_index][myTier_index])
    .enter()
  .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d){ console.log("cx: " + xScale(d[0]));return xScale(d[0]);})
    .attr("cy", function(d){ console.log("cy: " + yScale(d[1]));return yScale(d[1]);})
    .attr("r", 3)
    .style("fill", "yellow")
    .style("opacity", 0)
    .transition()
    .duration(500)
    .style("opacity", 1);

}

function showToolTip(myWin, myStrategy, myTier, myPercent){

  var per = d3.format("%");

  tooltip.transition()
         .duration(200)
         .style("opacity", .9);
  tooltip.html(function(){
                  return "Strategy:\t" + myStrategy + "<br />" + "Tier:\t" + myTier + "<br />" + "Percent:\t" + per(myPercent);
                })
         .style("left", (d3.event.pageX + 20) + "px")
         .style("top", (d3.event.pageY - 40) + "px");
}

function changeOpacity(myTier){
  bars = d3.selectAll("rect")
      .transition()
      .duration(500)
      .style("opacity", function(d){

          if(d[0] == myTier || d == myTier)
            return 1;
          else
            return 0.01;
        }); 
}

function hideToolTip(){
  tooltip.transition()
         .duration(500)
         .style("opacity", 0);
}
