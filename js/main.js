/*
*    main.js
*    Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

var margin = { left:100, right:10, top:10, bottom:150 };
var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var flag = true;
var t = d3.transition().duration(750)

// create canvas
var canvas = d3.select("#chart-area")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height",  height +margin.top +margin.bottom)

// create groupe 
var g = canvas.append("g")
              .attr("transform", "translate("+margin.left+","+margin.top+")")




 
// append x axis to groupe
var xAxisGroup = g.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0,"+height+")")


// append y axis to groupe
var yAxisGroup = g.append("g")
.attr("class", "y axis")
 

// x axis label
g.append("text")
.attr("class", "yxaxis-label")
.attr("x", width/2)
.attr("y", height+50 )
.attr("font-size", 20+"px")
.attr("text-anchor", "middle")
.text("Month")

// Y axis label
var yLabel= g.append("text")
     .attr("class", "y axis-label")
     .attr("x", -height/2)
     .attr("y", -50 )
     .attr("text-anchor", "middle")
     .attr("font-size", 20+"px")
     .attr("transform", "rotate(-90)")
     




d3.json("data/revenues.json").then(
    data => {
        data.forEach( d=> {
          d.revenue = +d.revenue;
          d.profit = +d.profit;
          
        });
     console.log(data)
    d3.interval(function() {
         var newData = flag ? data : data.slice(1); 
        update(newData);
        flag=!flag;
    }, 1000);

    update(data);


function update(data) {

   
    var value = flag ? "revenue" : "profit";
    var colorRect = flag ? "grey" : "blue";

        // x scale 
        var xScale = d3.scaleBand()
                        .domain(data.map(d=>{return d.month}))
                        .range([0, width])
                        .paddingInner(0.3)
                        .paddingOuter(0.3);
        // y scale
        var yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, d => {return d[value];})])
                        .range([height, 0]);



        // x axis
        var bottom_axis = d3.axisBottom(xScale);
        xAxisGroup.transition(t).call(bottom_axis);
        // y axis
        var left_axis = d3.axisLeft(yScale).tickFormat(d => {return "$"+d ;});   
        yAxisGroup.transition(t).call(left_axis);





            // bars charts
            // JOIN new data with old elements.
            var rects = g.selectAll("rect")
            .data(data, d=> {return d.month;});

            //console.log(rects);
            
            // EXIT old elements not present in new data
            rects.exit()
            .attr("fill", "red")
            .transition(t)
            .attr("y", 0)
            .attr("height", 0)
            .remove();
            
           

                // ENTER new elements present in new data
                rects.enter()
                .append("rect")
                .attr("x", (d)=>{return xScale(d.month);})
                .attr("width", xScale.bandwidth)
                .attr("fill", "grey")
                .attr("y", 0)
                .attr("height", 0)
                .attr("fill-opacity", 0)
                // AND UPDATE old elements present in new data
                .merge(rects)
                .transition(t)
                            .attr("x", (d)=>{return xScale(d.month);})
                            .attr("width", xScale.bandwidth)
                            .attr("y",d=>{return yScale(d[value]);})
                            .attr("height", (d)=>{ return  height- yScale(d[value]);})
                            .attr("fill-opacity", 1);



            var label = flag ? "Revenue" : "Profit";
                        yLabel.text(label);
               

    }
    

    }
)
.catch( error => {console.log(error); }
);