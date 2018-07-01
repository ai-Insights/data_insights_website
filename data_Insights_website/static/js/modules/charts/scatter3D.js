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
