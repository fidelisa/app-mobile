/* eslint-disable angular/window-service */
/* eslint-disable angular/definedundefined */

function convertToRgb(color) {
  if (color.indexOf('rgba') != -1) {
    var textc = color.replace(/rgba\(/g, "").replace(/\)/g, "");
    var tab = textc.split(",");
    tab.splice(-1,1);
    return 'rgb('+tab.join(',')+')';
  } else {
    return color;
  }
}


function defaultLoadDotText() {
    return {
        color: '',
        bgColor: '#FFFFFF',
        height: 40,
        width: 40,
        textSize: 1
    }
}

window.loadDotText = function(elementId, value, config ) {

    var d3 = window.d3;

    if (!config) {
      config = defaultLoadDotText();
    }

    var gauge = d3.select(elementId);
    gauge.selectAll('*').remove();

    var radius = Math.min(config.width, config.height)/2;
    var locationX = config.width/2 - radius;
    var locationY = config.height/2 - radius;

    var textPixels = (config.textSize*radius/2);
    var textFont = config.fontFamily;

    var textRiseScaleY = d3.scale.linear()
        .range([radius*2,(textPixels*0.7)])
        .domain([0,1]);

    // Scales for drawing the outer circle.
    var backCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);


    if (config.color === undefined || config.color === "") {
        var hsl = d3.hsl(convertToRgb(config.bgColor));
        if (hsl.l > 50 ) {
          hsl.l = 0;
        } else {
          hsl.l = 100;
        }
        config.color = hsl.toString() ;
    }

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var backCircleArc = d3.svg.arc()
        .startAngle(backCircleX(0))
        .endAngle(backCircleX(1))
        .outerRadius(radius)
        .innerRadius(0);

    gaugeGroup.append("path")
        .attr("d", backCircleArc)
        .style("fill", config.bgColor)
        .attr('transform','translate('+radius+','+radius+')');

    gaugeGroup.append("text")
        .text(value)
        .attr("class", "dotText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .attr("font-family", textFont)
        .style("fill", config.color)
        .attr('transform','translate('+radius+','+textRiseScaleY(0.52)+')');

}
