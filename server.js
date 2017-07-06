// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var interp = require('line-interpolate-points');
var d3n = require('d3-node');
var d3 = require('d3');
var svg2png = require('svg2png');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/chart", function (request, response) {
  // TODO: add the function selection support
  
  
  var mn = parseInt(request.query.min) || 0;
  var mx = parseInt(request.query.max) || 200;
  
  // supported mimes: application/json, image/png, image/svg+xml
  //             for: data              png        d3 svg
  var mime = request.query.mime || 'image/svg+xml';
  
  // default to undefined
  var s = request.query.str || 'undefined';
  
  while (s.length < mx) {
    s += s;
  }
  
  var data = _generate(mn, mx);
  
  // interpolate to the number of chars in the string
  var interpolated = _interpolate(data, s);
  
  response.setHeader('Content-Type', mime);
  if (mime == 'application/json') {
    response.send({data: interpolated});
  } else if (mime == 'image/png') {
    _chart(interpolated);
    
    // convert the svg to a png
    
  } else {
    // send the "raw" svg
    response.send(_chart(interpolated));
  }
});

function _generate(mn, mx, fxn=Math.sin) {
  return d3.range(mn, mx).map((i) => [i, fxn(i)]);
}

function _interpolate(data, str) {
  // interpolate for number of chars in string
  // < the number of generated points
  var interpolated = interp(data, str.length);
  
  var d = [];
  for (var i=0; i < interpolated.length; i++) {
    d.push({
      x: interpolated[i][0],
      y: interpolated[i][1],
      label: str[i]
    });
  }
  return d;
}

function _chart(data) {
  // generate the chart svg
  // THIS IS MIXING D3 and D3-NODE for not
  // great reasons other than speed
  var margin = {top: 30, right: 20, bottom: 30, left: 50};
  var width = 700 - margin.left - margin.right;
  var height = 270 - margin.top - margin.bottom;
  var padding = 5;

  var xScale = d3.scaleLinear().range([0, width]);
  var yScale = d3.scaleLinear().range([height, 0]);
  
  xScale.domain(d3.extent(data, function(d) {return d.x}));
  yScale.domain(d3.extent(data, function(d) {return d.y}));
  
  var node = new d3n();
  
  var svg = node.createSVG(width + margin.left + margin.right, height + margin.top + margin.bottom);
  
  svg.selectAll('text')
      .data(data)
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
  
  return node.svgString();
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
