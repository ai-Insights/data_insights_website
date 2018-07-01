var assert = require('assert');
var centralTendency = require("../../modules/stats/central_tendency");

describe('Mean()', function () {
    it('Should return null for empty array -> Mean([])', function () {
        assert.deepEqual(centralTendency.Mean([]), null);
    });

    it('It should correctly computes means for One element array -> Mean([5])', function() {
        assert.deepEqual(centralTendency.Mean([5]), {
            "mean": 5,
            "geometricMean": 5,
            "rootMeanSquare": 5,
            "meanDiff": [0]
        })
    });

    it('It should correctly computes means for distribution', function(){
        assert.deepEqual(
            centralTendency.Mean([6.5, 3.8, 6.6, 5.7, 6.0, 6.4, 5.3]), {
                'mean': 5.75714,
                'geometricMean': 5.67306,
                'rootMeanSquare': 5.82838,
                'meanDiff': [ 0.74286, -1.95714, 0.84286, -0.05714, 0.24286, 0.64286, -0.45714]
        });
    })
});

describe('ModeMedian()', function() {
    it ('Continuous random variable', function() {
        assert.deepEqual(centralTendency.Median([6.5, 3.8, 6.6, 5.7, 6.0, 6.4, 5.3]), {
            'median': {value: 6},
            'mode': {value: 3.8, frequency: 1},
            'frequencies': 'It might not be appropriate to consider this random variable as categorical in your analysis: 100.00% values are unique.',
            'sorted': [3.8, 5.3, 5.7, 6, 6.4, 6.5, 6.6]
        });
    });

    it ('Categorical random variable: character', function() {
        assert.deepEqual(centralTendency.Median(['a', 'b', 'b', 'c', 'a', 'z', 'a', 'z', 'e']), {
            'median': { value: 'b' },                                                                                                                                                                       
            'frequencies': [ [ 'a', 3 ], [ 'b', 2 ], [ 'c', 1 ], [ 'e', 1 ], ['z', 2]],
            'mode': {value: 'a', frequency:3},
            'sorted': ['a', 'a', 'a', 'b', 'b', 'c', 'e', 'z','z'],
        });
    });
});