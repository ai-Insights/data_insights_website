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