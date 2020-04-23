function draw(data,annee,element){

  var titre = element.append("h2").text("Modalités de l'année "+annee);

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 3000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.ordinal()
    .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

var svg = element.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  var categoriesNames = data.map(function(d) { return d.categorie; });
  var rateNames = data[0].values.map(function(d) { return d.Indicateur; });

  x0.domain(categoriesNames);
  x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([d3.min(data, function(categorie) { return d3.min(categorie.values, function(d) { return d['valeur_'+annee]; }); }), d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d['valeur_'+annee]; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("valeur_2005");

  svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  var slice = svg.selectAll(".slice")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

  slice.selectAll("rect")
      .data(function(d) { return d.values; })
  .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.Indicateur); })
      .style("fill", function(d) { return color(d.Indicateur) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .on("mouseover", function(d) {    
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html(d.Indicateur + "<br/>"  + d['valeur_'+annee])  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d['valeur_'+annee]); })
      .attr("height", function(d) { return height - y(d['valeur_'+annee]); });

  //Legend
  var legend = svg.selectAll(".legend")
      .data(data[0].values.map(function(d) { return d.Indicateur; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}