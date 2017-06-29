// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

// import * as d3 from "d3";
// var d3 = require("d3");

$(function() {
  
  $.get('/chart', {max: 25}, function(points) {
    // list[dict{x, y, label}]
    console.log(points);
    
    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var width = 700 - margin.left - margin.right;
    var height = 270 - margin.top - margin.bottom;
    var padding = 5;

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLinear().range([height, 0]);
    
    xScale.domain(d3.extent(points.data, function(d) {return d.x}));
    yScale.domain(d3.extent(points.data, function(d) {return d.y}));
    
    var valueline = d3.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });
    
    var svg = d3.select('body')
      .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // if you want to see the connector line
    // svg.append("path")
    //   .data([points.data])
    //   .attr("class", "line")
    //   .attr("d", valueline);
    
    svg.selectAll('text')
      .data(points.data)
      .enter()
      .append('text')
      .text(function(d) {
        return d.label;
      })
      .attr("x", function(d) {
          return xScale(d.x);  // Returns scaled location of x
      })
      .attr("y", function(d) {
          return yScale(d.y);  // Returns scaled circle y
      })
      .attr("font_family", "sans-serif")  // Font type
      .attr("font-size", "11px")  // Font size
      .attr("fill", "darkgreen");   // Font color
    
    
    var x_axis = d3.axisBottom(xScale);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(x_axis);

    svg.append("g")
      .call(d3.axisLeft(yScale));
    
    // bin the tick labels
    svg.select('g').call(x_axis).selectAll("text").remove();
    
  });

});
