(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Central tendency summary statistics

var Mean = function (distribution) {
    var size = distribution.length;
    if (size == 0 ) {
        return null;
    }
    var mean = 0; var geometricMean = 1; var rootMeanSquare = 0;
    for (var i = 0; i < size; ++i ){
        mean += (distribution[i]/size);
        geometricMean *= Math.pow(distribution[i], 1/size);
        rootMeanSquare += Math.pow(distribution[i], 2);
    }
    var mean = mean.toFixed(5);
    var meanDiff = distribution.map(el => parseFloat((el - mean).toFixed(5)));
    return {
        'mean': parseFloat(mean),
        'geometricMean': parseFloat(geometricMean.toFixed(5)),
        'rootMeanSquare': parseFloat(Math.pow(rootMeanSquare/size, 1/2).toFixed(5)),
        'meanDiff': meanDiff
    }
}


var ModeMedian = function(distribution) {
    var size = distribution.length;
    var sorted_distribution;
    if (typeof distribution[0] === 'string') {
        sorted_distribution = distribution.sort();
    }
    var sorted_distribution = distribution.sort((x, y) => x-y);

    var mode = [sorted_distribution[0], 1];
    var median;
    var mid = sorted_distribution.length/2;
    if ( sorted_distribution.length%2 != 0) {
        median = [sorted_distribution[Math.floor(mid)]];
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
    if (frequencies.length/distribution.length > 0.85 && typeof distribution[0] === typeof 1) {
        frequencies = 'It might not be appropriate to consider this random variable' +
                      ' as categorical in your analysis: ' + (frequencies.length*100/distribution.length).toFixed(2) +
                      '% values are unique.' ;
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
},{}],2:[function(require,module,exports){

var Dispersion = function(distribution, centralTendency) {

    var size = distribution.length;

    var variance = 0;
    var meanDeviation = 0;
    var thirdMoment = 0;
    var fourthMoment = 0;

    for (var i = 0; i < centralTendency.meanDiff.length; ++i) {
        variance += Math.pow(centralTendency.meanDiff[i], 2);
        meanDeviation += Math.abs(centralTendency.meanDiff[i]);
        thirdMoment += Math.pow(centralTendency.meanDiff[i], 3);
        fourthMoment += Math.pow(centralTendency.meanDiff[i], 4);
    }

    variance = variance / size;
    skew = (thirdMoment / size) / (Math.pow(variance, 3 / 2));

    SES = Math.pow(6 * size * (size - 1) / ((size - 2) * (size + 1) * (size + 3)), 1 / 2);
    SEK = 2 * SES * Math.pow((size * size - 1) / ((size - 3) * (size + 5)), 1 / 2);

    testStatisticSkew = skew / SES;
    kurtosis = (fourthMoment / size) / (Math.pow(variance, 2));

    s = (size - 1) * ((size + 1) * (kurtosis - 3) + 6) / ((size - 2) * (size - 3));
    testStatisticKurt = s / SEK;

    skewStatus = '';
    if (skew > 1 / 2) {
        if (skew > 1) {
            skewStatus = 'highly skewed right';
        } else {
            skewStatus = 'moderately skewed right';
        }
    } else if (skew < -1 / 2) {
        if (skew < -1) {
            skewStatus = 'highly skewed left';
        } else {
            skewStatus = 'moderately skewed left';
        }
    } else {
        skewStatus = 'approximately symmetric'
    }

    var populationStatus = '';
    if (testStatisticSkew < -2) {
        populationStatus = 'the population is very likely skewed negatively'
    } else if (testStatisticSkew > 2) {
        populationStatus = 'the population is very likely skewed positively'
    } else {
        populationStatus = 'No conclusion on the poplutaion can be drawn'
    }

    kurtosisInterp = '';
    if (kurtosis > 3) {
        kurtosisInterp = 'leptokurtic';
    } else if (kurtosisInterp < 3) {
        kurtosisInterp = 'platykurtic';
    } else {
        kurtosisInterp = 'mesokurtic';
    }

    return {
        'variance': variance,
        'stdDeviation': Math.pow(variance, 1 / 2),
        'meanDeviation': meanDeviation / size,
        'SES': SES,
        'SEK': SEK,
        'skew': {
            value: skew,
            interpretation: skewStatus
        },
        'Zg1': {
            value: testStatisticSkew,
            interpretation: populationStatus
        },
        'confidenceIntervalSkewness': [skew - 2 * SES, skew + 2 * SES],
        'kurtosis': {
            value: kurtosis,
            interpretation: kurtosisInterp
        },
        'excessKurtosis': kurtosis - 3,
        'sampleExcessKurtosis': s,
        'Zg2': {
            value: testStatisticKurt
        },
        'DP': Math.pow(testStatisticKurt, 2) + Math.pow(testStatisticSkew, 2),
    }
}

module.exports = {
    'Dispersion': Dispersion
}

},{}],3:[function(require,module,exports){
var stats = window.stats || {};

stats.centralTendency = require('../stats/central_tendency');
stats.dispersion = require('../stats/dispersion');

window.stats = stats;
},{"../stats/central_tendency":1,"../stats/dispersion":2}]},{},[3]);
