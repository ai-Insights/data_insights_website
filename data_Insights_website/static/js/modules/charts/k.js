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