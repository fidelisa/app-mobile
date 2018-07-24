/* eslint-disable angular/window-service */

function circleGaugeDefaultSettings(){
  return {
    minValue: 0,
    maxValue: 100,
    circleThickness: 20,
    circleColor: "#178BCA",
    textVertPosition: 0.8,
    textSize: 1,
    circleFillGap: 0.05,
    textColor: "#045681",
    gaugeColor: "#A4DBf8",
    secondeLine: "",
    riseTime: 1000,
    valueCountUp: true
  };
}

window.loadCircleGauge = function(elementId, value, config) {

    var d3 = window.d3;

    if(config == null) {
      config = circleGaugeDefaultSettings();
    }

    value = Math.min(parseInt(value), parseInt(config.maxValue));

    var gauge = d3.select("#" + elementId);
    //clear svg
    gauge.selectAll('*').remove();

    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    // var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;

    // var secondeLine = config.secondeLine;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Scales for drawing the outer circle.
    var backCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,config.maxValue]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var backCircleArc = d3.svg.arc()
        .startAngle(backCircleX(0))
        .endAngle(backCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius - circleThickness));

    gaugeGroup.append("path")
        .attr("d", backCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');


    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(0)) //value))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius - circleThickness));

    var gauge2 = gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.gaugeColor)
        .attr('transform','translate('+radius+','+radius+')');

    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "circleGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    gaugeGroup.append("text")
        .text(config.secondeLine)
        .attr("class", "circleGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+(textRiseScaleY(config.textVertPosition)+textPixels)+')');

    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.riseTime)
            .tween("text", textTween);

        var arcTween = function(){
            return function(t) {
              return d3.svg.arc()
                .startAngle(gaugeCircleX(0))
                .endAngle(gaugeCircleX(t * value)) //value))
                .outerRadius(gaugeCircleY(radius - 2))
                .innerRadius(gaugeCircleY(radius - circleThickness + 2))();
            }
        };

        gauge2.transition()
            .duration(config.riseTime)
            .attrTween("d", arcTween);
    }

}
