// jest预设文件
const jestConfigResolver = require('./lib/jest-config-resolver');
const jestConfig = jestConfigResolver({
    ts: true,
    onlyAdded: ['moduleNameMapper']
});
module.exports = jestConfig;
