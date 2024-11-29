
// bar chart of weekday
function weekdayBar(data) {
    var wBar = {};
    // Title: Weekday
    svg6.append("text")
    .attr("x", 0-margin.left)
    .attr("y", titleYPosition)
    .attr("class", "title")
    .style("font-size", titleFontSize)
    .style("font-family", "lucida grande")
    .style("font-weight", "100")
    .style("fill", "white")
    .text("DAY OF WEEK");
    
    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width6], .1);
    
    var y = d3.scale.linear()
    .range([height - chartShift -5, 0]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(4)
        .tickFormat(d3.format("s"));
    
    var weekdayAggr = d3.nest()
        .key(function(d) { return d.weekday; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
    
    weekdayAggr.forEach(function(d) {
        d.name = dayOfWeek[d.key];
    })
    
    var wMax = d3.max([].concat(weekdayAggr.map(function (d) {return d.values;})))
    
    x.domain(weekdayAggr.map(function(d) { return d.name; }));
    y.domain([0, wMax]);
    
    var bar = svg6.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height + chartShift-5) + ")")
    .call(xAxis);
    
    bar.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0, " + (-height + chartShift+5) + ")")
    .call(yAxis);
    
    bar.selectAll(".bar")
    .data(weekdayAggr)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
    .attr("x", function(d) { return x(d.name); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.values); })
    .attr("height", function(d) { return height - chartShift - 5 - y(d.values); })
    .attr("id","weekdaybar")
    .attr("click", "none")
    .attr("fill", "#5bc0de")
    .on("click", click);
    
    
    function click(d){
        if (d3.select(this).attr("click") == "none") {
            d3.selectAll("#weekdaybar")
            .attr("fill", "#8cc0de")
            .attr("click", "off");
            d3.select(this)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("weekday", d.key, data);
        }
        else if (d3.select(this).attr("click") == "off") {
            d3.select(this)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("weekday", d.key, data);
        }
        else {
            if (Array.isArray(selectControl.weekday)) {
                if (selectControl.weekday.length == 1) {
                    d3.selectAll("#weekdaybar")
                    .attr("fill", "#5bc0de")
                    .attr("click", "none");
                }
                else {
                    d3.select(this)
                    .attr("fill", "#8cc0de")
                    .attr("click", "off");
                }
            }
            else {
                d3.selectAll("#weekdaybar")
                .attr("fill", "#5bc0de")
                .attr("click", "none");
                
            }
            // Update filter & data
            removeFilter("weekday", d.key, data);
        }                } // end of click
    
    wBar.update = function(data) {
        
        var dummy = [
            {weekday: 1, count: 1},
            {weekday: 2, count: 1},
            {weekday: 3, count: 1},
            {weekday: 4, count: 1},
            {weekday: 5, count: 1},
            {weekday: 6, count: 1},
            {weekday: 7, count: 1}
        ];
        
        dummy.forEach(function(d){
            data.push(d);
        });
        
        var weekdayAggr = d3.nest()
            .key(function(d) { return d.weekday; })
            .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
            .entries(data);
        
        weekdayAggr.forEach(function(d) {
            d.name = dayOfWeek[d.key];
        })
        
        var wMax = d3.max([].concat(weekdayAggr.map(function (d) {return d.values;})))
        
        y.domain([0, wMax]);
        
        var bar = svg6.selectAll(".bar")
            .data(weekdayAggr)
            .transition().duration(500)
            .attr("class", "bar")
            .attr("transform", "translate(0, " + (-height + chartShift+5) + ")")
            .attr("y", function(d) { return y(d.values); })
            .attr("height", function(d) { return height - chartShift - 5 - y(d.values); });
        
        svg6.select(".y.axis")
            .transition().duration(500)
            .call(yAxis);
        
        
    } // end of wBar.update
    
    return wBar;
    
} // end of weekdayBar