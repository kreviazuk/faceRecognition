var Mock = require('mockjs');

module.exports = () => {
  // 使用 Mock
  var data = Mock.mock({
    'course|227': [{
      // 属性 id 是一个自增数，起始值为 1，每次增 1
      'serviceID|+1': 1000,
      serviceCaller: '@ctitle(5,10)',
      applicationDescription: '@ctitle(15,20)'
    }]
  });
  // 返回的data会作为json-server的数据
  return data;
};