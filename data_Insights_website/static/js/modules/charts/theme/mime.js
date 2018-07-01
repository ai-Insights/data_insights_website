var theme = {
    backgroundColor: 'rgba(46,46,46,0.5)',
    color: ['rgb(197, 52, 64)', '#2098d1', '#66a61e', '#984ea3', '#00d2d5',
        '#ff7f00', '#af8d00', '#7f80cd', '#b3e900', '#c42e60',
        '#a65628', '#f781bf', '#8dd3c7', '#bebada', '#fb8072',
        '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#fdb462'
    ],
    title: {
        x: 'left',
        y: 'top',
        backgroundColor: 'rgba(46,46,46,0.9)',
        borderColor: '#ccc',
        borderWidth: 0,
        padding: 5,

        itemGap: 10,
        textStyle: {
            fontSize: 18,
            fontWeight: 'bolder',
            color: 'rgba(255, 255, 255)'
        },
        subtextStyle: {
            color: '#aaa'
        }
    },

    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'top',
        backgroundColor: 'rgba(46,46,46,0.9)',
        borderColor: '#171717',
        borderWidth: 0,
        padding: 9,
        itemGap: 10,
        itemWidth: 20,
        itemHeight: 14,
        textStyle: {
            color: 'rgba(255, 255, 255)'
        }
    },
    dataRange: {
        orient: 'vertical',
        x: 'left',
        y: 'bottom',
        backgroundColor: 'rgba(46,46,46,0.9)',
        borderColor: '#ccc',
        borderWidth: 0,
        padding: 5,

        itemGap: 10,
        itemWidth: 20,
        itemHeight: 14,
        splitNumber: 5,
        color: ['#1e90ff', '#f0ffff'],
        textStyle: {
            color: 'rgba(255, 255, 255)'
        }
    },

    toolbox: {
        orient: 'horizontal',
        x: 'right',
        y: 'top',
        iconStyle: {
            color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
        },
        backgroundColor: 'rgba(46,46,46,0.9)',

    },


    tooltip: {
        trigger: 'item',
        showDelay: 20,
        hideDelay: 100,
        transitionDuration: 0.4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderColor: '#333',
        borderRadius: 4,
        borderWidth: 0,
        padding: 5,
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: '#48b',
                width: 2,
                type: 'solid'
            },
            shadowStyle: {
                width: 'auto',
                color: 'rgba(150,150,150,0.3)'
            }
        },
        textStyle: {
            color: '#fff'
        }
    },
    dataZoom: {
        orient: 'horizontal',
        backgroundColor: 'rgba(0,0,0,0)',
        dataBackgroundColor: 'rgba(32, 152, 180, 1)',
        fillerColor: 'rgba(144,197,237,0.2)',
        handleColor: 'rgba(70,130,180,0.8)'
    },

    grid: {
        x: 80,
        y: 60,
        x2: 80,
        y2: 60,
        borderWidth: 1,
        borderColor: '#171717'
    },

    categoryAxis: {
        position: 'bottom',
        nameLocation: 'end',
        boundaryGap: true,
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgba(40, 175, 67, 0.66)',
                width: 1,
                type: 'solid'
            }
        },
        axisTick: {
            show: true,
            interval: 'auto',
            // onGap: null,
            inside: false,
            length: 5,
            lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)',
                width: 1
            }
        },
        axisLabel: {
            show: true,
            interval: 'auto',
            rotate: 0,
            margin: 8,

            textStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
            }
        },
        splitLine: {
            show: true,
            // onGap: null,
            lineStyle: {
                color: ['rgba(255, 255, 255, 0.5)'],
                width: 0.3,
                type: 'solid'
            }
        },
        splitArea: {
            show: false,
            // onGap: null,
            areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
            }
        }
    },


    valueAxis: {
        position: 'left',
        nameLocation: 'end',
        nameTextStyle: {},
        boundaryGap: [0, 0],
        splitNumber: 5,
        axisLine: {
            show: true,
            lineStyle: {
                color: 'rgba(40, 175, 67, 0.66)',
                width: 0.9,
                type: 'dashed'
            }
        },
        axisTick: {
            show: false,
            inside: false,
            length: 5,
            lineStyle: {
                color: 'rgba(255, 255, 255)',
                width: 1
            }
        },
        axisLabel: {
            show: true,
            rotate: 0,
            margin: 8,
            // formatter: null,
            textStyle: {
                color: 'rgba(255, 255, 255)'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['rgba(255, 255, 255, 0.5)'],
                width: 0.3,
                type: 'solid'
            }
        },
        splitArea: {
            show: false,
            areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
            }
        }
    },

    polar: {
        center: ['50%', '50%'],
        radius: '75%',
        startAngle: 90,
        splitNumber: 5,
        name: {
            show: true,
            textStyle: {
                color: '#333'
            }
        },
        axisLine: {
            show: true,
            lineStyle: {
                color: '#ccc',
                width: 1,
                type: 'solid'
            }
        },
        axisLabel: {
            show: false,
            textStyle: {
                color: '#333'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                width: 1,
                color: '#ccc'
            }
        }
    },


    bar: {
        barMinHeight: 0,
        // barWidth: null,        
        barGap: '30%',
        barCategoryGap: '20%',
        itemStyle: {
            normal: {
                barBorderColor: '#171717',
                barBorderRadius: 0,
                barBorderWidth: 0.3,
                label: {
                    show: false

                }
            },
            emphasis: {
                barBorderColor: 'rgba(0,0,0,0)',
                barBorderRadius: 0,
                barBorderWidth: 1,
                label: {
                    show: false

                }
            }
        }
    },


    line: {
        symbol: 'circle',
        itemStyle: {
            normal: {

                label: {
                    show: false
                },
                lineStyle: {
                    width: 2,
                    type: 'solid',
                    shadowColor: 'rgba(0,0,0,0)',
                    shadowBlur: 5,
                    shadowOffsetX: 3,
                    shadowOffsetY: 3
                }
            },
            emphasis: {

                label: {
                    show: false

                }
            }
        },
        //smooth : false,
        //symbol: null,         
        symbolSize: 2,
        //symbolRotate : null,  
        showAllSymbol: false
    },


    k: {
        // barWidth : null          
        // barMaxWidth : null       
        itemStyle: {
            normal: {
                color: '#fff',
                color0: '#00aa11',
                lineStyle: {
                    width: 1,
                    color: '#ff3200',
                    color0: '#00aa11'
                }
            },
            emphasis: {}
        }
    },


    scatter: {
        //symbol: null,     
        symbolSize: 4,
        //symbolRotate : null,  
        large: false,
        largeThreshold: 2000,
        itemStyle: {
            normal: {
                label: {
                    show: false

                }
            },
            emphasis: {

                label: {
                    show: false
                }
            }
        }
    },

    radar: {
        itemStyle: {
            normal: {
                label: {
                    show: false
                },
                lineStyle: {
                    width: 2,
                    type: 'solid'
                }
            },
            emphasis: {
                label: {
                    show: false
                }
            }
        },
        //symbol: null,         
        symbolSize: 2
        //symbolRotate : null,  
    },


    pie: {
        center: ['50%', '50%'],
        radius: [0, '75%'],
        clockWise: false,
        startAngle: 90,
        minAngle: 0,
        selectedOffset: 10,
        itemStyle: {
            normal: {
                borderColor: '#fff',
                borderWidth: 1,
                label: {
                    show: true,
                    position: 'outer'
                    // textStyle: null    
                },
                labelLine: {
                    show: true,
                    length: 20,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            emphasis: {
                borderColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                label: {
                    show: false
                    // position: 'outer'
                    // textStyle: null   
                },
                labelLine: {
                    show: false,
                    length: 20,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            }
        }
    },
    chord: {
        radius: ['65%', '75%'],
        center: ['50%', '50%'],
        padding: 2,
        sort: 'none', // can be 'none', 'ascending', 'descending'
        sortSub: 'none', // can be 'none', 'ascending', 'descending'
        startAngle: 90,
        clockWise: false,
        showScale: false,
        showScaleText: false,
        itemStyle: {
            normal: {
                label: {
                    show: true
                    // textStyle: null    
                },
                lineStyle: {
                    width: 0,
                    color: '#000'
                },
                chordStyle: {
                    lineStyle: {
                        width: 1,
                        color: '#666'
                    }
                }
            },
            emphasis: {
                lineStyle: {
                    width: 0,
                    color: '#000'
                },
                chordStyle: {
                    lineStyle: {
                        width: 2,
                        color: '#333'
                    }
                }
            }
        }
    },

    island: {
        r: 15,
        calculateStep: 0.1
    },

    textStyle: {
        decoration: 'none',
        fontFamily: 'quicksand, sans-serif',
        fontFamily2: 'rationale, sans-serif',
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: 'normal'
    },
}

module.exports = {
    theme: theme,
}