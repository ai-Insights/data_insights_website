/*
 #TODO: Implement a mechanism which ensures that the point are in a strictly increasing
        Sequence before proceeding to interpolation.
 #TODO: Implement a mechanism which handles x, and y of different size
 #TODO: Complete the cubic spline interpolation 
*/

var _centralTendency = require ('../stats/central_tendency');
var mathjs = require('../math.js');

function gen_xAxis(xAxis) {
    // create a new array _xAxis with more points spaced by 0.1
    var _xAxis = [];
    for (var i = 0; i < xAxis.length - 1; ++i) {
        var xi = xAxis[i];
        var inc = (xAxis[i+1] - xAxis[i])/15;
        while (xi < xAxis[i + 1]) {
            _xAxis.push(xi);
            xi += inc;
        }
    }
    _xAxis.push(xAxis[xAxis.length - 1]);
    return _xAxis;
}

var lagrange = function(xAxis, yAxis) {
    var _yAxis = [];
    for (var i = 0; i < xAxis.length; ++i) {
        var yi = 0;
        for (var j = 0; j < xAxis.length; ++j) {
            var expr = yAxis[j];
            for (var k = 0; k < xAxis.length; ++k) {
                if (j != k) {
                    expr = expr * (xAxis[i] - xAxis[k]) / (xAxis[j] - xAxis[k]);
                }
            }
            yi += expr;
        }
        _yAxis.push(yi);
    }
    return {
        xAxis,
        _yAxis
    };
}
var newton = function(xAxis, yAxis) {
    var _xAxis = xAxis;
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

var Regressions = function (xAxis, yAxis ){
    var yAxislog = [];
    for ( var i = 0; i < yAxis.length; ++i ) {
        // yAxislog is used for exponential regression
        yAxislog.push(Math.log10(yAxis[i]));
    }
    // We compute the central tendencies of the series
    var xCentralTendency = _centralTendency.Mean(xAxis);
    var yCentralTendency = _centralTendency.Mean(yAxis);
    var yLogCentralTendency = _centralTendency.Mean(yAxislog);
    
    var gx = -Infinity; // greatest x value
    var lx = +Infinity; // greatest y value


    var m = 0; 
    var n = 0;   // (xi - Mean(x))*(yi - Mean(y))
    var p = 0;   // (xi - Mean(x))^2
    var z =0;    // (yi - Mean(x))^2
    var nl = 0;
    var xAxis2 = 0; var xAxis3 = 0; var xAxis4 = 0; var yAxis2 = 0;
    var xy = 0; var x2y = 0; var xAxis1 = 0; var yAxis1 = 0;

    for ( var i = 0; i < xAxis.length; ++i ) {
        gx = (xAxis[i] > gx ) ? xAxis[i]: gx;
        lx = (xAxis[i] < lx ) ? xAxis[i]: lx;

        // required to determine best fit line
        n += xCentralTendency.meanDiff[i]*yCentralTendency.meanDiff[i];
        p += Math.pow(xCentralTendency.meanDiff[i], 2);
        z += Math.pow(yCentralTendency.meanDiff[i], 2);
        
        // required to determine exponential regressions
        nl += xCentralTendency.meanDiff[i]*yLogCentralTendency.meanDiff[i];

        // required to determine 
        xAxis1 += xAxis[i];
        xAxis2 += Math.pow(xAxis[i], 2);
        xAxis3 += Math.pow(xAxis[i], 3);
        xAxis4 += Math.pow(xAxis[i], 4);

        yAxis1 += yAxis[i];
        yAxis2 += Math.pow(yAxis[i], 2);

        xy += yAxis[i]*xAxis[i];
        x2y += yAxis[i]*Math.pow(xAxis[i], 2);
    }

    // best fit line
    m = n/p;
    r = n/Math.pow(p*z, 1/2);
    b = yCentralTendency.mean - m*xCentralTendency.mean;

    // best fit exponential
    ml = nl/p;
    bl = yLogCentralTendency.mean - ml*xCentralTendency.mean;


    // best fit quadratic
    matrixA = [[xAxis4, xAxis3, xAxis2],
               [xAxis3, xAxis2, xAxis1],
               [xAxis2, xAxis1, xAxis.length]]
    matrixb = [x2y, xy, yAxis1];


    quadratic_coeffs = mathjs.lusolve(mathjs.lup(matrixA), matrixb);


    return {
        'm': m,
        'b': b,
        'gx': gx,
        'lx': lx,
        'r': r,
        'A': Math.pow(10, bl),
        'R': Math.pow(10, ml),
        'quadratic_coeffs' : quadratic_coeffs._data,
    }
}
function gen_df(xs, ys) {
    var n = xs.length - 1;  
    var b = []
    // Create an n x n matrix A
    var A = [];
    for ( var i = 0; i < xs.length; ++i ) {
        var Ai = [];
        for ( var j = 0; j < xs.length; ++j) {
            Ai.push(0);
        }
        A.push(Ai);
        b.push(0);
    }

    for ( var i = 1; i < n; ++i ) {
        A[i][i-1] = 1/(xs[i] - xs[i-1]);
        A[i][i] = 2 * (1/(xs[i] - xs[i-1]) + 1/(xs[i+1] - xs[i])) ;
        A[i][i+1] = 1/(xs[i+1] - xs[i]);
        b[i] = 3* ( (ys[i]-ys[i-1])/ ((xs[i] - xs[i-1])*(xs[i] - xs[i-1])) 
                    +  (ys[i+1]-ys[i])/ ((xs[i+1] - xs[i])*(xs[i+1] - xs[i])) );
    }

    A[0][0  ] = 2/(xs[1] - xs[0]);
    A[0][1  ] = 1/(xs[1] - xs[0]);
    b[0] = 3 * (ys[1] - ys[0]) / ((xs[1]-xs[0])*(xs[1]-xs[0]));
    
    A[n][n-1] = 1/(xs[n] - xs[n-1]);
    A[n][n  ] = 2/(xs[n] - xs[n-1]);
    b[n] = 3 * (ys[n] - ys[n-1]) / ((xs[n]-xs[n-1])*(xs[n]-xs[n-1]));

    ks = mathjs.lusolve(mathjs.lup(A), b)._data;
    return ks;
}

spline = function (x, xs, ys, ks) {
    var i = 1;
    while(xs[i]<x) i++;
        
    var t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
     
    var a =  ks[i-1]*(xs[i]-xs[i-1]) - (ys[i]-ys[i-1]);
    var b = -ks[i]*(xs[i]-xs[i-1]) + (ys[i]-ys[i-1]);
        
    var q = (1-t)*ys[i-1] + t*ys[i] + t*(1-t)*(a*(1-t)+b*t);
    return q;
}


cubic_spline = function(xs, ys) {
    var ks = gen_df(xs, ys);
    var smooth_xs;
    if ( xs.length < 130 ) {
        smooth_xs = gen_xAxis(xs);
    } else {
        smooth_xs = xs;
    }
    console.log(smooth_xs);
    var serie = [];
    for ( var i = 0; i < smooth_xs.length; ++i  ) {
        serie.push([smooth_xs[i], spline(smooth_xs[i], xs, ys, ks)]);
    }

    return serie;
}


module.exports = {
    gen_xAxis: gen_xAxis,
    newton: newton,
    lagrange: lagrange,
    cubic_spline: cubic_spline,
    Regressions: Regressions,
};
