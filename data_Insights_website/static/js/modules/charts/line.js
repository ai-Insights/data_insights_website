/*
    #TODO: Implement supports for ecParams.ecParams
    #TODO: Interpolating polynamials not scaling well, Investigate.
*/
var interpolation = require("../charts/interpolation");


var line = function(xAxis, yAxis, lines, chartTitle = 'line chart') {
    _lines = [];
    var magicType = {};
    var formatter;
    var x_type = [{
        'type': 'category',
        'data': xAxis
    }];
    if (typeof xAxis[0] === "number") {
        x_type = [{
            'type': 'value',
            scale: true,
        }];
    }
    var series = [];
    var i = 0;
    if (x_type[0].type === 'category') {
        for (i = 0; i < lines.length; ++i) {
            var serie = {
                'name': lines[i],
                'type': 'line',
                'data': yAxis[i],
                'itemStyle': {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
            }
            series.push(serie);
        }
        _lines = lines;
        formatter = {
            trigger: 'axis'
        };
        magicType = {
            show: true,
            type: ['line', 'bar']
        }
    }
    if (x_type[0].type === 'value') {
        for (i = 0; i < lines.length; ++i) {
            var serie = {
                'name': lines[i],
                'type': 'line',
                'data': [],
                'markPoint': {
                    symbol: 'emptyCircle',
                    symbolSize: 3,
                    data: [],
                }
            };
            for (var j = 0; j < xAxis.length; ++j) {
                serie.data.push([xAxis[j], yAxis[i][j]]);
                var point = {
                    'name': 'p' + j,
                    'xAxis': xAxis[j],
                    'yAxis': yAxis[i][j]
                };
                serie.markPoint.data.push(point);
            }
            series.push(serie);
            _lines.push(lines[i]);
            if (xAxis.length < 25) {
                interp = interpolation.lagrange(xAxis, yAxis[i]);
                var interp_serie = {
                    'name': 'lagrange ' + lines[i],
                    'type': 'line',
                    'data': [],
                };
                interp_serie.markPoint = serie.markPoint;
                for (var k = 0; k < interp._xAxis.length; ++k) {
                    interp_serie.data.push([interp._xAxis[k], interp._yAxis[k]])
                }
                series.push(interp_serie);
                _lines.push('lagrange ' + lines[i]);


                interp_newton = interpolation.newton(xAxis, yAxis[i]);
                var interp_newton_serie = {
                    'name': 'newton ' + lines[i],
                    'type': 'line',
                    'data': [],
                };
                interp_newton_serie.markPoint = serie.markPoint;
                for (var k = 0; k < interp_newton._xAxis.length; ++k) {
                    interp_newton_serie.data.push([interp_newton._xAxis[k], interp_newton._yAxis[k]])
                }
                series.push(interp_newton_serie);
                _lines.push('newton ' + lines[i]);
            }
            formatter = {
                formatter: function(params) {
                    result = params.seriesName + ': ' + params.name + '<br>';
                    result += ('  xAxis :' + params.data.xAxis + '<br>' +
                        '  yAxis :' + params.data.yAxis);
                    return result;
                }
            }

        }
    }
    var options = {
        title: {
            text: chartTitle,
        },
        legend: {
            data: _lines
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        tooltip: formatter,
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                magicType: magicType,
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        xAxis: x_type,
        yAxis: [{
            type: 'value',
            scale: true,
        }],
        series: series,
    }

    return options;
}

module.exports = {
    chart: line,
}