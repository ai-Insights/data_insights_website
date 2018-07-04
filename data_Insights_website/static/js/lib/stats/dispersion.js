
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
