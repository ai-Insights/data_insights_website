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
