var ecParams = {
    title: '',
    subtitle: '',

    parallel: [],
    parallel_data: [],

    // these are used for line, scatter and bar charts
    xAxis: [],
    yAxis: [],
    zAxis: [],

    // these are used for pie charts
    values: [],
    categories: [],

    // this can be use for any chart
    _data_generator: [{}],
    series: [],
}

module.exports = {
    ecParams: ecParams
}
