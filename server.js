// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var interp = require('line-interpolate-points');
var d3 = require('d3');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/chart", function (request, response) {
  
  console.log('query: ', request.query);
  
  var mn = parseInt(request.query.min) || 0;
  var mx = parseInt(request.query.max) || 200;
  
  // default to undefined
  var s = request.query.str || 'undefined';
  
  while (s.length < mx) {
    s += s;
  }
  
  var data = _generate(mn, mx);
  
  // interpolate to the number of chars in the string
  var interpolated = _interpolate(data, s);
  
  // pack the interpolated points with the char as label.
  
  response.send({data: interpolated});
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



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
