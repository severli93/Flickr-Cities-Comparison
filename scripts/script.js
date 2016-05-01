/**
 * Created by xingyueli on 4/3/16.
 */
var margin = {
    t: 20,
    r: 50,
    b: 20,
    l: 50
}
var width1 = document.getElementById('MapPlot1').parentElement.clientWidth - margin.r,
    height1 = d3.select(".MapPlots").node().clientHeight - margin.t - margin.b;

var width2 = document.getElementById('MapPlot2').parentElement.clientWidth - margin.r,
    height2 = d3.select(".MapPlots").node().clientHeight - margin.t - margin.b;

var width3 = d3.select(".Charts").node().clientWidth - margin.r,
    height3 = (d3.select(".Charts").node().clientHeight) / 3 - margin.t - margin.b;

var map1 = d3.select("#MapPlot1")
    .append('svg')
    .attr('width', width1)
    .attr('height', height1)
    .append('g')
    .attr('class', 'canvas-map1')
    .attr('transform', 'translate(' + (margin.l) * (0) + ',' + margin.t + ')');

var map2 = d3.select("#MapPlot2")
    .append('svg')
    .attr('width', width2)
    .attr('height', height2)
    .append('g')
    .attr('class', 'canvas-map1')
    .attr('transform', 'translate(' + (margin.l) * 0 + ',' + margin.t + ')');

d3.select('.tipB')
    .attr("style", function(d) {
        return "top: " + (height1 - parseInt(d3.select(this).style("height"), 10)) + "px; " +
            "left:" + (width1 - parseInt(d3.select(this).style("width"), 10)) + "px";
    });
d3.select('.tipH')
    .attr("style", function(d) {
        return "top: " + (height1 - parseInt(d3.select(this).style("height"), 10)) + "px; ";
    });

//TODO: set up a mercator projection, and a d3.geo.path() generator
//Center the projection at the center of Boston
var bostonLngLat = [-71.088066, 42.315520]; //from http://itouchmap.com/latlong.html
var hefeiLongLat = [117.330551, 31.871727]
    //path generator boston
var projection1 = d3.geo.mercator()
    .translate([(width1 / 2), (height1 / 2)])
    .center([bostonLngLat[0], bostonLngLat[1]])
    .scale(120000 / 1.3)

//path generator hefei
var projection2 = d3.geo.mercator()
    .translate([width1 / 2, height1 / 2])
    .center([hefeiLongLat[0], hefeiLongLat[1]])
    .scale(20000 / 1.2)

//TODO: create a geo path generator
var pathGenerator1 = d3.geo.path().projection(projection1);
var pathGenerator2 = d3.geo.path().projection(projection2);
//
//TODO: create a color scale
var mapBNodes;
var mapHNodes;
//TODO: create a d3.map() to store the value of airbnb room number per block group
var airbnbRoom = d3.map();
//TODO: import data, parse, and draw


var q = queue()
    .defer(d3.json, 'data/bos_neighborhoods.json')
    .defer(d3.json, 'data/hefei.geojson')
    .defer(d3.csv, 'data/citiesData.csv')
q.await(drawInitial)

function drawInitial(error, boston, hefei, cities) {
    var obj = drawMaps(map1, map2, boston, hefei, cities, width1, height1, margin)
    drawCharts(cities, height3, width3, d3.select("#Chart1"), "area");
    drawCharts(cities, height3, width3, d3.select("#Chart2"), "pop");
    drawCharts(cities, height3, width3, d3.select("#Chart3"), "gdp");
}

function drawCharts(data, height, width, div, yParam) {
var title;
  if(yParam=="area"){ title="Area/Km²"}
  if(yParam=="pop"){ title="Population"}
  if(yParam=="gdp"){ title="GDP/Billion $"}
    var MaxValue = d3.max(data, function(d) {
        return +d[yParam];
    })
    var chart1 = div
        .append('svg')
        .attr('width', width+margin.l+margin.r)
        .attr('height', height+margin.t+margin.b)
        .append('g')
        .attr("transform", "translate(15, 0)")
        .attr('class', 'bar-chart1');
    var scalex = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.name; }))
        .rangePoints([0, width], 1);
    var axisX = d3.svg.axis()
        .scale(scalex)
        .orient("bottom");
    // chart1.append("g")
    //     .attr("transform", "translate("+10+", "+(height+margin.t)+")")
    //     .call(axisX);
    var scaley = d3.scale.linear()
        .domain([0, MaxValue])
        .range([height-margin.t, margin.t]);
    var bar1 = chart1.append("g")
      .attr('class', 'bar')
      .attr('transform', 'translate(' + (margin.l) * (.1) + ',' + margin.t + ')')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('g')
      .attr('class', function(d) {  return d.name.toLowerCase()})

    bar1
      .append('rect')
      .attr('x', function(d) {  return scalex(d.name)})
      .attr('width', 15)
      .attr('height', 0)
      .attr('y', height)
      .style('opacity',0)
      .transition()
      .duration(1500)
      .attr('height', function(d) {  return height - scaley(d[yParam])})
      .attr('y', function(d) {return scaley(d[yParam])})
      .style('opacity',1)
    bar1
      .append('text')
      .text(function(d){return d[yParam]})
      .attr('x',function(d){ return scalex(d.name)+7.5})
      .attr('y',function(d){ return scaley(d[yParam])})
      .attr('text-anchor','middle')
      .attr("transform", "translate("+0+", "+(-margin.t)*.3+")")
      .style('opacity',0)
      .transition()
      .duration(2000)
      .style('opacity',1)

    bar1
    .append('text')
    .text(title)
    .attr('fill','rgb(50,50,50)')
    .attr('x',width/2)
    .attr('text-anchor','middle')
    .attr("transform", "translate("+0+", "+(height+margin.t)+")")
    .style('font-style','italic')

}
    function loadImages(sort) {
        var Key = "hVAGGTZYJn3vPA29Oi1iqBRSquWXXpmG331W20Ql"
        var Secret = "a53Hn3Z461vithBUzVhxVNnMRrTYh6rWYu6cw75n"
        var baseFlickrUrl = "https://api.500px.com/v1/photos/search?format=json&nojsoncallback=1&consumer_key=" + Key //format=json requires a json file
        var url1Name = baseFlickrUrl + "&term=Boston&rpp=150&image_size=2,31&sort=" + sort; //&nojsoncallback=1 means return json file
        var url2Name = baseFlickrUrl + "&term=Hefei&rpp=150&image_size=2,31&sort=" + sort;;


        q.defer(d3.json, '' + url1Name)
        q.defer(d3.json, '' + url2Name)
        q.await(dataLoaded)
    }

    var dispatch = d3.dispatch('nodeBSelect', 'nodeHSelect')

    function dataLoaded(err, _, _, _, url1, url2) {
        masonryHandler(url1, d3.select("#PhotosB"), "nodeBSelect");
        masonryHandler(url2, d3.select("#PhotosH"), "nodeHSelect");
    }
