var charts = window.charts || {};

charts.line = require('../charts/line');
charts.bar = require('../charts/bar');
charts.scatter = require('../charts/scatter');
charts.k = require('../charts/k');
charts.pie= require('../charts/pie');
charts.scatter3D = require('../charts/scatter3D');
charts.ecParams = require('../charts/ecParams');
charts.mime = require('../charts/theme/mime');
charts.parallel = require('../charts/parallel');

window.charts = charts;