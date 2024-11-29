// bar chart of year
function yearBar(data) {
    var yBar = {};
    
    // Title: Year
    svg4.append("text")
    .attr("x", 0)
    .attr("y", titleYPosition)
    .attr("class", "title")
    .style("font-size", titleFontSize)
    .style("font-family", "lucida grande")
    .style("font-weight", "100")
    .style("fill", "#5bc0de")
    .text("| YEAR");
    
    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width4], .1);
    
    var y = d3.scale.linear()
    .range([height-chartShift-5, 0]);
    
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickFormat(d3.format("s"));
    
    var yearAggr = d3.nest()
    .key(function(d) { return d.year; })
    .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
    .entries(data);
    
    function yearFilter(data) {
        var year = parseInt(data.key);
        return year >= 2013;
    }
    
    yearAggr = yearAggr.filter(yearFilter);
    
    var yMax = d3.max([].concat(yearAggr.map(function (d) {return d.values;})))
    
    x.domain(yearAggr.map(function(d) { return d.key; }));
    y.domain([0, yMax]);
    
    var bar = svg4.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(35," + (height + chartShift-5) + ")")
    .call(xAxis);
    
    bar.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0, " + (-height + chartShift+5) + ")")
    .call(yAxis);
    
    bar.selectAll(".bar")
    .data(yearAggr)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
    .attr("x", function(d) { return x(d.key); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.values); })
    .attr("height", function(d) { return height - chartShift - 5 - y(d.values); })
    .attr("id","yearbar")
    .attr("click", "none")
    .attr("fill", "#5bc0de")
    .on("click", click);
    
    
    function click(d){
        if (d3.select(this).attr("click") == "none") {
            d3.selectAll("#yearbar")
            .attr("fill", "#8cc0de")
            .attr("click", "off");
            d3.select(this)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("year", d.key, data);
        }
        else if (d3.select(this).attr("click") == "off") {
            d3.select(this)
            .attr("fill", "steelblue")
            .attr("click", "on");
            // Update filter & data
            addFilter("year", d.key, data);
        }
        else {
            if (Array.isArray(selectControl.year)) {
                if (selectControl.year.length == 1) {
                    d3.selectAll("#yearbar")
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
                d3.selectAll("#yearbar")
                .attr("fill", "#5bc0de")
                .attr("click", "none");
                
            }
            // Update filter & data
            removeFilter("year", d.key, data);
        }
    } // end of click
    
    yBar.update = function(data) {
        
        var dummy = [
            {year: 2013, count: 1},
            {year: 2014, count: 1},
            {year: 2015, count: 1},
            {year: 2016, count: 1}
        ];
        
        dummy.forEach(function(d){
            data.push(d);
        });
        
        var yearAggr = d3.nest()
        .key(function(d) { return d.year; })
        .rollup(function(d) { return d3.sum(d, function(g) {return g.count; }); })
        .entries(data);
        
        function yearFilter(data) {
            var year = parseInt(data.key);
            return year >= 2013;
        }
        
        yearAggr = yearAggr.filter(yearFilter)
        
        var yMax = d3.max([].concat(yearAggr.map(function (d) {return d.values;})))
        y.domain([0, yMax]);
        
        var bar = svg4.selectAll(".bar")
        .data(yearAggr)
        .transition().duration(500)
        .attr("class", "bar")
        .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
        .attr("y", function(d) { return y(d.values); })
        .attr("height", function(d) { return height - chartShift - 5 - y(d.values); });
        
        svg4.select(".y.axis")
        .transition().duration(500)
        .call(yAxis);
        
        
    } // end of yBar.update
    
    
    return yBar;
    
} // end of yearBar