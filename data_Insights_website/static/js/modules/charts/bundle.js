(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var bar = function(ecParams) {
    var series = [];
    var zoom_size = 0;
    for (i = 0; i < ecParams.series.length; ++i) {
        var serie = {
            'name': ecParams.series[i],
            'type': 'bar',
            'data': ecParams.yAxis[i],
        }
        series.push(serie);
        zoom_size += ecParams.yAxis[i].length;
    }
    zoom_size = Math.ceil(12000 / zoom_size);
    if (zoom_size > 100) {
        zoom_size = 100;
    }
    zoom_begin = Math.floor((100 - zoom_size) / 2);
    var option = {
        title: {
            text: ecParams.title,
        },
        legend: {
            data: ecParams.series
        },
        dataZoom: {
            show: true,
            realtime: true,
            start: zoom_begin,
            end: zoom_begin + zoom_size,
        },
        tooltip: {
            show: true,
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

                magicType: {
                    show: true,
                    type: ['line', 'bar']
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
            'type': 'category',
            'data': ecParams.xAxis
        }],
        yAxis: [{
            type: 'value',
            scale: true,
        }],
        series: series,

    };
    return option;
}

module.exports = {
    chart: bar,
}

},{}],2:[function(require,module,exports){
var ecParams = {
    title: '',
    subtitle: '',

    parallel: [],
    parallel_data: [],

    // these are used for line, scatter and bar charts
    xAxis: [],
    yAxis: [],
    zAxis: [],

    // these are used for pie charts
    values: [],
    categories: [],

    // this can be use for any chart
    _data_generator: [{}],
    series: [],
}

module.exports = {
    ecParams: ecParams
}

},{}],3:[function(require,module,exports){
var charts = window.charts || {};

charts.line = require('../charts/line');
charts.bar = require('../charts/bar');
charts.scatter = require('../charts/scatter');
charts.k = require('../charts/k');
charts.pie= require('../charts/pie');
charts.scatter3D = require('../charts/scatter3D');
charts.ecParams = require('../charts/ecParams');
charts.mime = require('../charts/theme/mime');
charts.parallel = require('../charts/parallel');

window.charts = charts;
},{"../charts/bar":1,"../charts/ecParams":2,"../charts/k":5,"../charts/line":6,"../charts/parallel":7,"../charts/pie":8,"../charts/scatter":9,"../charts/scatter3D":10,"../charts/theme/mime":11}],4:[function(require,module,exports){
/*
 #TODO: Implement a mechanism which ensures that the point are in a strictly increasing
        Sequence before proceeding to interpolation.
 #TODO: Implement a mechanism which handles x, and y of different size
 #TODO: Complete the cubic spline interpolation 
*/

var _centralTendency = require ('../stats/central_tendency');

function gen_xAxis(xAxis) {
    // create a new array _xAxis with more points spaced by 0.1
    var _xAxis = [];
    for (var i = 0; i < xAxis.length - 1; ++i) {
        var xi = xAxis[i];
        while (xi < xAxis[i + 1]) {
            _xAxis.push(xi);
            xi += 0.05;
        }
    }
    _xAxis.push(xAxis[xAxis.length - 1]);
    return _xAxis;
}
var lagrange = function(xAxis, yAxis) {
    var _xAxis = gen_xAxis(xAxis);
    var _yAxis = [];
    for (var i = 0; i < _xAxis.length; ++i) {
        var yi = 0;
        for (var j = 0; j < xAxis.length; ++j) {
            var expr = yAxis[j];
            for (var k = 0; k < xAxis.length; ++k) {
                if (j != k) {
                    expr = expr * (_xAxis[i] - xAxis[k]) / (xAxis[j] - xAxis[k]);
                }
            }
            yi += expr;
        }
        _yAxis.push(yi);
    }
    return {
        _xAxis,
        _yAxis
    };
}
var newton = function(xAxis, yAxis) {
    var _xAxis = gen_xAxis(xAxis);
    var _yAxis = [];
    var f_diff = [];
    for (var i = 0; i < xAxis.length; i++) {
        f_diff[i] = new Array(xAxis.length);
    }
    for (var i = 0; i < xAxis.length; ++i) {
        f_diff[i][0] = yAxis[i];
    }
    for (var i = 1; i < xAxis.length; ++i) {
        for (var j = i; j < xAxis.length; ++j) {
            f_diff[j][i] = (f_diff[j][i - 1] - f_diff[j - 1][i - 1]) / (xAxis[j] - xAxis[j - i]);
        }
    }
    for (var i = 0; i < _xAxis.length; ++i) {
        result = 0;
        term = 1;
        for (j = 0; j < xAxis.length; ++j) {
            result += term * f_diff[j][j];
            term *= (_xAxis[i] - xAxis[j]);
        }
        _yAxis[i] = result;
    }
    return {
        _xAxis,
        _yAxis
    }
};
var spline = function(xAxis, yAxis) {
    var h = [];
    for (var i = 0; i < xAxis.length - 1; ++i) {
        h.push(xAxis[i + 1] - xAxis[i]);
    }
    var S = [];
    for (var i = 0; i < xAxis.length; i++) {
        S[i] = new Array(xAxis.length);
    }
}

var bestFitLine = function (xAxis, yAxis ){
    var xCentralTendency = _centralTendency.Mean(xAxis);
    var yCentralTendency = _centralTendency.Mean(yAxis);
    console.log(xCentralTendency);
    console.log(yCentralTendency);
    var gx = -Infinity;
    var lx = +Infinity;
    var m = 0; var n = 0; var p = 0; var z =0;
    for ( var i = 0; i < xAxis.length; ++i ) {
        gx = (xAxis[i] > gx ) ? xAxis[i]: gx;
        lx = (xAxis[i] < lx ) ? xAxis[i]: lx;
        n += xCentralTendency.meanDiff[i]*yCentralTendency.meanDiff[i];
        p += Math.pow(xCentralTendency.meanDiff[i], 2);
        z += Math.pow(yCentralTendency.meanDiff[i], 2);
    }
    m = n/p;
    r = n/Math.pow(p*z, 1/2);
    b = yCentralTendency.mean - m*xCentralTendency.mean;

    return {
        'm': m,
        'b': b,
        'gx': gx,
        'lx': lx,
        'r': r
    }
}

var x = [8, 2, 11, 6, 5, 4, 12, 9, 6, 1];
var y = [3, 10, 3, 6, 8, 12, 1, 4, 9, 14];

console.log(bestFitLine(x, y));

module.exports = {
    newton: newton,
    lagrange: lagrange,
    spline: spline,
    bestFitLine: bestFitLine,
};

},{"../stats/central_tendency":12}],5:[function(require,module,exports){
/*
    #TODO: Implement supports for ecParams.ecParams
*/
var k = function(xAxis, c_OHLC, title) {
    var option = {
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                result = params[0].seriesName + '<br>' + params[0].name + '<br>';
                result += ('Open: ' + params[0].data[0] + '<br>' +
                    'High: ' + params[0].data[1] + '<br>' +
                    'Low: ' + params[0].data[2] + '<br>' +
                    'Close: ' + params[0].data[3]);
                return result;
            }
        },
        legend: {
            data: [title]
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
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },

        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        xAxis: [{
            type: 'category',
            data: xAxis
        }],
        yAxis: [{
            type: 'value',
            scale: true,
            boundaryGap: [0.05, 0.05],
        }],
        series: [{
            name: title,
            type: 'k',
            data: c_OHLC,
        }]
    };
    return option;
}

module.exports = {
    chart: k,
}
},{}],6:[function(require,module,exports){
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
},{"../charts/interpolation":4}],7:[function(require,module,exports){
var parallel = function(ecParams) {
    var data = [];
    var axis = [];
    console.log(ecParams);
    console.log((ecParams.parallel_data[0])[0]);
    for (var i = 0; i < ecParams.parallel_data[0].length; ++i) {
        var _instance = [];
        for (var j = 0; j < ecParams.parallel.length; ++j) {
            _instance.push(ecParams.parallel_data[j][i]);
        }
        data.push(_instance);
    }
    for( var i = 0; i < ecParams.parallel.length; ++i ){
        axis.push({
            dim: i,
            name: ecParams.parallel[i],
        });
    }
    var option = {
        legend: {
            data: [ecParams.series]
        },
        title: {
            text: ecParams.title,
        },
        parallelAxis: axis,
        series: [{
            name: ecParams.series,
            type: 'parallel',
            data: data,
        }]
    };

    return option;
}

module.exports = {
    'chart': parallel,
}

},{}],8:[function(require,module,exports){
var pie = function(ecParams) {
    series = [];
    for (var i = 0; i < ecParams.categories.length; ++i) {
        series.push({
            value: ecParams.values[i],
            name: ecParams.categories[i]
        });
    }
    var option = {
        title: {
            text: ecParams.title,
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 20,
            top: 30,
            bottom: 20,
            data: ecParams.categories,
        },
        series: [{
            type: 'pie',
            data: series,
        }]

    };
    return option;
}


module.exports = {
    chart: pie,
}

},{}],9:[function(require,module,exports){
var interpolation = require("./interpolation");


var scatter = function(ecParams) {
    series = [];
    _series = [];
    for (var i = 0; i < ecParams.series.length; ++i) {
        _series.push(ecParams.series[i]);
        serie = {
            'name': ecParams.series[i],
            'type': 'scatter',
            'data': [],
        }
        if (typeof ecParams._data_generator[i] !== 'function') {
            for (var j = 0; j < ecParams.xAxis[i].length; ++j) {
                serie.data.push([ecParams.xAxis[i][j], ecParams.yAxis[i][j]]);
            }
            if (ecParams.xAxis[i].length < 100) {
                serie.symbolSize = 10;
            }
            var serieIBestLineFit = interpolation.bestFitLine(ecParams.xAxis[i], ecParams.yAxis[i]);
            bestFit = {
                'name': ecParams.series[i] + ' best fit line ',
                'type': 'line',
                'data': [[serieIBestLineFit.lx, serieIBestLineFit.m * serieIBestLineFit.lx + serieIBestLineFit.b], 
                         [serieIBestLineFit.gx, serieIBestLineFit.m * serieIBestLineFit.gx + serieIBestLineFit.b]]
            }
            console.log(serieIBestLineFit);
            series.push(serie);
            _series.push(ecParams.series[i] + ' best fit line ');
            series.push(bestFit);
        } else {
            serie.data = ecParams._data_generator[i]();
            series.push(serie);
        }
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
            data: _series,
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

},{"./interpolation":4}],10:[function(require,module,exports){
var scatter3D = function(ecParams) {
    var data = [];
    for (var i = 0; i < ecParams.xAxis.length; ++i) {
        data.push([ecParams.xAxis[i], ecParams.yAxis[i], ecParams.zAxis[i]]);
    }
    var option = {
        title: {
            text: ecParams.title,
        },
        legend: {
            data: ecParams.title,
        },
        xAxis3D: {
            type: 'value',
        },
        yAxis3D: {
            type: 'value',
        },
        zAxis3D: {
            type: 'value',
        },

        grid3D: {
            viewControl: {
                // projection: 'orthographic'
            }
        },
        series: [{
            type: 'scatter3D',
            data: data,
        }]
    };
    return option;
}

module.exports = {
    chart: scatter3D,
}

},{}],11:[function(require,module,exports){
var theme = {
    backgroundColor: 'rgba(46,46,46,0.5)',
    color: ['rgb(197, 52, 64)', '#2098d1', '#66a61e', '#984ea3', '#00d2d5',
        '#ff7f00', '#af8d00', '#7f80cd', '#b3e900', '#c42e60',
        '#a65628', '#f781bf', '#8dd3c7', '#bebada', '#fb8072',
        '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#fdb462'
    ],
    title: {
        x: 'left',
        y: 'top',
        backgroundColor: 'rgba(46,46,46,0.9)',
        borderColor: '#ccc',
        borderWidth: 0,
        padding: 5,

        itemGap: 10,
        textStyle: {
            fontSize: 18,
            fontWeight: 'bolder',
            color: 'rgba(255, 255, 255)'
        },
        subtextStyle: {
            color: '#aaa'
        }
    },

    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'top',
        backgroundColor: 'rgba(46,46,46,0.9)',
        borderColor: '#171717',
        borderWidth: 0,
        padding: 9,
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 14,
        textStyle: {
            color: 'rgba(255, 255, 255)'
        }
    },
    dataRange: {
        orient: 'vertical',
        x: 'left',
        y: 'bottom',
        backgroundColor: 'rgba(46,46,46,0.9)',
        borderColor: '#ccc',
        borderWidth: 0,
        padding: 5,

        itemGap: 10,
        itemWidth: 20,
        itemHeight: 14,
        splitNumber: 5,
        color: ['#1e90ff', '#f0ffff'],
        textStyle: {
            color: 'rgba(255, 255, 255)'
        }
    },

    toolbox: {
        orient: 'horizontal',
        x: 'right',
        y: 'top',
        iconStyle: {
            color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
        },
        backgroundColor: 'rgba(46,46,46,0.9)',

    },


    tooltip: {
        trigger: 'item',
        showDelay: 20,
        hideDelay: 100,
        transitionDuration: 0.4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#333',
        borderRadius: 4,
        borderWidth: 0,
        padding: 5,
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#48b',
                width: 2,
                type: 'solid'
            },
            shadowStyle: {
                width: 'auto',
                color: 'rgba(150,150,150,0.3)'
            }
        },
        textStyle: {
            color: '#fff'
        }
    },
    dataZoom: {
        orient: 'horizontal',
        backgroundColor: 'rgba(0,0,0,0)',
        dataBackgroundColor: 'rgba(32, 152, 180, 1)',
        fillerColor: 'rgba(144,197,237,0.2)',
        handleColor: 'rgba(70,130,180,0.8)'
    },

    grid: {
        x: 80,
        y: 60,
        x2: 80,
        y2: 60,
        borderWidth: 1,
        borderColor: '#171717'
    },

    categoryAxis: {
        position: 'bottom',
        nameLocation: 'end',
        boundaryGap: true,
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgba(40, 175, 67, 0.66)',
                width: 1,
                type: 'solid'
            }
        },
        axisTick: {
            show: true,
            interval: 'auto',
            // onGap: null,
            inside: false,
            length: 5,
            lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)',
                width: 1
            }
        },
        axisLabel: {
            show: true,
            interval: 'auto',
            rotate: 0,
            margin: 8,

            textStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
            }
        },
        splitLine: {
            show: true,
            // onGap: null,
            lineStyle: {
                color: ['rgba(255, 255, 255, 0.5)'],
                width: 0.3,
                type: 'solid'
            }
        },
        splitArea: {
            show: false,
            // onGap: null,
            areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
            }
        }
    },


    valueAxis: {
        position: 'left',
        nameLocation: 'end',
        nameTextStyle: {},
        boundaryGap: [0, 0],
        splitNumber: 5,
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgba(40, 175, 67, 0.66)',
                width: 0.9,
                type: 'dashed'
            }
        },
        axisTick: {
            show: false,
            inside: false,
            length: 5,
            lineStyle: {
                color: 'rgba(255, 255, 255)',
                width: 1
            }
        },
        axisLabel: {
            show: true,
            rotate: 0,
            margin: 8,
            // formatter: null,
            textStyle: {
                color: 'rgba(255, 255, 255)'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['rgba(255, 255, 255, 0.5)'],
                width: 0.3,
                type: 'solid'
            }
        },
        splitArea: {
            show: false,
            areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
            }
        }
    },

    polar: {
        center: ['50%', '50%'],
        radius: '75%',
        startAngle: 90,
        splitNumber: 5,
        name: {
            show: true,
            textStyle: {
                color: '#333'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#ccc',
                width: 1,
                type: 'solid'
            }
        },
        axisLabel: {
            show: false,
            textStyle: {
                color: '#333'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                width: 1,
                color: '#ccc'
            }
        }
    },


    bar: {
        barMinHeight: 0,
        // barWidth: null,        
        barGap: '30%',
        barCategoryGap: '20%',
        itemStyle: {
            normal: {
                barBorderColor: '#171717',
                barBorderRadius: 0,
                barBorderWidth: 0.3,
                label: {
                    show: false

                }
            },
            emphasis: {
                barBorderColor: 'rgba(0,0,0,0)',
                barBorderRadius: 0,
                barBorderWidth: 1,
                label: {
                    show: false

                }
            }
        }
    },


    line: {
        symbol: 'circle',
        itemStyle: {
            normal: {

                label: {
                    show: false
                },
                lineStyle: {
                    width: 2,
                    type: 'solid',
                    shadowColor: 'rgba(0,0,0,0)',
                    shadowBlur: 5,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3
                }
            },
            emphasis: {

                label: {
                    show: false

                }
            }
        },
        //smooth : false,
        //symbol: null,         
        symbolSize: 2,
        //symbolRotate : null,  
        showAllSymbol: false
    },


    k: {
        // barWidth : null          
        // barMaxWidth : null       
        itemStyle: {
            normal: {
                color: '#fff',
                color0: '#00aa11',
                lineStyle: {
                    width: 1,
                    color: '#ff3200',
                    color0: '#00aa11'
                }
            },
            emphasis: {}
        }
    },


    scatter: {
        //symbol: null,     
        symbolSize: 4,
        //symbolRotate : null,  
        large: false,
        largeThreshold: 2000,
        itemStyle: {
            normal: {
                label: {
                    show: false

                }
            },
            emphasis: {

                label: {
                    show: false
                }
            }
        }
    },

    radar: {
        itemStyle: {
            normal: {
                label: {
                    show: false
                },
                lineStyle: {
                    width: 2,
                    type: 'solid'
                }
            },
            emphasis: {
                label: {
                    show: false
                }
            }
        },
        //symbol: null,         
        symbolSize: 2
        //symbolRotate : null,  
    },


    pie: {
        center: ['50%', '50%'],
        radius: [0, '75%'],
        clockWise: false,
        startAngle: 90,
        minAngle: 0,
        selectedOffset: 10,
        itemStyle: {
            normal: {
                borderColor: '#fff',
                borderWidth: 1,
                label: {
                    show: true,
                    position: 'outer'
                    // textStyle: null    
                },
                labelLine: {
                    show: true,
                    length: 20,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            emphasis: {
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                label: {
                    show: false
                    // position: 'outer'
                    // textStyle: null   
                },
                labelLine: {
                    show: false,
                    length: 20,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        }
    },
    chord: {
        radius: ['65%', '75%'],
        center: ['50%', '50%'],
        padding: 2,
        sort: 'none', // can be 'none', 'ascending', 'descending'
        sortSub: 'none', // can be 'none', 'ascending', 'descending'
        startAngle: 90,
        clockWise: false,
        showScale: false,
        showScaleText: false,
        itemStyle: {
            normal: {
                label: {
                    show: true
                    // textStyle: null    
                },
                lineStyle: {
                    width: 0,
                    color: '#000'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: '#666'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 0,
                    color: '#000'
                },
                chordStyle: {
                    lineStyle: {
                        width: 2,
                        color: '#333'
                    }
                }
            }
        }
    },

    island: {
        r: 15,
        calculateStep: 0.1
    },

    textStyle: {
        decoration: 'none',
        fontFamily: 'quicksand, sans-serif',
        fontFamily2: 'rationale, sans-serif',
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: 'normal'
    },
}

module.exports = {
    theme: theme,
}
},{}],12:[function(require,module,exports){
// Central tendency summary statistics

var Mean = function (distribution) {
    var size = distribution.length;
    var _mean = (acc, cur) => acc + cur;
    var _geometriMean = (acc, cur) => acc * cur;
    var _rootMeanSquare = (acc, cur) => acc + Math.pow(cur, 2);
    var mean = distribution.reduce(_mean)/size;
    var meanDiff = distribution.map(el => el - mean);
    return {
        'mean': mean,
        'geometricMean': Math.pow(distribution.reduce(_geometriMean), 1/size),
        'rootMeanSquare': Math.pow(distribution.reduce(_rootMeanSquare)/size, 1/2),
        'meanDiff': meanDiff
    }
}


var ModeMedian = function(distribution) {
    var size = distribution.length;
    var sorted_distribution = distribution.sort((x, y) => x-y);

    var mode = [sorted_distribution[0], 1];
    var median;
    var mid = sorted_distribution.length/2;
    if ( sorted_distribution.length%2 != 0) {
        median = sorted_distribution[Math.floor(mid)];
    } else {
        median = [sorted_distribution[mid-1], sorted_distribution[mid]];
    }
    var frequencies = [[(sorted_distribution[0]), 1]];
    for (var i = 1; i < size; ++i ) {
        if ( sorted_distribution[i] != frequencies[frequencies.length - 1][0]) {
            frequencies.push([sorted_distribution[i], 1]);
        } else {
            frequencies[frequencies.length - 1][1] += 1;
            mode = frequencies[frequencies.length -1][1] > mode[1] ? frequencies[frequencies.length -1]: mode;
        }
    }
    return {
        'mode': {value: mode[0], frequency: mode[1]},
        'median': {value: median},
        'frequencies': frequencies,
        'sorted': sorted_distribution,
    }
}


module.exports = {
    'Mean': Mean,
    'Median': ModeMedian,
}
},{}]},{},[3]);
