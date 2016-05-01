function drawMaps(map1,map2,boston,hefei,cities, width1, height1,margin) {
  loadImages("taken_at");
  // draw maps
  var newCensusFeatures=boston.features;
//1. draw boston outline to show the neighbor blocks' name
console.log(cities);
  var mapB = map1
      .append('g')
      .attr('class','MapBoston')
      .selectAll('.map-block')
      .data(newCensusFeatures)

  var mapBEnter = mapB.enter()
      .append('path')
      .attr('class','map-block')
      .attr('d', pathGenerator1)
      // .style('fill',function(d){return '#dddddd'})
      .style('fill-opacity', 0.7)


  var mapBCenter=map1
      .append('g')
      .attr('class','CenterP')
      mapBCenter
      .append('circle')
      .attr('class','BCenter')
      .attr('r',45)
      .style('fill','rgba(250,0,10,0)')
      .attr('transform','translate('+(width1/2) +','+(height1/2)+')')
      .call(popNodes2)


  //node1
  var fillColor1 = d3.scale.category10();
  var nodes1 = d3.range(150).map(function(i) {return {index: i};});
  var force1 = d3.layout.force()
      .nodes(nodes1)
      .size([(width1+width2), (height1+height2)/2])
      .on("tick", tick1)
      .start();
  function tick1(e){
      // Push different nodes in different directions for clustering.
      var k = e.alpha;
      nodes1.forEach(function(o, i) {
          o.y += .00002*k//2*(i & 2 ? k : -k)//i & 1 ? k : -k;
          o.x += .00002*k//2*(i & 2 ? k : -k)//i & 2 ? k : -k;
      });
      mapBNodes.attr("cx", function(d) {  return .5*(d.x); })
          .attr("cy", function(d) { return .5*(d.y); });
  }
  mapBNodes = map1
      .append('g')
      .attr('class','nodesImage')
      .selectAll('.node1')
      .data(nodes1)

  mapBNodes
      .enter()
      .append('circle').attr('transform','translate('+(-width1/2)*0+','+(height1/2)*0.5+')')
      .attr('class','node1')
      .attr('cx',function(d){return d.x})
      .attr('cy',function(d){return d.y})
      .attr('r',4)
      .style('fill',function(d,i){return fillColor1(i)})
      .call(force1.drag)
      .on('mousedown',function(){d3.event.stopPropagation();})
  mapBNodes
      .call(popNodes)
      .on('mouseover',function(_,i){
        dispatch.nodeBSelect(i)
      })

  map1.style('opacity',1e-6)
      .transition().duration(1000).style('opacity',1);

  function mousedown1() {
      nodes1.forEach(function(o, i) {
          o.x += (Math.random() - .5) * 40;
          o.y += (Math.random() - .5) * 40;
      });
      force1.resume();
  }

//map hefei
  mapH = map2
      .append('g')
      .selectAll('.map-block2')
      .data(hefei.features)

  var mapHEnter = mapH.enter()
      .append('g')
      .attr('class','map-block2')
      .append('path')
      .attr('d', pathGenerator2)
      .attr('transform','translate('+(width1/2)*0 +','+(height1/2) *.2+')')
      // .style('fill',function(d){return '#dddddd'})
      .style('stroke-width','.3px')
      .style('fill-opacity',.7)


  var mapHCenter=map2
      .append('g')
      .attr('class','CenterP')
  mapHCenter
      .append('circle')
      .attr('class','HCenter')
      .attr('r',45)
      .style('fill','rgba(250,0,10,0)')
      .attr('transform','translate('+(width1/2) +','+(height1/2)+')')
      .call(popNodes2)

 //node2
  var fillColor2 = d3.scale.category10();
  var nodes2 = d3.range(150).map(function(i) {return {index: i};});
  var force2 = d3.layout.force()
      .nodes(nodes2)
      .size([(width1+width2), (height1+height2)/2])
      .on("tick", tick2)
      .start();
  function tick2(e){
      //console.log('e',e);
      var k = e.alpha;
      //console.log('k',k);
      nodes2.forEach(function(o, i) {
          o.y += .00002*k;//i & 1 ? k : -k;
          o.x += .00002*k;//i & 2 ? k : -k;
      });
      mapHNodes.attr("cx", function(d) { return .5*(d.x); }).attr("cy", function(d) { return .5*(d.y); });
  }
  mapHNodes = map2
      .append('g')
      .attr('class','nodesImage')
      .selectAll('.node2')
      .data(nodes2)
  mapHNodes
      .enter().append('circle').attr('transform','translate('+(-width1/2)*0+','+(height1/2) *.5+')')
      .attr('class','node2')
      .attr('cx',function(d){return d.x})
      .attr('cy',function(d){return d.y})
      .attr('r',4)
      .style('fill',function(d,i){return fillColor2(i)})
      .call(force2.drag)
      .on('mousedown',function(){d3.event.stopPropagation();})
  mapHNodes
      .call(popNodes)
      .on('mouseover',function(_,i){
        dispatch.nodeHSelect(i)
      })


  map2.style('opacity',1e-6)
      .transition().duration(1000).style('opacity',1);

  d3.select('#MapPlot2')
      .on('mousedown',mousedown2)

  function mousedown2() {
      nodes2.forEach(function(o, i) {
          o.x += (Math.random() - .5) * 40;
          o.y += (Math.random() - .5) * 40;
      });
      force2.resume();}
   return {"mapBNodes":mapBNodes,"mapHNodes":mapHNodes}
}
