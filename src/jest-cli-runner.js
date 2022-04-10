// jest cli加载优化config文件
const jest = require('jest');
const path = require('path');
const configResolver = require('./jest-config-resolver');
const testConfig = require(path.resolve('test.config.js'));
const jestConfig = configResolver(testConfig);
const run = () => {
    jest.runCLI({
        config: JSON.stringify(jestConfig)
    }, [path.resolve()]).then(res => {
        // console.log(res);
    }).catch(err => {
        // console.log(err)
    })
}
module.exports = run;