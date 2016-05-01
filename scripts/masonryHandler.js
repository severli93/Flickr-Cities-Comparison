function masonryHandler(data, d3Selection, dispatchEventName) {
    var transitions = 0;
    var gridElement = d3Selection.append("div")
        .classed("grid", true);

    var msnry = new Masonry(gridElement.node(), {});

    var gridItem = gridElement.selectAll("div")
        .data(data.photos)
        .enter()
        .append("div")
        .classed("grid-item", true);

    var gridItem2=gridItem.append("img")
        .attr("src", function(d) {
            return d.image_url;
        })
        .attr("larger-src", function(d) {
            var largerImage = d.images.filter(function(x) {
                return x.size == 31;
            });
            return largerImage[0].url;
        })
        .attr("smaller-src", function(d) {
            return d.image_url;
        })
        .attr("style", "opacity: 0;")
        gridItem2
        .transition()
        .delay(function(d, i) {
            return 10 * i;
        })
        .attr("style", "opacity: 1;")
        .each("start", function() {
            transitions++;
        })
        .each("end", function(d,i) {
            if (--transitions === 0) {
                gridElement.node().addEventListener('click', function(event) {
                    var src = d3.select(event.target).attr("src")

                    var Owidth = d3.select(event.target).data()[0].width
                    var Oheight = d3.select(event.target).data()[0].height
                    var Nwidth = 450 //d3.select(event.target).data()[0].height
                    var Nheight = Nwidth / (Owidth / Oheight)

                    event.target.parentElement.classList.add('grid-item--gigante');
                    // console.log("oh,"+event.target.parentElement);

                    d3.select(event.target)
                        .attr("src", function(d) {
                            var imageElement = d3.select(event.target);
                            if (imageElement.attr("larger-src") === imageElement.attr("src")) {
                                event.target.parentElement.classList.remove('grid-item--gigante');
                                return imageElement.attr("smaller-src");
                            }
                            return imageElement.attr("larger-src");
                        })
                        .attr('width', null)
                        .attr('height', null)
                    d3.select(event.target.parentElement)
                        .attr('width', null)
                        .attr('height', null);
                    // trigger layout
                    msnry.layout();
                });
            }
        })
    dispatch.on(dispatchEventName, function(index) {

        gridItem.each(function(_, i) {
            if (i == index) {
                this.classList.add('grid-item--gigante');
                d3.select(this.firstChild)
                    .attr("src", function(d) {
                        var imageElement = d3.select(this);
                        return imageElement.attr("larger-src");
                    })
              // trigger layout
                msnry.layout();
            } else {
                this.classList.remove('grid-item--gigante');
                d3.select(this.firstChild)
                    .attr("src", function(d) {
                        var imageElement = d3.select(this);
                        return imageElement.attr("smaller-src");
                    });
                // trigger layout
                msnry.layout();
            }
        })
    })
}
