// bar chart of hour
function hourBar(data) {
    var hBar = {};
    
    // Title: Hour
    svg7.append("text")
    .attr("x", 0-margin.left)
    .attr("y", titleYPosition)
    .attr("class", "title")
    .style("font-size", titleFontSize)
    .style("font-family", "lucida grande")
    .style("font-weight", "100")
    .style("fill", "white")
    .text("HOUR");
    
    var hourAggr = d3.nest()
    .key(function(d) { return d.hour; })
    .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
    .entries(data);
    
    var x = d3.scale.ordinal()
        .domain(hourAggr.map(function(d) { return d.key; }))
        .rangeBands([0, width7]);
    
    var y = d3.scale.linear()
    .range([height - chartShift -5, 0]);
    
    var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues(x.domain().filter(function(d, i) { return !(i % 2); }))
    .orient("bottom");
    
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickFormat(d3.format("s"));
    
    var color = d3.scale.ordinal()
    .range(["#5bc0de", "#45B29D", "#EFC94C", "#BE77FF"]);
    
    var hMax = d3.max([].concat(hourAggr.map(function (d) {return d.values;})))
    
    y.domain([0, hMax]);
    
    var bar = svg7.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(3," + (height + chartShift-5) + ")")
    .call(xAxis);
    
    bar.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0, " + (-height + chartShift+5) + ")")
    .call(yAxis);
    
    bar.selectAll(".bar")
    .data(hourAggr)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.values); })
    .attr("height", function(d) { return height - chartShift - 5 - y(d.values); })
    .attr("id","hourbar")
    .attr("fill", "#5bc0de");
    
    var timeI = [ { key: "Night", values: [0, 1, 2, 3, 4, 5] },
        { key: "Morning", values: [6, 7, 8, 9, 10, 11] },
        { key: "Afternoon", values: [12, 13, 14, 15, 16, 17] },
        { key: "Evening", values: [18, 19, 20, 21, 22, 23] }
    ];
    
    var timeInterval = svg7.selectAll(".timeInterval")
    .data(timeI).enter()
    
    timeInterval.append("rect")
    .attr("class", "timeInterval")
    .attr("id", function(d) { return d.key; })
    .attr("x", function(d) { return x(d.values[0])+3; })
    .attr("width", x.rangeBand()*6)
    .attr("y", chartShift+20)
    .attr("height", height-chartShift-5)
    .attr("fill", function(d) { return color(d.key);} )
    .attr("click", "none")
    .style("opacity", 0.4)
    .on("mouseover", function(d) {
        d3.select(this)
        .style("fill", "steelblue")
        .style("opacity", 0.6);
    })
    .on("mouseout", function(d) {
        if (d3.select(this).attr("click") !== "on") {
            d3.select(this)
            .style("fill", function(d) { return color(d.key);} )
            .style("opacity", 0.4);
        }})
    .on("click", click);
    
    timeInterval.append("text")
    .style("text-anchor", "middle")
    .attr("x", function(d) { return x(d.values[0]+3)+3; })
    .attr("y", height-chartShift-5)
    .attr("class", "timeIntervalText")
    .attr("id", function(d) { return "t" + d.key; })
    .attr("click", "none")
    .style("font-size", 13)
    .style("font-family", "lucida grande")
    .style("font-weight", "bold")
    .style("fill", "#6C6C6C")
    .text(function(d) { return d.key;} )
    .on("mouseover", function(d) {
        d3.select("#" + d.key)
        .style("fill", "steelblue")
        .style("opacity", 0.6);
    })
    .on("mouseout", function(d) {
        if (d3.select(this).attr("click") !== "on") {
            d3.select("#" + d.key)
            .style("fill", function(d) { return color(d.key);} )
            .style("opacity", 0.4);
        }})
    .on("click", click);
    
    function click(d){
        if (d3.select(this).attr("click") == "none") {
            d3.selectAll(".timeInterval")
            .attr("click", "off");
            d3.select("#"+d.key)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("hour", d.values, data);
        }
        else if (d3.select(this).attr("click") == "off") {
            d3.select("#"+d.key)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("hour", d.values, data);
        }
        else {
            if (selectControl.hour.length == 6) {
                d3.selectAll(".timeInterval")
                .attr("fill", color(d.key))
                .attr("click", "none");
            }
            else {
                d3.select("#"+d.key)
                .attr("fill", color(d.key))
                .attr("click", "off");
            }
            // Update filter & data
            removeFilter("hour", d.values, data);
        }
    }; // end of click
    
    hBar.update = function(data) {
        
        var dummy = [
            {hour: 1, count: 1},
            {hour: 2, count: 1},
            {hour: 3, count: 1},
            {hour: 4, count: 1},
            {hour: 5, count: 1},
            {hour: 6, count: 1},
            {hour: 7, count: 1},
            {hour: 8, count: 1},
            {hour: 9, count: 1},
            {hour: 10, count: 1},
            {hour: 11, count: 1},
            {hour: 12, count: 1},
            {hour: 13, count: 1},
            {hour: 14, count: 1},
            {hour: 15, count: 1},
            {hour: 16, count: 1},
            {hour: 17, count: 1},
            {hour: 18, count: 1},
            {hour: 19, count: 1},
            {hour: 20, count: 1},
            {hour: 21, count: 1},
            {hour: 22, count: 1},
            {hour: 23, count: 1},
            {hour: 0, count: 1}
        ];
        
        dummy.forEach(function(d){
            data.push(d);
        });
        
        var hourAggr = d3.nest()
        .key(function(d) { return d.hour; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
        
        hourAggr.forEach(function(d, i) {
            if (d.key === undefined) {
                if (index > -1) {
                    hourAggr.splice(i, 1);
                }
            }
        })
        
        var hMax = d3.max([].concat(hourAggr.map(function (d) {return d.values;})));
        
        y.domain([0, hMax]);
        
        var bar = svg7.selectAll("#hourbar")
            .data(hourAggr)
            .transition().duration(500)
            .attr("class", "bar")
            .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
            .attr("y", function(d) { return y(d.values); })
            .attr("height", function(d) { return height - chartShift - 5 - y(d.values); })
            .attr("fill", "#5bc0de");
        
        svg7.select(".y.axis")
            .transition().duration(500)
            .call(yAxis);
        
        
    } // end of hBar.update
    
    
    return hBar;
    
} // end of weekdayhourBar