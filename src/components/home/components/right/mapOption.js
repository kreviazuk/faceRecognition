/**
 * Created by dhj on 2018/5/9.
 */
var option = {
  backgroundColor: '#fff',
  color: ['#0B3CF4', '#29C5A1', '#A022EE'],
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return params.name + '<br/>' + params.seriesName + ' : ' + params.value[2];
    }
  },
  legend: {
    orient: 'vertical',
    y: 'bottom',
    x: 'left',
    data: [{
      name: '摄像头分布地点'
    },
    {
      name: '门禁设备分布地点'
    },
    {
      name: '其它设备分布地点'
    }
    ],
    textStyle: {
      color: '#999999'
    }
  },
  geo: {
    map: 'china',
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: true,
        color: '#3C3E4A'
      }
    },
    itemStyle: {
      normal: {
        areaColor: '#d1d4da',
        borderColor: '#fff'
      },
      emphasis: {
        areaColor: '#ccc'
      }
    }
  },
  series: [{
    name: '摄像头分布地点',
    type: 'scatter',
    coordinateSystem: 'geo',
    data: [],
    symbolSize: 20,
    itemStyle: {
      normal: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.7,
          colorStops: [{
            offset: 0,
            color: 'rgba(11,60,244,1)' // 0% 处的颜色
          }, {
            offset: 0.2,
            color: 'rgba(11,60,244,0.2)' // 0% 处的颜色
          }, {
            offset: 0.4,
            color: 'rgba(11,60,244,1)' // 0% 处的颜色
          }, {
            offset: 0.6,
            color: 'rgba(11,60,244,0.2)' // 0% 处的颜色
          }, {
            offset: 0.8,
            color: 'rgba(11,60,244,1)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(11,60,244,0.2)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      },
      emphasis: {
        borderColor: '#fff',
        borderWidth: 0
      }
    }
  }, {
    name: '门禁设备分布地点',
    type: 'scatter',
    coordinateSystem: 'geo',
    data: [],
    symbolSize: 20,
    itemStyle: {
      normal: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.7,
          colorStops: [{
            offset: 0,
            color: 'rgba(41,197,161,1)' // 0% 处的颜色
          }, {
            offset: 0.2,
            color: 'rgba(41,197,161,0.2)' // 0% 处的颜色
          }, {
            offset: 0.4,
            color: 'rgba(41,197,161,1)' // 0% 处的颜色
          }, {
            offset: 0.6,
            color: 'rgba(41,197,161,0.2)' // 0% 处的颜色
          }, {
            offset: 0.8,
            color: 'rgba(41,197,161,1)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(41,197,161,0.2)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      },
      emphasis: {
        borderColor: '#fff',
        borderWidth: 0
      }
    }
  }, {
    name: '其它设备分布地点',
    type: 'scatter',
    coordinateSystem: 'geo',
    data: [],
    symbolSize: 20,
    itemStyle: {
      normal: {
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.7,
          colorStops: [{
            offset: 0,
            color: 'rgba(160,34,238,1)' // 0% 处的颜色
          }, {
            offset: 0.2,
            color: 'rgba(160,34,238,0.2)' // 0% 处的颜色
          }, {
            offset: 0.4,
            color: 'rgba(160,34,238,1)' // 0% 处的颜色
          }, {
            offset: 0.6,
            color: 'rgba(160,34,238,0.2)' // 0% 处的颜色
          }, {
            offset: 0.8,
            color: 'rgba(160,34,238,1)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(160,34,238,0.2)' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        }
      },
      emphasis: {
        borderColor: '#fff',
        borderWidth: 0
      }
    }
  }]
}

export {
  option
};
