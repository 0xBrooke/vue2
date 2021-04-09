import Mock from 'mockjs';

let loginData = Mock.mock({
    id: Mock.mock('@guid()'),
    username: Mock.mock('@name'),
    'isLogin|1': true,
    ip: Mock.mock('@ip')
});

export default {
    // 情况一：加入处理逻辑
    login: config => {
        let response = '';
        let reqData = JSON.parse(config.body);
        if (reqData.name === '李四') {
            response = {
                code: 1,
                msg: '请求成功',
                data: {
                    name: '王五wu'
                }
            };
        } else if (loginData.ip.indexOf('9') !== -1) {
            response = {
                code: 1,
                msg: '请求成功',
                data: {
                    name: '赵六'
                }
            };
        } else {
            response = {
                code: 0,
                msg: '请求失败'
            };
        }
        return response;
    },
    // 情况二：不需要处理逻辑，直接返回数据
    register: Mock.mock({
        code: 1,
        msg: '请求成功',
        data: {
            id: Mock.mock('@guid()'),
            name: Mock.mock('@name'),
            'isRegister|1': true
        }
    })
};
