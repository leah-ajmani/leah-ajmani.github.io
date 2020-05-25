function plot_local(filepath, title, id) {
  var colorScale =  d3.scaleOrdinal()
    .domain(['New Edits','New Cases','Global Event', 'First Case', 'First Death', 'Lockdown*'])
    .range([ '#f35b69', '#6d9eeb', '#7CB518', '#F3DE2C', '#FBB02D', '#E574C3'] );


  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 0, bottom: 30, left: 50},
      width = 210 - margin.left - margin.right,
      height = 210 - margin.top - margin.bottom;

  //Read the data
  d3.csv(filepath, function(data) {

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function(d) { return d.language;})
      .entries(data);

    // What is the list of groups?
    allKeys = sumstat.map(function(d){return d.key})

    // Add plot title
    d3.select(id)
      .append("g")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 100)
      .attr("y", 0)
      .text(title)
      .style("color", 'white')
      .style("font-size", "30px")
      .style("margin-left", "50px")
      .style("margin-bottom", "50px")

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    var svg = d3.select(id)
      .selectAll("uniqueChart")
      .data(sumstat)
      .enter()
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // define the x scale (horizontal)
    var mindate = new Date(2019,12,31),
        maxdate = new Date(2020,4,20);

    var x = d3.scaleTime()
          .domain([mindate, maxdate])
      .range([ 0, width ]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x).ticks(0));


    //Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0 ]);
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(0));


    // // Draw the cases line
    // svg
    //   .append("path")
    //     .attr("fill", "none")
    //     .attr("stroke", function(d){return colorScale("New Cases")})
    //     .attr("stroke-width", 1.9)
    //     .attr("d", function(d){
    //       return d3.line()
    //         .x(function(d) { return x(+d.x); })
    //         .y(function(d) { return y(+d.y); })
    //         (d.values.filter(function(el) {return el.label == "New Cases"}))
    //     })

    // Draw the edits line
    svg
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){return colorScale("New Edits")})
        .attr("stroke-width", 1.9)
        .attr("d", function(d){
          var mapX = d3.scaleLinear()
                  .domain(d3.extent(d.values, function(d) { return +d.x; }))
                  .range([ 0, width ]);
          var mapY = d3.scaleLinear()
                  .domain([0, d3.max(d.values, function(d) { return +d.y; })])
                  .range([ height, 0 ]);

          var lockdown = d.values.filter(function(el) {return el.label == "Local Event"})

          console.log(mapX(+lockdown[0].x))

          return d3.line()
            .x(function(d) { return mapX(+d.x); })
            .y(function(d) { return mapY(+d.y); })
            (d.values.filter(function(el) {return el.label == "New Edits"}))
        })

        svg
        .append("circle")
        .attr("cx", function(d) {
          var lockdown = d.values.filter(function(el) {return el.label == "Local Event"})[0]

          var mapX = d3.scaleLinear()
                  .domain(d3.extent(d.values, function(d) { return +d.x; }))
                  .range([ 0, width ]);
          return mapX(+lockdown.x) 
        })
        .attr("cy", function(d) { 
          var lockdown = d.values.filter(function(el) {return el.label == "Local Event"})[0]

          var mapY = d3.scaleLinear()
                  .domain([0, d3.max(d.values, function(d) { return +d.y; })])
                  .range([ height, 0 ]);
          return mapY(+lockdown.y) 
        })
        .attr("r", 4)
        .attr("fill", function(d){return colorScale("Lockdown*")})


    // Add titles
    svg
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", -5)
      .attr("x", 0)
      .text(function(d){ return(d.key)})
      .style("fill", 'white')
      .style("font-size", "20px")

    var legend = d3.legendColor()
    .shape("path", d3.symbol().type(d3.symbolCircle).size(300)())
    .shapePadding(70)
    .orient('horizontal')
    .scale(colorScale);

    legend_svg = d3.select(id)
    .append("svg")
    .attr("class", "legend-svg")

    legend_svg
      .append("g")
      .attr("class","legend")
      .attr("transform","translate(190,30)")
      .style("font-size","14px")
      .style("fill", "white")
      .call(legend)
  })
}

function plot(filepath, title, id, dimensions, addLegend) {
  var colorScale =  d3.scaleOrdinal()
  .domain(['New Edits','New Cases','Global Event', 'First Case', 'First Death', 'Lockdown'])
  .range([ '#f35b69', '#6d9eeb', '#7CB518', '#F3DE2C', '#FBB02D', '#E574C3'] );

  // set the dimensions and margins of the graph
  var margin = {top: 30, right: 0, bottom: 30, left: 50},
      width = dimensions[0] - margin.left - margin.right,
      height = dimensions[1] - margin.top - margin.bottom;

  //Read the data
  d3.csv(filepath, function(data) {

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function(d) { return d.language;})
      .entries(data);

    // What is the list of groups?
    allKeys = sumstat.map(function(d){return d.key})

    // Add plot title
    d3.select(id)
      .append("g")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", 100)
      .attr("y", 0)
      .text(title)
      .style("color", 'white')
      .style("font-size", "30px")
      .style("margin-left", "50px")
      .style("margin-bottom", "50px")

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    var svg = d3.select(id)
      .selectAll("uniqueChart")
      .data(sumstat)
      .enter()
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return +d.x; }))
      .range([ 0, width ]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(x).ticks(0));

    //Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.y; })])
      .range([ height, 0 ]);

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(0));

    // Draw the cases line
    svg
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){return colorScale("New Cases")})
        .attr("stroke-width", 1.9)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(+d.x); })
            .y(function(d) { return y(+d.y); })
            (d.values.filter(function(el) {return el.label == "New Cases"}))
        })

    // Draw the edits line
    svg
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){return colorScale("New Edits")})
        .attr("stroke-width", 1.9)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(+d.x); })
            .y(function(d) { return y(+d.y); })
            (d.values.filter(function(el) {return el.label == "New Edits"}))
        })

    // Add global event points
    svg
      .append("g")
      .selectAll("dot")
      .data(function(d){return d.values.filter(function(el) {return el.label == "Global Event"})})
      .enter()
        .append("circle")
        .attr("cx", function(d) { return x(+d.x) } )
        .attr("cy", function(d) { return y(+d.y) } )
        .attr("r", 4)
        .attr("fill", function(d){return colorScale("Global Event")})
        .attr('stroke', "grey")
        .attr('stroke-width', .5)

    // Add first case points
    svg
    .append("g")
    .selectAll("dot")
    .data(function(d){return d.values.filter(function(el) {return el.label == "First Case"})})
    .enter()
      .append("circle")
      .attr("cx", function(d) { return x(+d.x) } )
      .attr("cy", function(d) { return y(+d.y) } )
      .attr("r", 4)
      .attr("fill", function(d){return colorScale("First Case")})

    // Add first death points
    svg
    .append("g")
    .selectAll("dot")
    .data(function(d){return d.values.filter(function(el) {return el.label == "First Death"})})
    .enter()
      .append("circle")
      .attr("cx", function(d) { return x(+d.x) } )
      .attr("cy", function(d) { return y(+d.y) } )
      .attr("r", 4)
      .attr("fill", function(d){return colorScale("First Death")})

    // Add lockdown points
    svg
    .append("g")
    .selectAll("dot")
    .data(function(d){return d.values.filter(function(el) {return el.label == "Lockdown"})})
    .enter()
      .append("circle")
      .attr("cx", function(d) { return x(+d.x) } )
      .attr("cy", function(d) { return y(+d.y) } )
      .attr("r", 4)
      .attr("fill", function(d){return colorScale("Lockdown")})

    // Add titles
    svg
      .append("text")
      .attr("text-anchor", "start")
      .attr("y", -5)
      .attr("x", 0)
      .text(function(d){ return(d.key)})
      .style("fill", 'white')
      .style("font-size", "20px")

    if (addLegend) {
      var legend = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolCircle).size(300)())
        .shapePadding(70)
        .orient('horizontal')
        .scale(colorScale);

        legend_svg = d3.select(id)
        .append("svg")
        .attr("class", "legend-svg")

        legend_svg
          .append("g")
          .attr("class","legend")
          .attr("transform","translate(190,30)")
          .style("font-size","14px")
          .style("fill", "white")
          .call(legend)
    }
  })
}
