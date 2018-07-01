var pie = function(ecParams) {
    series = [];
    for (var i = 0; i < ecParams.categories.length; ++i) {
        series.push({
            value: ecParams.values[i],
            name: ecParams.categories[i]
        });
    }
    var option = {
        title: {
            text: ecParams.title,
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 20,
            top: 30,
            bottom: 20,
            data: ecParams.categories,
        },
        series: [{
            type: 'pie',
            data: series,
        }]

    };
    return option;
}


module.exports = {
    chart: pie,
}
