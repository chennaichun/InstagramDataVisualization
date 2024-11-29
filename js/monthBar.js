// bar chart of month
function monthBar(data) {
    var mBar = {};
    
    // Title: Month
    svg5.append("text")
    .attr("x", 0-margin.left)
    .attr("y", titleYPosition)
    .attr("class", "title")
    .style("font-size", titleFontSize)
    .style("font-family", "lucida grande")
    .style("font-weight", "100")
    .style("fill", "#5bc0de")
    .text("| MONTH");
    
    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width5], .1);
    
    var y = d3.scale.linear()
    .range([height - chartShift - 5, 0]);
    
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickFormat(d3.format("s"));
    
    var monthAggr = d3.nest()
    .key(function(d) { return d.month; })
    .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
    .entries(data);
    
    var mMax = d3.max([].concat(monthAggr.map(function (d) {return d.values;})))
    
    x.domain(monthAggr.map(function(d) { return d.key; }));
    y.domain([0, mMax]);
    
    var bar = svg5.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height + chartShift -5) + ")")
    .call(xAxis);
    
    bar.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0, " + (- height +chartShift +5) + ")")
    .call(yAxis);
    
    bar.selectAll(".bar")
    .data(monthAggr)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("transform", "translate(0, " + (- height +chartShift + 5) + ")")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.values); })
    .attr("height", function(d) { return height - chartShift - 5 - y(d.values); })
    .attr("id","monthbar")
    .attr("fill", "#5bc0de")
    .attr("click", "none")
    .on("click", click);
    
    
    function click(d){
        if (d3.select(this).attr("click") == "none") {
            d3.selectAll("#monthbar")
            .attr("fill", "#8cc0de")
            .attr("click", "off");
            d3.select(this)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("month", d.key, data);
        }
        else if (d3.select(this).attr("click") == "off") {
            d3.select(this)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("month", d.key, data);
        }
        else {
            if (Array.isArray(selectControl.month)) {
                if (selectControl.month.length == 1) {
                    d3.selectAll("#monthbar")
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
                d3.selectAll("#monthbar")
                .attr("fill", "#5bc0de")
                .attr("click", "none");
                
            }
            // Update filter & data
            removeFilter("month", d.key, data);
        }
    } // end of click
    
    mBar.update = function(data) {
        
        var dummy = [
            {month: 1, count: 1},
            {month: 2, count: 1},
            {month: 3, count: 1},
            {month: 4, count: 1},
            {month: 5, count: 1},
            {month: 6, count: 1},
            {month: 7, count: 1},
            {month: 8, count: 1},
            {month: 9, count: 1},
            {month: 10, count: 1},
            {month: 11, count: 1},
            {month: 12, count: 1}
        ]
        
        dummy.forEach(function(d){
            data.push(d);
        });
        
        var monthAggr = d3.nest()
        .key(function(d) { return d.month; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
        
        var mMax = d3.max([].concat(monthAggr.map(function (d) {return d.values;})))
        y.domain([0, mMax]);
        
        var bar = svg5.selectAll(".bar")
        .data(monthAggr)
        .transition().duration(500)
        .attr("class", "bar")
        .attr("transform", "translate(0, " + (- height + chartShift + 5) + ")")
        .attr("y", function(d) { return y(d.values); })
        .attr("height", function(d) { return height - chartShift - 5 - y(d.values); });
        
        svg5.select(".y.axis")
        .transition().duration(500)
        .call(yAxis);
        
        
    } // end of mBar.update
    
    
    return mBar;
    
} // end of monthBar