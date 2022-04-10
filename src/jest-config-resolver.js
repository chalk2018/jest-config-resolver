const path = require('path');
const fs = require('fs');
const lodash = require('lodash');

const dependenciesResolver = (testConfig) => {
    // 用<depDir>代表depDir
    const DepTag = /^\<depDir\>[\\\/]/;
    if (!testConfig.depDir) {
        testConfig.depDir = "<rootDir>/__test__/__dep__";
    }
    if (!testConfig.depMapper) {
        testConfig.depMapper = {};
    }
    return lodash.mapValues(testConfig.depMapper, (relativePath) => {
        return path.join(testConfig.depDir, relativePath.replace(DepTag, ''))
    })
}

const jestConfigResolver = (testConfig) => {
    const jestOption = {
        moduleNameMapper: {
            "^src/(.*)$": '<rootDir>/src/$1'
        }
    };
    // 获取工程目录
    const currentPath = path.resolve();
    // ts工程
    if (testConfig.ts && fs.existsSync(path.join(currentPath, 'tsconfig.json'))) {
        jestOption.preset = 'ts-jest';
        jestOption.testEnvironment = 'node';
        jestOption.globals = {
            'ts-jest': {
                tsconfig: 'tsconfig.json'
            }
        }
        // ts 别名映射
        const {
            pathsToModuleNameMapper
        } = require('ts-jest/utils');
        const {
            compilerOptions
        } = require(path.join(currentPath, 'tsconfig.json'));
        jestOption.moduleNameMapper = {
            ...jestOption.moduleNameMapper,
            ...pathsToModuleNameMapper(compilerOptions.paths, {
                prefix: "<rootDir>"
            })
        }
        // 合并depDir,depMapper别名映射
        jestOption.moduleNameMapper = {
            ...jestOption.moduleNameMapper,
            ...dependenciesResolver(testConfig)
        }
    } else {
        // js 别名映射
        if (fs.existsSync(path.join(currentPath, 'jsconfig.json'))) {
            const {
                pathsToModuleNameMapper
            } = require('ts-jest/utils');
            const {
                compilerOptions
            } = require(path.join(currentPath, 'jsconfig.json'));
            jestOption.moduleNameMapper = {
                ...jestOption.moduleNameMapper,
                ...pathsToModuleNameMapper(compilerOptions.paths, {
                    prefix: "<rootDir>"
                })
            }
        }
        // 合并depDir,depMapper别名映射
        jestOption.moduleNameMapper = {
            ...jestOption.moduleNameMapper,
            ...dependenciesResolver(testConfig)
        }
    }
    // 匹配test路径
    jestOption.testMatch = [
        "<rootDir>/__test__/**/*.{ts,js}",
        // "<rootDir>/test/**/*.{ts,js}",
    ]
    jestOption.testPathIgnorePatterns = [
        "<rootDir>/node_modules",
        "<rootDir>/coverage",
        "<rootDir>/__test__/coverage",
        // "<rootDir>/test/coverage",
        "(.*)/__dep__"
    ];
    // 覆盖率文件默认配置
    jestOption.collectCoverage = true;
    jestOption.collectCoverageFrom = [
        "**/src/**/*.{ts,js}",
        "!**/node_modules/**"
    ];
    jestOption.coverageDirectory = "<rootDir>/__test__/coverage";
    jestOption.coveragePathIgnorePatterns = [
        "<rootDir>/node_modules/",
        // "<rootDir>/test/*",
        "<rootDir>/__test__/*",
        "<rootDir>/coverage/*",
        "(.*)/__dep__"
    ];
    jestOption.coverageReporters = ["clover", "json", "lcov", ["text", {
        "skipFull": true
    }]];
    // 阈值百分比
    jestOption.coverageThreshold = {
        "global": {
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": -10
        }
    }
    jestOption.coverageThreshold = undefined
    // 属性自建属性合并
    let _testConfig = lodash.omit(testConfig, ['onlyAdded', 'depDir', 'depMapper', 'ts']);
    for (const option of (testConfig.onlyAdded || [])) {
        if (Object.prototype.toString.call(jestOption[option]) === '[object Array]') {
            jestOption[option] = [...jestOption[option], ...(_testConfig[option] || [])];
        } else if (Object.prototype.toString.call(jestOption[option]) === '[object Object]') {
            jestOption[option] = {
                ...jestOption[option],
                ...(_testConfig[option] || {})
            };
        } else {
            jestOption[option] = _testConfig[option];
        }
        _testConfig = lodash.omit(_testConfig, [option])
    }
    return {
        ...jestOption,
        ..._testConfig
    };
}

module.exports = jestConfigResolver