/* eslint-disable angular/window-service */

function circleTotalGaugeDefaultSettings(){
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
    riseTime: 1500,
    valueCountUp: true,
    shift: 0.8,
    levelsPoints: [33, 66, 100],
    levelsColors: ["#A4DBf8", "#A4DBAA", "#A4DB22"],
    levelsType: "",
    levelsUpper: true
  };
}

window.loadCircleTotalGauge = function(elementId, value, config) {

    var d3 = window.d3;

    if(config == null) {
      config = circleTotalGaugeDefaultSettings();
    }

    value = Math.min(parseInt(value), parseInt(config.maxValue));

    var gauge = d3.select("#" + elementId);
    //clear svg
    gauge.selectAll('*').remove();

    var levelSize = 10;
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2 - levelSize;
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
    var decal = config.shift;
    var backCircleX  = d3.scale.linear().range([0,2*Math.PI*decal]).domain([0,1]);
    var maxPct = 100;
    var basePct = d3.scale.linear().range([0,maxPct]).domain([0,config.maxValue]);
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI*decal]).domain([0,maxPct]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);
    var rotationX = (Math.PI * decal)

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // var startPoint = 0;
    // var finalDraw;
    function drawLevel(d, color){

      var val = basePct(d);

      // Draw the outer circle.
      var gaugeCircleArc = d3.svg.arc()
          .startAngle(gaugeCircleX(val) - rotationX)
          .endAngle(gaugeCircleX(val - 2) - rotationX)
          .outerRadius(gaugeCircleY(radius + levelSize))
          .innerRadius(gaugeCircleY(radius - circleThickness));

      gaugeGroup.append("path")
          .attr("d", gaugeCircleArc)
          .style("fill", color)
          .attr('transform','translate('+radius+','+radius+')');
    }

    function drawLevels() {
      for (var i = 0; i < config.levelsPoints.length; i++) {
        var point = config.levelsPoints[i];
        var color = config.levelsColors[i];
        drawLevel(point, color);
        // startPoint = point;
      }
    }

    if (!config.levelsUpper) { drawLevels(); }

    // Draw the outer circle.
    var backCircleArc = d3.svg.arc()
        .startAngle(backCircleX(0) - rotationX)
        .endAngle(backCircleX(1) - rotationX)
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius - circleThickness));

    gaugeGroup.append("path")
        .attr("d", backCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0) - rotationX)
        .endAngle(gaugeCircleX(0) - rotationX) //value))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius - circleThickness));

    if ((value * 1) >= (config.maxValue * 1)) {
      config.gaugeColor = config.levelsColors[config.levelsColors.length - 1];
    }

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


    if (config.levelsUpper) { drawLevels(); }

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
                .startAngle(gaugeCircleX(0)- rotationX)
                .endAngle(gaugeCircleX(t * basePct(Math.min(config.maxValue, value)))- rotationX) //value))
                .outerRadius(gaugeCircleY(radius))
                .innerRadius(gaugeCircleY(radius - circleThickness))();
            }
        };

        gauge2.transition()
            .duration(config.riseTime)
            .attrTween("d", arcTween);

    }

}
