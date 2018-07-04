var stats = window.stats || {};

stats.centralTendency = require('../stats/central_tendency');
stats.dispersion = require('../stats/dispersion');

window.stats = stats;