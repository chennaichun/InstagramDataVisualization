// function: wordCloud
// draw word cloud
function wordCloud(data) {
    var wCloud = {};
    
    // title: Word Cloud
    svg3.append("text")
        .attr("x", 20)
        .attr("y", titleYPosition)
        .attr("class", "title")
        .style("font-size", titleFontSize)
        .style("font-family", "lucida grande")
        .style("font-weight", "100")
        .style("fill", "white")
        .text(" TOPICS OF IMAGES & TEXTS");
    
    var descString0 = "", descString1 = "";
    function initialLangFilter(d) {
        return d.language == 'en';
    }
    data.filter(initialLangFilter)
        .forEach(function(d) {
            descString0 += d.text + " ";
            descString1 += d.tag + " ";
    });
    
    var descArray0 = descString0.split(" ");
    var descArray1 = descString1.split(" ");
    
    var descObjects0 = [], descObjects1 = [];
    
    descArray0.forEach(function(d) {
        var descObject = {}
        descObject.description = d;
        descObjects0.push(descObject);
    });

    descArray1.forEach(function(d) {
        var descObject = {}
        descObject.description = d;
        descObjects1.push(descObject);
    });
    
    var wordCount0 = d3.nest()
        .key(function(d) { return d.description; })
        .rollup(function(v) { return v.length; })
        .entries(descObjects0);

    var wordCount1 = d3.nest()
        .key(function(d) { return d.description; })
        .rollup(function(v) { return v.length; })
        .entries(descObjects1);
    
    wordCount0.sort(function(a,b) {
        return b.values - a.values;
    });
    wordCount1.sort(function(a,b) {
        return b.values - a.values;
    });
    var tags = [];

    wordCount0.forEach(function(d) {
        if (d.key != "") {
            tags.push({text: d.key, size: parseInt(d.values), type: "text"});
        }
    });

    wordCount1.forEach(function(d) {
        if (d.key != "") {
            tags.push({text: d.key, size: parseInt(d.values)*2, type: "tag"});
        }
    });

    tags.sort(function(a,b) {
        return b.size - a.size;
    });
    
    tags = tags.slice(0, 80);

    var wordCountBar = wordCountBar(tags);

    var ex = d3.extent([].concat(tags.map(function (d) {return d.size;} )));

    var sizeScale = d3.scale.log().base(1.0000005).domain(d3.extent([].concat(tags.slice(0, 80).map(function (d) {return d.size;})))).range([10,52]);
    
    var layout = d3.layout.cloud()
        .size([380, 420])
        .words(tags)
        .padding(2)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .text(function(d) { return d.text; })
        .font("lucida grande")
        .fontSize(function(d) { return sizeScale(d.size)-1; })
        .on("end", drawTransition)
        .start()
    
    function drawTransition(words) {
        var fill = d3.scale.linear().domain([0,1]).range(["#7ABAF2","#00305A"]);
        var fillTag = "#DB378E"
        var sizeScale = d3.scale.log().base(1.0000005)
            .domain(d3.extent([].concat(tags.map(function (d) {return d.size;}))))
            .range([9,42]);
        
        var cloud = svg3.append("g")
            .attr("transform", "translate(" + (450 / 2)  + "," + (486 / 2)  + ")")
            .selectAll("g text")
            .data(words)
        
        //Entering words
        cloud.enter()
            .append("text")
            .style("fill", function(d) { 
                if (d.type === "text") {
                    return fill(Math.random());
                }
                else {
                    return fillTag;
                }  })
            .style("font-family", "lucida grande")
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });
        
        //Entering and existing words
        cloud
            .transition()
            .duration(600)
            .style("font-size", function(d) { return sizeScale(d.size)-1 + "px"; })
            .style("font-family", "lucida grande")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .attr("id", "wordcloud")
            .style("fill-opacity", 1);
        
        //Exiting words
        cloud.exit()
            .remove();
    }
    
    // update
    wCloud.update = function(data) {
        
        var descString0 = "", descString1 = "";
        
        data.forEach(function(d) {
            descString0 += d.text + " ";
            descString1 += d.tag + " ";
        });
        
        var descArray0 = descString0.split(" ");
        var descArray1 = descString1.split(" ");
        
        var descObjects0 = [], descObjects1 = [];
        
        descArray0.forEach(function(d) {
            var descObject = {}
            descObject.description = d;
            descObjects0.push(descObject);
        });

        descArray1.forEach(function(d) {
            var descObject = {}
            descObject.description = d;
            descObjects1.push(descObject);
        });
        
        var wordCount0 = d3.nest()
        .key(function(d) { return d.description; })
        .rollup(function(v) { return v.length; })
        .entries(descObjects0);

        var wordCount1 = d3.nest()
        .key(function(d) { return d.description; })
        .rollup(function(v) { return v.length; })
        .entries(descObjects1);
        
        wordCount0.sort(function(a,b) {
            return b.values - a.values;
        });
        wordCount1.sort(function(a,b) {
            return b.values - a.values;
        });
        var tags = [];
        
        wordCount0.forEach(function(d) {
            if (d.key != "") {
                tags.push({text: d.key, size: parseInt(d.values), type: "text"});
            }
        });

        wordCount1.forEach(function(d) {
            if (d.key != "") {
                tags.push({text: d.key, size: parseInt(d.values), type: "tag"});
            }
        });

        tags.sort(function(a,b) {
            return b.size - a.size;
        });
        
        tags = tags.slice(0,80);

        wordCountBar.update(tags);
        
        var sizeScale = d3.scale.log().base(1.0000005)
            .domain(d3.extent([].concat(tags.map(function (d) {return d.size;}))))
            .range([9,42]);
        
        d3.selectAll("#wordcloud")
            .remove();
        
        var layout = d3.layout.cloud().size([380, 420])
            .words(tags)
            .padding(2)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .text(function(d) { return d.text; })
            .font("lucida grande")
            .fontSize(function(d) { return sizeScale(d.size)-1; })
            .on("end", drawTransition)
            .start();
        
        
    } // end of wCloud.update

    // bar chart of word count
    function wordCountBar(tags) {
        var wCountBar = {};
        tags = tags.slice(0, 12);

        // Title: Word Count
        svg8.append("text")
            .attr("x", 0-margin.left)
            .attr("y", titleYPosition)
            .attr("class", "title")
            .style("font-size", titleFontSize)
            .style("font-family", "lucida grande")
            .style("font-weight", "100")
            .style("fill", "white")
            .text("WORD COUNT");
        
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width8], .1);
        
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

        var wMax = d3.max([].concat(tags.map(function (d) {return d.size;}))) 
        x.domain(tags.map(function(d) { return d.text; }));
        y.domain([0, wMax]);
        
        var bar = svg8.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height + chartShift - 5) + ")")
            .call(xAxis);
        
        bar.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
            .call(yAxis);
        
        bar.selectAll(".bar")
            .data(tags)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
            .attr("x", function(d) { return x(d.text); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.size); })
            .attr("height", function(d) { return height - chartShift - 5 - y(d.size); })
            .attr("id","wordcountbar")
            .attr("click", "none")
            .attr("fill", "#5bc0de");
        
        wCountBar.update = function(tags) {
            tags = tags.slice(0, 12);

            svg8.selectAll("*").remove();
            
            // Title: Word Count
            svg8.append("text")
                .attr("x", 0-margin.left)
                .attr("y", titleYPosition)
                .attr("class", "title")
                .style("font-size", titleFontSize)
                .style("font-family", "lucida grande")
                .style("font-weight", "100")
                .style("fill", "white")
                .text("WORD COUNT");
            
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width8], .1);
            
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

            var wMax = d3.max([].concat(tags.map(function (d) {return d.size;}))) 
            x.domain(tags.map(function(d) { return d.text; }));
            y.domain([0, wMax]);
            
            var bar = svg8.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (height + chartShift - 5) + ")")
                .call(xAxis);
            
            bar.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
                .call(yAxis);
            
            bar.selectAll(".bar")
                .data(tags)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("transform", "translate(0, " + (-height + chartShift + 5) + ")")
                .attr("x", function(d) { return x(d.text); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.size); })
                .attr("height", function(d) { return height - chartShift - 5 - y(d.size); })
                .attr("id","wordcountbar")
                .attr("click", "none")
                .attr("fill", "#5bc0de");

        } // end of wCounterBar.update
        
        return wCountBar;
        
    } // end of wCounterBar

    return wCloud;
}; // end of wordCloud
