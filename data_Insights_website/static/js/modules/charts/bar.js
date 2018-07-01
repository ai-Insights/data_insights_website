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
