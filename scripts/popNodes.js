function popNodes(selection){
// console.log("selection",selection);
  selection
  .on('mouseenter',function(d){
    d3.select(this)
    .transition()
    .duration(800)
    .style('r',function(d,i){

      return 20;
    })
    .style('opacity',.8)
  })

  .on('mouseleave',function(d){
    //   console.log(this)
    d3.select(this)
    .transition()
    .duration(500)
    .style('r',function(d,i) {
      return 4;
    })
    .style('opacity',1)
  })
}

function popNodes2(selection){
// console.log("selection",selection);
  selection
  .on('mouseenter',function(d){
    d3.select(this)
    .transition()
    .duration(800)
    .style('r',function(d,i){

      return 30;
    })
    .style('opacity',.8)
  })

  .on('mouseleave',function(d){
    //   console.log(this)
    d3.select(this)
    .transition()
    .duration(500)
    .style('r',function(d,i) {
      return 15;
    })
    .style('opacity',1)
  })
}
