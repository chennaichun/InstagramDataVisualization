function eventImage(data) {
    var eImg = {};
    
    var eventAggr = d3.nest()
        .key(function(d) { return d.event; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
    
    var total = d3.sum([].concat(eventAggr.map(function(d) { return d.values; })))
    
    eventAggr.forEach(function(d, i) {
        if (d.key == "Regular days only") {
            if (i > -1) {
                eventAggr.splice(i, 1);
            }
        }
        else{
            d.selector = d.key.replace(/ /g , "").substring(0, 9);
        }
    });

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height0], .1)
        .domain(eventAggr.map(function(d) { return d.key; }));

    if (eventAggr[1].key === "Speed Skiing World Championship") {
        eventAggr[1].selector = "SpeedS";
    }
    
    /* Title: Events */
    imgsvg.append("text")
        .attr("x", 0)
        .attr("y", titleYPosition)
        .attr("class", "title")
        .style("font-size", titleFontSize)
        .style("font-family", "lucida grande")
        .style("font-weight", "100")
        .style("fill", "white")
        .text(" EVENT");

    var canvas = imgsvg
        .selectAll(".bar")
        .data(eventAggr)
        .enter();
    
    var defs = canvas.append("defs").attr("id", "imgdefs");
    
    var imgpattern = defs.append("pattern")
        .attr("id", function(d) {return d.selector;})
        .attr("height", 1)
        .attr("width", 1)
        .attr("x", "0")
        .attr("y", "0");
    
    imgpattern.append("image")
        .attr("x", -100)
        .attr("y", -300)
        .attr("height", 640)
        .attr("width", 480)
        .attr("xlink:href", function(d) {return d.key+".jpg"; });

    
    canvas.append("rect")
        .attr("x", 0)
        .attr("width", 240)
        .attr("y", function(d,i) {return 27*(i-1)+58;})
        .attr("height",  25)
        .attr("fill", function(d) {return "url(#"+d.selector+")";})
        .attr("id", function(d) {return "img"+d.selector+"";})
        .attr("class", "imgrect")
        .style("opacity", 0.5)
        .attr("click", "off")
        .on("mouseover", function(d) {
            d3.select(this)
            .style("opacity", 1);
            d3.select("#t" +d.selector)
            .style("opacity", 1);
        })
        .on("mouseout", function(d) {
            if (d3.select(this).attr("click") == "off") {
                d3.select(this)
                .style("opacity", 0.5);
                d3.select("#t" +d.selector)
                .style("opacity", 0);
            };
        })
        .on("click", click);
    
    
    canvas.append("text")
        .attr("x", 0)
        .attr("y", function(d,i) {return 27*(i-1)+75;})
        .attr("class", "eventname")
        .attr("id", function(d) { return "t"+d.selector; })
        .style("font-size", 13)
        .style("font-family", "lucida grande")
        .style("fill", "white")
        .style("opacity", 0)
        .attr("click", "off")
        .text(function(d) { return d.key; })
        .on("mouseover", function(d) {
            d3.select(this)
            .style("opacity", 1);
            d3.select("#img"+d.selector)
            .style("opacity", 1);
        })
        .on("mouseout", function(d) {
            if (d3.select(this).attr("click") == "off") {
                d3.select(this)
                .style("opacity", 0);
                d3.select("#img"+d.selector)
                .style("opacity", 0.5);
            };
        })
        .on("click", click);
    
    function click(d){
        
        $('#event_info').empty();
         
        if (d3.select(this).attr("click") == "off") {

            var galleryContainer = $("<div>");
            galleryContainer.attr('id', 'imagesContainer');
            galleryContainer.appendTo("#event_info");

            var numImages = 1;
            var specialArray = ["Alpine Skiing European Cup Finals", 
                "Freeride Junior World Championship",
                "La vuelta ciclista a España"];

            if (specialArray.indexOf(d.key) != -1) {
                numImages = 5;
            }

            for (var i = 0; i < numImages; i++) {
                var imageDiv = $("<div>");
                imageDiv.attr('data-src', 'event_images/' + d.key +  '/' + i + '.jpg')
                    .attr('class', 'image_item');

                imageDiv.appendTo(galleryContainer);

                var eventImage =  $('<img>');
                eventImage.attr({
                    'src' : 'event_images/' + d.key +  '/' + i + '.jpg',
                    'height' : 140
                });
                imageDiv.append(eventImage);

                if (i > 0) {
                    imageDiv.hide();
                }
            }

            galleryContainer.lightGallery({
                selector : '.image_item'
            });

            d3.selectAll(".imgrect")
                .attr("opacity", 0.5)
                .attr("click", "off");
            d3.selectAll(".eventname")
                .attr("opacity", 0)
                .attr("click", "off");
            d3.select("#img"+d.selector)
                .attr("opacity", 1)
                .attr("click", "on");
            d3.select("#t"+d.selector)
                .attr("opacity", 1)
                .attr("click", "on");
            
            svg5.append("rect")
                .attr("class", "protect")
                .attr("width", width5)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", chartShift)
                .attr("fill", "#fff")
                .style("opacity", 0);
            
            svg6.append("rect")
                .attr("class", "protect")
                .attr("width", width6)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", chartShift)
                .attr("fill", "#fff")
                .style("opacity", 0);
            
            svg7.append("rect")
                .attr("class", "protect")
                .attr("width", width7)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", chartShift)
                .attr("fill", "#fff")
                .style("opacity", 0);
            
            
            // call update function
            replaceFilter("event", d.key, data);
        } // if off
        else {
            d3.select("#img"+d.selector)
                .attr("opacity", 0.5)
                .attr("click", "off");
            d3.select("#t"+d.selector)
                .attr("opacity", 0)
                .attr("click", "off");
            
            d3.selectAll(".protect")
                .remove();
            
            removeFilter("event", d.key, data);
        }
    } // end of click
    
    
    return eImg;
} // end of eventImage