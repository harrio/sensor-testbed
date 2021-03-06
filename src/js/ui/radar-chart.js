var d3 = require('d3');
var _ = require('lodash');

exports.RadarChart = {
  draw: function(elem, d, options){
    var cfg = {
     radius: 10,
     w: 700,
     h: 700,
     factor: 0.95,
     factorLegend: 1,
     levels: 5,
     maxValue: 200,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     color: d3.scale.category10(),
     fontSize: 10,
     afterglow: 0
    };
    if('undefined' !== typeof options){
      for(var i in options){
        if('undefined' !== typeof options[i]){
          cfg[i] = options[i];
        }
      }
    }
    //cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
    var allAxis = (d[0].map(function(i, j){return i.axis; }));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    d3.select(elem).select("svg").remove();
    var g = d3.select(elem).append("svg").attr("width", cfg.w).attr("height", cfg.h).append("g");

    var tooltip;
    function getPosition(i, range, factor, func){
      factor = typeof factor !== 'undefined' ? factor : 1;
      return range * (1 - factor * func((i - total / 2) * cfg.radians  / total));
    }
    function getHorizontalPosition(i, range, factor){
      return getPosition(i, range, factor, Math.sin);
    }
    function getVerticalPosition(i, range, factor){
      return getPosition(i, range, factor, Math.cos);
    }
    function dotOpacity(series) {
      var opacity = (series + 1) * 1 / d.length;
      return opacity;
    }

    for(var j=0; j<cfg.levels; j++){
      var levelFactor = radius*((j+1)/cfg.levels);
      g.selectAll(".levels").data(allAxis).enter().append("svg:line")
       .attr("x1", function(d, i){return getHorizontalPosition(i, levelFactor);})
       .attr("y1", function(d, i){return getVerticalPosition(i, levelFactor);})
       .attr("x2", function(d, i){return getHorizontalPosition(i+1, levelFactor);})
       .attr("y2", function(d, i){return getVerticalPosition(i+1, levelFactor);})
       .attr("class", "line").style("stroke", "grey").style("stroke-width", "0.5px").attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    series = 0;

    var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr("class", "axis");

    var strokeColor = function(axis, i) {
      var lastData = _.last(d)[i];
      var heading = lastData ? lastData.heading : null;
      if (heading == "sweep") {
        return "red";
      } else if (heading == "main") {
        return "orange";
      } else {
        return "grey";
      }
    };

    var strokeWidth = function(axis, i) {
      var lastData = _.last(d)[i];
      var heading = lastData ? lastData.heading : null;
      if (heading == "sweep") {
        return "3px";
      } else {
        return "1px";
      }
    };

    axis.append("line")
        .attr("x1", cfg.w/2)
        .attr("y1", cfg.h/2)
        .attr("x2", function(j, i){return getHorizontalPosition(i, cfg.w/2, cfg.factor);})
        .attr("y2", function(j, i){return getVerticalPosition(i, cfg.h/2, cfg.factor);})
        .attr("class", "line").style("stroke", strokeColor).style("stroke-width", strokeWidth);

    axis.append("text").attr("class", "legend")
        .text(function(d){return d;})
        .style("stroke", "grey")
        .style("font-family", "sans-serif").style("font-size", cfg.fontSize + "px")
        .style("text-anchor", function(d, i){
          var p = getHorizontalPosition(i, 0.5);
          return (p < 0.4) ? "start" : ((p > 0.6) ? "end" : "middle");
        })
        .attr("transform", function(d, i){
          var p = getVerticalPosition(i, cfg.h / 2);
          return p < cfg.fontSize ? "translate(0, " + (cfg.fontSize - p) + ")" : "";
        })
        .attr("x", function(d, i){return getHorizontalPosition(i, cfg.w / 2, cfg.factorLegend);})
        .attr("y", function(d, i){return getVerticalPosition(i, cfg.h / 2, cfg.factorLegend);});

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
        .data(y, function(j, i){
          dataValues.push([
            getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor),
            getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor)
          ]);
        });
      dataValues.push(dataValues[0]);
      //g.selectAll(".area")
                     g.data([dataValues])
                     .enter()
                     .append("polygon")
                     .attr("class", "radar-chart-serie"+series)
                     .style("stroke-width", "2px")
                     .style("stroke", cfg.color(series))
                     .attr("points",function(d) {
                         var str="";
                         for(var pti=0;pti<d.length;pti++){
                             str=str+d[pti][0]+","+d[pti][1]+" ";
                         }
                         return str;
                      })
                     .style("fill", function(j, i){return cfg.color(series);})
                     .style("fill-opacity", cfg.opacityArea)
                     .on('mouseover', function (d){
                                        z = "polygon."+d3.select(this).attr("class");
                                        g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
                                        g.selectAll(z).transition(200).style("fill-opacity", 0.7);
                                      })
                     .on('mouseout', function(){
                                        g.selectAll("polygon").transition(200).style("fill-opacity", cfg.opacityArea);
                     });
      series++;
    });
    series=0;


    d.forEach(function(y, x){
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle").attr("class", "radar-chart-serie"+series)
        .attr('r', cfg.radius)
        .attr("alt", function(j){return Math.max(j.value, 0);})
        .attr("cx", function(j, i){
          dataValues.push([
            getHorizontalPosition(i, cfg.w/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor),
            getVerticalPosition(i, cfg.h/2, (parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor)
          ]);
          return getHorizontalPosition(i, cfg.w/2, (Math.max(j.value, 0)/cfg.maxValue)*cfg.factor);
        })
        .attr("cy", function(j, i){
          return getVerticalPosition(i, cfg.h/2, (Math.max(j.value, 0)/cfg.maxValue)*cfg.factor);
        })
        .attr("data-elem", function(j){return j.axis;})
        .style("fill", "orange").style("fill-opacity", dotOpacity(series))
        //.style("fill", cfg.color(series)).style("fill-opacity", series * 0.1)
        .on('mouseover', function (d){
                    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
                    newY =  parseFloat(d3.select(this).attr('cy')) - 5;
                    tooltip.attr('x', newX).attr('y', newY).text(d.value).transition(200).style('opacity', 1).style("stroke", "orange");
                    z = "polygon."+d3.select(this).attr("class");
                    g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
                    g.selectAll(z).transition(200).style("fill-opacity", 0.7);
                  })
        .on('mouseout', function(){
                    tooltip.transition(200).style('opacity', 0);
                    g.selectAll("polygon").transition(200).style("fill-opacity", cfg.opacityArea);
                  })
        .append("svg:title")
        .text(function(j){return Math.max(j.value, 0);});

      series++;
    });
    //Tooltip
    tooltip = g.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', '13px')
    .style("stroke", "orange");
  }
};
