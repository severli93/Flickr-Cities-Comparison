/**
 * Created by xingyueli on 4/3/16.
 */
var margin = {t:20,r:50,b:20,l:30}
var width1 = document.getElementById('MapPlot1').clientWidth - margin.r-margin.l,
    height1 = document.getElementById('MapPlot1').clientHeight - margin.t -margin.b;

var width2 = document.getElementById('MapPlot2').clientWidth - margin.r-margin.l,
    height2 = document.getElementById('MapPlot2').clientHeight - margin.t -margin.b;

var width3 = document.getElementById('PhotosB').clientWidth - margin.r-margin.l,
    height3 = document.getElementById('PhotosB').clientHeight - margin.t -margin.b;

var width4 = document.getElementById('PhotosH').clientWidth - margin.r-margin.l,
    height4 = document.getElementById('PhotosH').clientHeight - margin.t -margin.b;

var map1 = d3.select("#MapPlot1")
    .append('svg')
    .attr('width',width1)
    .attr('height',height1)
    .append('g')
    .attr('class','canvas-map1')
    .attr('transform','translate('+(margin.l)*0+','+margin.t+')');

var map2 = d3.select("#MapPlot2")
    .append('svg')
    .attr('width',width2)
    .attr('height',height2)
    .append('g')
    .attr('class','canvas-map1')
    .attr('transform','translate('+(margin.l)+','+margin.t+')');

var tooltip=d3.select('body').append('div')
        .attr('class','tooltip')
        .style('opacity',0);
//TODO: set up a mercator projection, and a d3.geo.path() generator
//Center the projection at the center of Boston
var bostonLngLat = [-71.088066,42.315520]; //from http://itouchmap.com/latlong.html
var hefeiLongLat = [117.330551,31.871727]
//path generator boston
var projection1 = d3.geo.mercator()
    .translate([(width1/2),(height1/2)])
    .center([bostonLngLat[0],bostonLngLat[1]])
    .scale(120000/1.3)

//path generator hefei
var projection2 = d3.geo.mercator()
    .translate([width1/2,height1/2])
    .center([hefeiLongLat[0],hefeiLongLat[1]])
    .scale(20000 /1.2)

//TODO: create a geo path generator
var pathGenerator1 = d3.geo.path().projection(projection1);
var pathGenerator2 = d3.geo.path().projection(projection2);
//
//TODO: create a color scale
//var colorScale=d3.scale.linear().domain([0,34]).range(['white','red']);
//var colorType=["#9030FF",'2FFF22','yellow',"#FF34D6"];
var mapBNodes;
var mapHNodes;
//TODO: create a d3.map() to store the value of airbnb room number per block group
var airbnbRoom = d3.map();
//TODO: import data, parse, and draw

 var q=queue()
    .defer(d3.json,'data/bos_neighborhoods.json')
    .defer(d3.json,'data/hefei.geojson')
    .defer(d3.csv,'data/citiesData.csv')
    q.await(drawInitial)

function drawInitial(error,boston,hefei,cities){
  var obj = drawMaps(map1,map2,boston,hefei,cities,width1,height1,margin)
}

function loadImages(sort) {
  var Key = "hVAGGTZYJn3vPA29Oi1iqBRSquWXXpmG331W20Ql"
  var Secret = "a53Hn3Z461vithBUzVhxVNnMRrTYh6rWYu6cw75n"
  var baseFlickrUrl = "https://api.500px.com/v1/photos/search?format=json&nojsoncallback=1&consumer_key="+ Key //format=json requires a json file

  var url1Name = baseFlickrUrl + "&term=Boston&rpp=150&image_size=2,31&sort="+sort;//&nojsoncallback=1 means return json file
  var url2Name = baseFlickrUrl + "&term=Hefei&rpp=150&image_size=2,31&sort="+sort;;


q  .defer(d3.json,''+url1Name)
q  .defer(d3.json,''+url2Name)
q.await(dataLoaded)
}

var dispatch = d3.dispatch('nodeBSelect','nodeHSelect')

function dataLoaded(err,_,_,_,url1,url2){
console.log(url1);
  masonryHandler(url1, d3.select("#PhotosB"), "nodeBSelect");
  masonryHandler(url2, d3.select("#PhotosH"), "nodeHSelect");
}
