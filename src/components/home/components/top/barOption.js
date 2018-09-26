/**
 * Created by dhj on 2018/5/9.
 */
let oneToNOption = {
  title: {
    show: true,
    text: '1000',
    textStyle: {
      color: '#3C3E4A',
      fontSize: '36',
      fontWeight: 'bold'
    },
    subtext: '人脸1:n识别调用数(次)',
    x: 'center',
    top: '30%',
    subtextStyle: {
      color: '#999',
      fontSize: '12'
    },
  },
  color: ['#539EFB','#F6B30D'],
  legend: {
    orient: 'vertical',
    right: '10',
    y: 'bottom',
    itemWidth: 8,
    itemHeight: 8,
    align: 'left',
    data:['已匹配到','未匹配到']
  },
  series: [
    {
      type:'pie',
      radius: ['72%', '85%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: true,
          formatter: '{d}%'
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 8,
          length2: 10,
          smooth: false
        }
      },
      data:[
        {value:335, name:'已匹配到'},
        {value:310, name:'未匹配到'}
      ]
    }
  ]
};
let oneToOneOption= {
  title: {
    show: true,
    text: '1000',
    textStyle: {
      color: '#3C3E4A',
      fontSize: '36',
      fontWeight: 'bold'
    },
    subtext: '人脸1:1识别调用数(次)',
    x: 'center',
    top: '30%',
    subtextStyle: {
      color: '#999',
      fontSize: '12'
    }
  },
  color: ['#F8E33A','#AD1EF6'],
  legend: {
    orient: 'vertical',
    right: '0',
    y: 'bottom',
    itemWidth: 8,
    itemHeight: 8,
    align: 'left',
    data:['比对结果为同一人','比对结果非同一人']
  },
  series: [
    {
      type:'pie',
      radius: ['72%', '85%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: true,
          formatter: '{d}%'
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 8,
          length2: 10,
          smooth: false
        }
      },
      data:[
        {value:335, name:'比对结果为同一人'},
        {value:310, name:'比对结果非同一人'}
      ]
    }
  ]
};

export {oneToNOption, oneToOneOption};
