/* eslint-disable angular/window-service */

function pileGaugeDefaultSettings() {
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

window.loadPileGauge = function (elementId, value, config) {

    var d3 = window.d3;

    if (config == null) {
        config = pileGaugeDefaultSettings();
    }

    value = Math.min(parseInt(value), parseInt(config.maxValue));
    var gauge = d3.select("#" + elementId);
    //clear svg
    gauge.selectAll('*').remove();

    var width = parseInt(gauge.style("width"));
    var height = parseInt(gauge.style("height"));
    console.log(width, height);

    var levelMarginY = 28;
    var levelMarginX = 8;
    var levelWidth = width - (levelMarginX * 2);
    var levelHeight = height / 2 - (levelMarginY * 2);
    var basePct = d3.scale.linear().range([0, 100]).domain([0, config.maxValue]);


    // gauge.append("rect").attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width", width)
    //     .attr("height", height)
    //     .style("fill", "#888888");

    var gaugeGroup = gauge.append("g");

    // Draw every steps
    for (var i = config.levelsPoints.length; i >= 0; i--) {
        var point = parseInt(config.levelsPoints[i]);
        var color = config.levelsColors[i];
        var point2 = 0;
        if (i != 0) {
            point2 = parseInt(config.levelsPoints[i - 1]);
        }
        console.log(point, point2, (point2 + ((point - point2) / 2)));
        var val = basePct(point);
        var val2 = basePct(point2 + ((point - point2) / 2));

        gaugeGroup.append("rect").attr("x", levelMarginX)
            .attr("y", levelMarginY)
            .attr("width", levelWidth * val / 100)
            .attr("height", levelHeight)
            .style("fill", color);

        var textX = levelMarginX + levelWidth * val2 / 100,
            textY = (levelHeight / 2 + levelMarginY + 9);

        var hsl = d3.hsl(color);
        if (hsl.l > 50 ) {
            hsl.l = 0;
        } else {
            hsl.l = 100;
        }
        var textColor = hsl.toString() ;

        gaugeGroup.append("text")
            .text(point)
            .attr("class", "circleGaugeText")
            .attr("font-size", "18px")
            .attr("text-anchor", "middle")
            .style("fill", textColor)
            .attr('transform', 'translate(' + textX + ',' + textY + ')');
    }

    var r = 10,
        cx = levelMarginX,
        cy = levelMarginY + levelHeight + r - 2,
        sin30 = Math.pow(3, 1 / 2) / 2,
        cos30 = .5;

    var gaugeGroup2 = gauge.append("g");

    gaugeGroup2.append('polygon')
        .attr('fill', config.circleColor)
        .attr('points', (cx) + ',' + (cy - r) + ' ' +
            (cx - r * sin30) + ',' + (cy + r * cos30) + ' ' +
            (cx + r * sin30) + ',' + (cy + r * cos30));

    cy = levelMarginY - r + 2;
    gaugeGroup2.append('polygon')
        .attr('fill', config.circleColor)
        .attr('points', (cx) + ',' + (cy + r) + ' ' +
            (cx - r * sin30) + ',' + (cy - r * cos30) + ' ' +
            (cx + r * sin30) + ',' + (cy - r * cos30));

    var markSize = 2;
    gaugeGroup2.append("rect").attr("x", cx - (markSize / 2))
        .attr("y", levelMarginY - markSize)
        .attr("width", markSize)
        .attr("height", levelHeight + markSize)
        .style("fill", config.circleColor);


    var textPixels = (config.textSize * height / 2 / 2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
    var percentText = config.displayPercent ? "%" : "";

    var textRounder = function (value) {
        return Math.round(value);
    };

    var textTop = (height / 2) + textPixels;

    var gaugeText = gaugeGroup.append("g");
    gaugeText.attr('transform', 'translate(0, ' + textTop + ')')

    var text1 = gaugeText.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "circleGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform', 'translate(' + width / 2 + ', 0 )');

        gaugeText.append("text")
        .text(config.secondeLine)
        .attr("class", "circleGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform', 'translate(' + width / 2 + ',' + textPixels + ')');


    if (config.valueCountUp) {
        var textTween = function () {
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function (t) {
                this.textContent = textRounder(i(t)) + percentText;
            }
        };
        text1.transition()
            .duration(config.riseTime)
            .tween("text", textTween);

        var newVal = levelWidth * basePct(Math.min(config.maxValue, value)) / 100;
        gaugeGroup2.transition()
            .duration(config.riseTime)
            .attr('transform', 'translate(' + newVal + ', 0)');

    }

}