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
