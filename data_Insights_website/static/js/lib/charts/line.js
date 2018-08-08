/*
    #TODO: Implement supports for     #TODO: Interpolating polynamials not scaling well, Investigate.
*/
var interpolation = require("../charts/interpolation");


var line = function(xAxis, yAxis, lines, chartTitle = 'line chart') {
    _lines = [];

    selected = {};
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
                'smooth': true,
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
        for ( var i = 0; i < lines.length; ++i) {
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
            var gy = -Infinity;
            for (var j = 0; j < xAxis.length; ++j) {
                serie.data.push([xAxis[j], yAxis[i][j]]);
                var point = {
                    'name': 'p' + j,
                    'xAxis': xAxis[j],
                    'yAxis': yAxis[i][j]
                };

                gy = (yAxis[i][j] > gy ) ? yAxis[i][j]: gy;
                serie.markPoint.data.push(point);
            }
            serie.data = serie.data.sort(function(a, b) { return a[0] - b[0]; });



            selected[lines[i]] = i < 2;
            series.push(serie);
            _lines.push(lines[i]);


            var is_sorted = xAxis.every((val, i, arr) => !i || (val >= arr[i - 1]));
            var _x = []; var _y = [];
            if ( is_sorted === false ) {

                for (var z = 0; z < serie.data.length; ++z) {
                    _x.push(serie.data[z][0]);
                    _y.push(serie.data[z][1]);
                }
            } else {
                _x = xAxis;
                _y = yAxis[i];
            }
            if ( xAxis.length < 500 ) {
                data_spline = interpolation.cubic_spline(_x, _y);

                data_spline =  data_spline.sort(function(a, b) { return a[0] - b[0];});
                console.log(data_spline);
                spline_serie = {
                    'name': lines[i] + ' cubic spline ',
                    'type': 'line',
                    'smooth': true,
                    'data': data_spline,
                };
                series.push(spline_serie);
                _lines.push(lines[i] + ' cubic spline ');
            }

            // Regression 
            serieIBestLineFit = interpolation.Regressions(xAxis,yAxis[i]);
            best_fit_line = []
            var _xAxis = interpolation.gen_xAxis(_x);
            for ( var k = 0; k < _xAxis.length; ++k) {
                best_fit_line.push([_xAxis[k], _xAxis[k] * serieIBestLineFit.m + serieIBestLineFit.b])
            }
            best_fit_expr = 'Best Fit line\ny = ' + serieIBestLineFit.m.toFixed(3)+'*x + ' + serieIBestLineFit.b.toFixed(3) + '\n' + 'Correlation coefficient: ' + serieIBestLineFit.r.toFixed(3);
            bestFit = {
                'name': lines[i] + ' best fit line ',
                'type': 'line',
                'smooth': true,
                'data': best_fit_line,
                'markPoint': {
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        }
                    },
                    label: {
                        normal: {
                            borderWidth: 1,
                            borderRadius: 3,
                            padding: [5, 5, 6, 7],
                            show: true,
                            position: 'left',
                            formatter: best_fit_expr,
                            textStyle: {
                                color: '#fff',
                                backgroundColor: 'rgba(46,46,46,0.9)',
                                fontSize: 14,
                                margin: 5
                            }
                        }
                    },
                    data: [{
                        coord: [serieIBestLineFit.gx, gy]
                    }]
                }
            };

            best_fit_name = lines[i] + ' best fit line ';
            series.push(serie);
            _lines.push(best_fit_name);
            selected[best_fit_name] = false;
            series.push(bestFit);

            if (isNaN(serieIBestLineFit.A) !== true &&  isNaN(serieIBestLineFit.R) != true) {
                best_fit_exp = [];
                for ( var k = 0; k < _xAxis.length; ++k) {
                    best_fit_exp.push([_xAxis[k], Math.pow(serieIBestLineFit.R,  _xAxis[k]) * serieIBestLineFit.A])
                }
                best_fit_expr = 'Best Fit exponential\ny = ' + serieIBestLineFit.A.toFixed(3)+'* (' + serieIBestLineFit.R.toFixed(3) + '^x)';
                bestFitExponetial = {
                    'name': lines[i] + ' best fit exponential',
                    'type': 'line',
                    'smooth': true,
                    'data': best_fit_exp,
                    'markPoint': {
                        itemStyle: {
                            normal: {
                                color: 'transparent'
                            }
                        },
                        label: {
                            normal: {
                                borderWidth: 1,
                                borderRadius: 3,
                                padding: [5, 5, 6, 7],
                                show: true,
                                position: 'left',
                                formatter: best_fit_expr,
                                textStyle: {
                                    color: '#fff',
                                    backgroundColor: 'rgba(46,46,46,0.9)',
                                    fontSize: 14,
                                    margin: 5
                                }
                            }
                        },
                        data: [{
                            coord: [serieIBestLineFit.gx, serieIBestLineFit.A*Math.pow(serieIBestLineFit.R, serieIBestLineFit.gx)]
                        }]
                    }
                } 

                best_fit_exp = lines[i] + ' best fit exponential';
                _lines.push(best_fit_exp);
                series.push(bestFitExponetial);
                selected[best_fit_exp] = false;
            }

            // best fit quadratic
            best_fit_quadratic = []
            for ( var k = 0; k < _xAxis.length; ++k) {
                var x  = _xAxis[k];
                best_fit_quadratic.push([x, serieIBestLineFit.quadratic_coeffs[0][0]*Math.pow(x, 2) + serieIBestLineFit.quadratic_coeffs[1][0]*x + serieIBestLineFit.quadratic_coeffs[2][0]] )
            }
            best_fit_expr = 'Best Fit quadratic\ny = (' + serieIBestLineFit.quadratic_coeffs[0][0].toFixed(3) + ')*x^2 + (' + serieIBestLineFit.quadratic_coeffs[1][0].toFixed(3)+')*x + (' + serieIBestLineFit.quadratic_coeffs[2][0].toFixed(3) + ')';
            
            bestFitQuadratic = {
                'name': lines[i] + ' best fit quadratic',
                'type': 'line',
                'smooth': true,
                'data': best_fit_quadratic,
                'markPoint': {
                    itemStyle: {
                        normal: {
                            color: 'transparent'
                        }
                    },
                    label: {
                        normal: {
                            borderWidth: 1,
                            borderRadius: 3,
                            padding: [5, 5, 6, 7],
                            show: true,
                            position: 'left',
                            formatter: best_fit_expr,
                            textStyle: {
                                color: '#fff',
                                backgroundColor: 'rgba(46,46,46,0.9)',
                                fontSize: 14,
                                margin: 5
                            }
                        }
                    },
                    data: [{
                        coord: [serieIBestLineFit.gx, serieIBestLineFit.quadratic_coeffs[0][0]*Math.pow(serieIBestLineFit.gx, 2) + serieIBestLineFit.quadratic_coeffs[1][0]*serieIBestLineFit.gx + serieIBestLineFit.quadratic_coeffs[2][0]]
                    }]
                }
            };

            best_fit_name = lines[i] + ' best fit quadratic';
            series.push(serie);
            _lines.push(best_fit_name);
            series.push(bestFitQuadratic);
            selected[best_fit_name] = false;

            /*
            if (xAxis.length < 15) {
                var push_chart = true;
                interp = interpolation.lagrange(xAxis, yAxis[i]);
                var interp_serie = {
                    'name': 'lagrange ' + lines[i],
                    'type': 'line',
                };
                var interp_data = [];
                for (var k = 0; k < interp._xAxis.length; ++k) {
                    if ( isNaN(interp._yAxis[k]) ===  true || Math.abs(interp._yAxis) === +Infinity) {
                        push_chart = false;
                    }
                    interp_data.push([interp._xAxis[k], interp._yAxis[k]])
                }
                if (push_chart === true ) {
                    interp_serie['data'] = interp_data;
                    series.push(interp_serie);
                    _lines.push('lagrange ' + lines[i]);
                }

                interp_newton = interpolation.newton(xAxis, yAxis[i]);
                push_chart = true;
                var interp_newton_serie = {
                    'name': 'newton ' + lines[i],
                    'type': 'line',
                    'data': [],
                };
                interp_newton_serie.markPoint = serie.markPoint;
                for (var k = 0; k < interp_newton._xAxis.length; ++k) {
                    if ( isNaN(interp._yAxis[k]) ===  true || Math.abs(interp._yAxis) === +Infinity) {
                        push_chart = false;
                    }
                    interp_newton_serie.data.push([interp_newton._xAxis[k], interp_newton._yAxis[k]])
                }
                if ( push_chart === true ) {
                    series.push(interp_newton_serie);
                    _lines.push('newton ' + lines[i]);
                }
            }*/
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
            type: 'scroll',
            right: 150,
            left: 100,
            top: 5,
            bottom: 100,
            data: _lines,
            selected: selected
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },tooltip: {
            trigger: 'axis',
            axisPointer: {
                show: true,
                type: 'cross',
                lineStyle: {
                    type: 'dashed',
                    width: 1
                }
            }
        },
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