// draw circles on map
function heatMap1(data, map) {
    var hMap = {};
    
    var locations = [];
    data.forEach(function(d) {
        if (d.latitude !== '-' && d.longitude !== '-') {
            d['LatLng'] = {'lat' : d.latitude, 'lng' : d.longitude};
        }
        d.lid = parseInt(d.lid);
        // needs to be checked
        if (d.lname != undefined) {
            locations[d.lid] = {name: d.lname, LatLng: d.LatLng};
        }
    });
    
    var locAggr = d3.nest()
        .key(function(d) { return d.lid; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
    
    locAggr.forEach(function(d) {
        if (d.values >= 5) {
            if (locations[d.key].LatLng) {
                locations[d.key].count = d.values;
            }
            else {
                delete locations[d.key];
            };
        }
        else {
            delete locations[d.key];
        };
    })
    
    var locs = Object.keys(locations).map(function(key) {
        return {lid: key, name: locations[key].name, LatLng: locations[key].LatLng, count: locations[key].count};
    });
    
    var totalExtent = d3.extent([].concat(locs.map(function (d) {
        return d.count;
    })));

    var div = d3.select("#map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 80);

    var radScale = d3.scale.sqrt().domain(totalExtent).rangeRound([3,30]);

    var overlay  = new google.maps.OverlayView();
    overlay.onAdd = function() {
        layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "markers");
    }

    // console.log(locs);

    var currentMapPoint;
    var markers;
    overlay.draw = function() {
        var projection = this.getProjection(), padding = 10;
        var marker = layer.selectAll("svg")
            .data(locs)
            .each(transform)
            .enter().append("svg:svg")
            .each(transform)
            .attr("class", "marker")
            .attr('width', function(d) {return radScale(d.count)*2})
            .attr('height', function(d) {return radScale(d.count)*2});

        markers = marker;
        // Add a circle.
        marker.append("svg:circle")
            .attr("r", function(d) {return radScale(d.count)})
            .attr("cx", function(d) {return radScale(d.count)})
            .attr("cy", function(d) {return radScale(d.count)})
            .attr("fill", "#5bc0de")
            .attr("class", "circle")
            .attr("click", "off")
            .style("opacity", .6)
            .on("mouseover", function(d) {
                d3.select(this)
                    .attr("fill", "#DB378E");

                div.transition()
                    .duration(300)
                    .style("opacity", .9);

                div.html(d.name + "<br/>"  + d.count)
                    .attr("id", "t" + d.lid)
            })
            .on("mouseout", function(d) {
                if (d3.select(this).attr("click") == "off") {

                    d3.select(this)
                        .attr("fill", "#5bc0de");

                    div.transition()
                        .duration(500)
                        .style("opacity", 0);

                    if (currentMapPoint != null) {
                        div.transition()
                            .duration(300)
                            .style("opacity", .9);

                        div.html(currentMapPoint.name + "<br/>"  + currentMapPoint.count)
                            .attr("id", "t" + currentMapPoint.lid);
                    }
                };
            })
            .on("click", expandNode);

        function transform(d) {
            var radPadding = radScale(d.count);
            d = new google.maps.LatLng(parseFloat(d.LatLng.lat), parseFloat(d.LatLng.lng));
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this)
                .style("left", (d.x - radPadding) + "px")
                .style("top", (d.y - radPadding) + "px");
        }
        // provides node animation for mouseover
        function expandNode(d) {
            if (d3.select(this).attr("click") == "off") {
                d3.selectAll(".circle")
                    .attr("r", function(d) {return radScale(d.count)})
                    .attr("fill", "#5bc0de")
                    .attr("click", "off");

                // div.selectAll(".tooltip")
                //     .style("opacity", 0);

                d3.select(this)
                    .attr("r", function(d) {return radScale(d.count)})
                    .attr("fill", "#DB378E")
                    .attr("click", "on");

                currentMapPoint = d;

                div.html(d.name + "<br/>"  + d.count)
                    .attr("id", "t"+d.lid)
                
                // call update function
                replaceFilter("lid", d.lid, data);

            } else {
                d3.select(this)
                .attr("r", function(d) {return radScale(d.count)})
                .attr("fill", "#5bc0de")
                .attr("click", "off");

                currentMapPoint = null;
                
                removeFilter("lid", d.lid, data);
            };
        };
    };

    // Bind our overlay to the map…
    overlay.setMap(map);

    hMap.removeCurrentMarkers = function() {
        //console.log(markers[0]);
        currentMapPoint = null;
        div.transition()
            .duration(500)
            .style("opacity", 0);
        for (var ind in markers[0]) {
            markers[0][ind].remove();
        }
    }

    return hMap;
} // end of heatMap function


//////////////////// OLD VERSION BELOW //////////////////////


// draw circles on map
function heatMap(data) {
    var hMap = {};
    
    // Title: Heat Map
    svg1.append("text")
    .attr("x", 6)
    .attr("y", titleYPosition+10)
    .attr("class", "title")
    .style("font-size", titleFontSize)
    .style("font-family", "lucida grande")
    .style("font-weight", "100")
    .style("fill", "#ffffff")
    .text("HEATMAP");
    
    var locations = [];
    data.forEach(function(d) {
        if (d.latitude !== '-' && d.longitude !== '-') {
            d['LatLng'] = {'lat' : d.latitude, 'lng' : d.longitude};
        } 
        d.lid = parseInt(d.lid);
        locations[d.lid] = {name: d.lname, LatLng: d.LatLng};
    });
    console.log(locations);
    
    var locAggr = d3.nest()
    .key(function(d) { return d.lid; })
    .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
    .entries(data);
    
    locAggr.forEach(function(d) {
        if (d.values >= 5) {
            if (locations[d.key].LatLng) {
                locations[d.key].count = d.values;
            }
            else {
                delete locations[d.key];
            };}
        else {
            delete locations[d.key];
        };
    })
    
    var locs = Object.keys(locations).map(function(key) {
        return {lid: key, name: locations[key].name, LatLng: locations[key].LatLng, count: locations[key].count};
    });
    
    var totalExtent = d3.extent([].concat(locs.map(function (d) {
        return d.count;
    })));
    var div = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style("opacity",80);
    
    var radScale = d3.scale.sqrt().domain(totalExtent).rangeRound([3,30]);

    var canvas = g.selectAll("circle")
    .data(locs)
    .enter();
    
    var feature = canvas.append("circle")
    .style("opacity", .6)
    .attr("fill", "#5bc0de")
    .attr("r", function(d) {return radScale(d.count)})
    .attr("class", "circle")
    .attr("click", "off")
    .on("mouseover", function(d) {
        d3.select(this)
        .attr("r", function(d) {return radScale(d.count)+5})
        .attr("fill", "#DB378E");
        div.transition()
        .duration(200)
        .style("opacity", .9);
        div.html(d.name + "<br/>"  + d.count)
        .attr("id", "t"+d.lid)
        .style("left", (d.x - 78) + "px")
        .style("top", (d.y - 45) + "px");
    })
    .on("mouseout", function(d) {
        if (d3.select(this).attr("click") == "off") {
            d3.select(this)
            .attr("r", function(d) {return radScale(d.count)})
            .attr("fill", "#5bc0de");
            div.select("#t"+d.lid)
            .transition()
            .duration(500)
            .style("opacity", 0);
        };
    })
    .on("click", click);
    
    //map.on("viewreset", updateMap);
    updateMap();
    
    function updateMap() {
        feature.attr("transform",
            function(d) {
                d.x = map.latLngToLayerPoint(d.LatLng).x;
                d.y = map.latLngToLayerPoint(d.LatLng).y;
                return "translate("+
                map.latLngToLayerPoint(d.LatLng).x +","+
                map.latLngToLayerPoint(d.LatLng).y +")";
            }
        )};
    
    function click(d){  // utility function to be called on mouseover.
        // highlight the circle
        if (d3.select(this).attr("click") == "off") {
            d3.selectAll(".circle")
            .attr("r", function(d) {return radScale(d.count)})
            .attr("fill", "#5bc0de")
            .attr("click", "off");
            div.selectAll(".tooltop")
            .style("opacity", 0);
            d3.select(this)
            .attr("r", function(d) {return radScale(d.count)+5})
            .attr("fill", "#DB378E")
            .attr("click", "on");
            div.html(d.name + "<br/>"  + d.count)
            .attr("id", "t"+d.lid)
            .style("left", (d.x - 78) + "px")
            .style("top", (d.y - 45) + "px");
            
            // call update function
            replaceFilter("lid", d.lid, data);
        }
        else {
            d3.select(this)
            .attr("r", function(d) {return radScale(d.count)})
            .attr("fill", "#5bc0de")
            .attr("click", "off");
            
            removeFilter("lid", d.lid, data);
        };
    } // end of click(d)
    
    return hMap;
} // end of heatMap function


var getCleanLocations = function(data) {
    var locations = [];
    data.forEach(function(d) {
        if (d.latitude !== '-' && d.longitude !== '-') {
            d['LatLng'] = {'lat' : d.latitude, 'lng' : d.longitude};
        }
        d.lid = parseInt(d.lid);
        locations[d.lid] = {name: d.lname, LatLng: d.LatLng};
    });
    
    var locAggr = d3.nest()
        .key(function(d) { return d.lid; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
    
    locAggr.forEach(function(d) {
        if (d.values >= 5) {
            if (locations[d.key].LatLng) {
                locations[d.key].count = d.values;
            }
            else {
                delete locations[d.key];
            };}
        else {
            delete locations[d.key];
        };
    })
    
    var locs = Object.keys(locations).map(function(key) {
        return {lid: key, name: locations[key].name, LatLng: locations[key].LatLng, count: locations[key].count};
    });

    return locs;
}

function heatMap2(data, map) {
    var locations = [];
    data.forEach(function(d) {
        if (d.latitude !== '-' && d.longitude !== '-') {
            d['LatLng'] = {'lat' : d.latitude, 'lng' : d.longitude};
        }
        d.lid = parseInt(d.lid);
        locations[d.lid] = {name: d.lname, LatLng: d.LatLng};
    });
    
    var locAggr = d3.nest()
    .key(function(d) { return d.lid; })
    .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
    .entries(data);
    
    locAggr.forEach(function(d) {
        if (d.values >= 5) {
            if (locations[d.key].LatLng) {
                locations[d.key].count = d.values;
            }
            else {
                delete locations[d.key];
            };}
        else {
            delete locations[d.key];
        };
    })
    
    var locs = Object.keys(locations).map(function(key) {
        return {lid: key, name: locations[key].name, LatLng: locations[key].LatLng, count: locations[key].count};
    });

    var totalExtent = d3.extent([].concat(locs.map(function (d) {
        return d.count;
    })));

    var radScale = d3.scale.sqrt().domain(totalExtent).rangeRound([3,30]);
    console.log(locs);
    locs.forEach(function(d) {
        var circle = new google.maps.Circle({
            strokeOpacity: 0.8,
            strokeWeight: 0,
            fillColor: '#5bc0de',
            fillOpacity: 0.6,
            map: map,
            center: {lat: parseFloat(d.LatLng.lat), lng: parseFloat(d.LatLng.lng)},
            radius: radScale(d.count) * 50
        });

        google.maps.event.addListener(circle, 'mouseover', function(event) {
            this.setOptions({
                fillColor: "#DB378E",
                radius: radScale(d.count) * 50 + 150
            });
        });

        google.maps.event.addListener(circle, 'mouseout', function(event) {
            this.setOptions({
                fillColor: "#5bc0de",
                radius: radScale(d.count) * 50
            });
        });
    });
}