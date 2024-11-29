
function langPie(data) {
    var lPie = {};
    
    // Title: Language
    piesvg
    .append("text")
    .attr("x", 0)
    .attr("y", titleYPosition+30)
    .attr("class", "title")
    .style("font-size", titleFontSize)
    .style("font-family", "lucida grande")
    .style("font-weight", "100")
    .style("fill", "white")
    .attr("transform", "translate(" + (-margin.left-90) + "," + (-margin.top-90) + ")")
    .text(" LANGUAGE");
    
    var langAggr0 = d3.nest()
    .key(function(d) { return d.language; })
    .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
    .entries(data);
    
    var lSum = d3.sum([].concat(langAggr0.map(function (d) {return d.values;})));
    var others = { key: "Others", values: 0}, langAggr = [];
    
    langAggr0.forEach(function(d) {
        if (d.values/lSum < 0.03) {
            others.values += d.values;
        } else{
            langAggr.push(d);
        };
    });
    
    langAggr.push(others);
    
    var color = d3.scale.ordinal()
    .range(["#5bc0de", "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "DB74A6"]);
    
    var radius = 75;
    
    var arc0 = d3.svg.arc()
    .outerRadius(2)
    .innerRadius(0);
    
    var arc = d3.svg.arc()
    .outerRadius(radius-2)
    .innerRadius(0);
    
    var arc2 = d3.svg.arc()
    .outerRadius(radius+3)
    .innerRadius(0);
    
    var labelArc = d3.svg.arc()
    .outerRadius(radius - 18)
    .innerRadius(radius - 16);
    
    var enterAntiClockwise = {
        startAngle: Math.PI * 2,
        endAngle: Math.PI * 2
    };
    
    var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.values; });
    
    var hpie = piesvg.selectAll(".arc")
    .data(pie(langAggr))
    .enter().append("g")
    .attr("class", "arc");
    
    var path = hpie.append("path")
    .attr("d", arc)
    .attr("click", "off")
    .attr("class", "pie")
    .attr("id", function(d) { return d.data.key; })
    .style("fill", function(d) { return color(d.data.key); })
    .on("mouseover", function(d) {
        d3.select(this)
        .attr("d", arc2);
        })
    .on("mouseout", function(d) {
        if (d3.select(this).attr("click") !== "on") {
            d3.select(this)
            .attr("d", arc);
        }
    })
    .on("click", click);
    
    var text = hpie.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".45em")
    .attr("click", "off")
    .attr("id", function(d) { return "t"+d.data.key; })
    .text(function(d) { if (d.data.key == "Others")
        {return d.data.key;}
        else { return d.data.key.toUpperCase();}; })
    .on("mouseover", function(d) {
        d3.select("#" + d.data.key)
        .attr("d", arc2);
    })
    .on("mouseout", function(d) {
        if (d3.select(this).attr("click") !== "on") {
            d3.select("#" + d.data.key)
            .attr("d", arc);
        }
    })
    .on("click", click);
    
    function click(d) {
        if (d.data.key !== "Others") {
        if (d3.select(this).attr("click") == "off") {
            d3.selectAll(".pie")
            .attr("d", arc);
            d3.select("#" + d.data.key)
            .attr("d", arc2)
            .attr("click", "on");
            d3.select("#t" + d.data.key)
            .attr("click", "on");
            
            replaceFilter("language", d.data.key, data);
        }
        else {
            d3.select("#" + d.data.key)
            .attr("d", arc)
            .attr("click", "off");
            d3.select("#t" + d.data.key)
            .attr("click", "off");
            
            removeFilter("language", d.data.key, data);
        }
        }
    } // end of click
    
    lPie.update = function(data) {
        
        var langAggr0 = d3.nest()
        .key(function(d) { return d.language; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
        
        var lSum = d3.sum([].concat(langAggr0.map(function (d) {return d.values;})));
        var others = { key: "Others", values: 0}, langAggr = [];
        
        langAggr0.forEach(function(d) {
            if (d.values/lSum < 0.03) {
                others.values += d.values;
            } else if (d.key == "undefined") {
                others.values += d.values;
            }else{
                langAggr.push(d);
            };
        });
        
        langAggr.push(others);
        
        var color = d3.scale.ordinal()
        .range(["#5bc0de", "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "DB74A6"]);
        
        var labelArc = d3.svg.arc()
        .outerRadius(radius - 18)
        .innerRadius(radius - 16);
        
        svg0.selectAll(".arc")
        .remove();
        
        var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.values; });
        
        var hpie = piesvg.selectAll(".arc")
        .data(pie(langAggr))
        .enter().append("g")
        .attr("class", "arc");
        
        
        var path = hpie.append("path")
        .attr("d", arc0)
        
        path
        .transition()
        .duration(300)
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.key); });
        
        var text = hpie.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".45em")
        .attr("fill", "black")
        .attr("click", "off")
        .attr("id", function(d) { return "t"+d.data.key; })
        .text(function(d) { if (d.data.key == "Others")
            {return d.data.key;}
            else { return d.data.key.toUpperCase();}; })
        .on("mouseover", function(d) {
            d3.select("#" + d.data.key)
            .attr("d", arc2);
        })
        .on("mouseout", function(d) {
            if (d3.select(this).attr("click") !== "on") {
                d3.select("#" + d.data.key)
                .attr("d", arc);
            }
        })
        .on("click", click);
        
        path
        .attr("click", "off")
        .attr("class", "pie")
        .attr("id", function(d) { return d.data.key; })
        .on("mouseover", function(d) {
            d3.select(this)
            .attr("d", arc2);
        })
        .on("mouseout", function(d) {
            if (d3.select(this).attr("click") !== "on") {
                d3.select("#" + d.data.key)
                .attr("d", arc);
            }
        })
        .on("click", click)
        
    } // end of lPie.update
    
    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }
    // Interpolate exiting arcs start and end angles to Math.PI * 2
    // so that they 'exit' at the end of the data
    function arcTweenOut(a) {
        var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
        this._current = i(0);
        return function (t) {
            return arc(i(t));
        };
    }
    
    return lPie;
} // end of langPie