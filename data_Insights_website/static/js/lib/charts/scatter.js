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
