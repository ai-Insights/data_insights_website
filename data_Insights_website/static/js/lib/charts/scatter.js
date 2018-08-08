var interpolation = require("./interpolation");


var scatter = function(ecParams) {
    series = [];
    _series = [];
    selected = {};
    for (var i = 0; i < ecParams.series.length; ++i) {
        _series.push(ecParams.series[i]);
        serie = {
            'name': ecParams.series[i],
            'type': 'scatter',
            'data': [],
        }
        selected[ecParams.series[i]] = i < 1;
        if (typeof ecParams._data_generator[i] !== 'function') {
            var gy = -Infinity;
            for (var j = 0; j < ecParams.xAxis[i].length; ++j) {
                serie.data.push([ecParams.xAxis[i][j], ecParams.yAxis[i][j]]);
                gy = (ecParams.yAxis[i][j] > gy ) ? ecParams.yAxis[i][j]: gy;
            }
            if (ecParams.xAxis[i].length < 100) {
                serie.symbolSize = 10;
            }

            serieIBestLineFit = interpolation.Regressions(ecParams.xAxis[i], ecParams.yAxis[i]);
            best_fit_line = []
            var is_sorted = ecParams.xAxis[i].every((val, i, arr) => !i || (val >= arr[i - 1]));
            var _x = []; var _y = [];
            if ( is_sorted === false ) {
                sorted_data = serie.data.sort(function(a, b) { return a[0] - b[0]});
                for (var z = 0; z < sorted_data.length; ++z) {
                    _x.push(serie.data[z][0]);
                    _y.push(serie.data[z][1]);
                }
            } else {
                _x = ecParams.xAxis[i];
                _y = ecParams.yAxis[i];
            }
            var _xAxis = interpolation.gen_xAxis(_x);
            for ( var k = 0; k < _xAxis.length; ++k) {
                best_fit_line.push([_xAxis[k], _xAxis[k] * serieIBestLineFit.m + serieIBestLineFit.b])
            }
            best_fit_expr = 'Best Fit line\ny = ' + serieIBestLineFit.m.toFixed(3)+'*x + ' + serieIBestLineFit.b.toFixed(3) + '\n' + 'Correlation coefficient: ' + serieIBestLineFit.r.toFixed(3);
            
            best_fit_line.push([serieIBestLineFit.gx + 0.5, serieIBestLineFit.m*(serieIBestLineFit.gx +0.5) + serieIBestLineFit.b]);
            bestFit = {
                'name': ecParams.series[i] + ' best fit line ',
                'type': 'line',
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

            best_fit_name = ecParams.series[i] + ' best fit line ';
            series.push(serie);
            _series.push(best_fit_name);
            selected[best_fit_name] = i < 1;
            series.push(bestFit);

            if (isNaN(serieIBestLineFit.A) !== true &&  isNaN(serieIBestLineFit.R) != true) {
                best_fit_exp = [];
                for ( var k = 0; k < _xAxis.length; ++k) {
                    best_fit_exp.push([_xAxis[k], Math.pow(serieIBestLineFit.R,  _xAxis[k]) * serieIBestLineFit.A])
                }
                best_fit_expr = 'Best Fit exponential\ny = ' + serieIBestLineFit.A.toFixed(3)+'* (' + serieIBestLineFit.R.toFixed(3) + '^x)';
            
                best_fit_exp.push([serieIBestLineFit.gx + 0.5, serieIBestLineFit.A*Math.pow(serieIBestLineFit.R, (serieIBestLineFit.gx +0.5) )]);

                bestFitExponetial = {
                    'name': ecParams.series[i] + ' best fit exponential',
                    'type': 'line',
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

                best_fit_exp = ecParams.series[i] + ' best fit exponential';
                _series.push(best_fit_exp);
                series.push(bestFitExponetial);
                selected[best_fit_exp] = false;
            }

            // best fit quadratic
            best_fit_quadratic = []
            for ( var k = 0; k < _xAxis.length; ++k) {
                var x  = _xAxis[k];
                best_fit_quadratic.push([x, serieIBestLineFit.quadratic_coeffs[0][0]*Math.pow(x, 2) + serieIBestLineFit.quadratic_coeffs[1][0]*x + serieIBestLineFit.quadratic_coeffs[2][0]] )
            }
            best_fit_quadratic.push([serieIBestLineFit.gx + 0.5, serieIBestLineFit.quadratic_coeffs[0][0]*Math.pow((serieIBestLineFit.gx + 0.5), 2) + serieIBestLineFit.quadratic_coeffs[1][0]*(serieIBestLineFit.gx + 0.5) + serieIBestLineFit.quadratic_coeffs[2][0]]);

            best_fit_expr = 'Best Fit quadratic\ny = (' + serieIBestLineFit.quadratic_coeffs[0][0].toFixed(3) + ')*x^2 + (' + serieIBestLineFit.quadratic_coeffs[1][0].toFixed(3)+')*x + (' + serieIBestLineFit.quadratic_coeffs[2][0].toFixed(3) + ')';
            
            bestFitQuadratic = {
                'name': ecParams.series[i] + ' best fit quadratic',
                'type': 'line',
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

            best_fit_name = ecParams.series[i] + ' best fit quadratic';
            series.push(serie);
            _series.push(best_fit_name);
            series.push(bestFitQuadratic);
            selected[best_fit_name] = false;

        } else {
            serie.data = ecParams._data_generator[i]();
            series.push(serie);
        }
        console.log(serie);
    }
    var option = {
        title: {
            text: ecParams.title,
        },
        tooltip: {
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
        legend: {
            type: 'scroll',
            right: 150,
            left: 100,
            top: 5,
            bottom: 100,
            data: _series,
            selected: selected,
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        toolbox: {
            show: true,
            feature: {
                mark: {
                    show: true
                },
                dataZoom: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: false
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        xAxis: [{
            type: 'value',
            scale: true
        }],
        yAxis: [{
            type: 'value',
            scale: true
        }],
        series: series,
    };
    return option;
}

module.exports = {
    chart: scatter,
}
