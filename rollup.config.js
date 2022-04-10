import resolve from 'rollup-plugin-node-resolve'; // 依赖引用插件
import {
    uglify
} from 'rollup-plugin-uglify'; // 压缩代码
const plugins = [
    // nodejs 插件
    resolve({
        extensions: ['.js', '.ts']
    }),
    // 压缩代码
    uglify({
        output: {
            comments: function(node, comment) {
                // 不保留注释
                return false;
            }
        }
    })
]

export default [{
    input: 'src/jest-config-resolver.js',
    output: {
        file: 'lib/jest-config-resolver.js',
        format: 'es',
        name: 'resolver',
    },
    plugins
},{
    input: 'src/jest-cli-runner.js',
    output: {
        file: 'lib/jest-cli-runner.js',
        format: 'es',
        name: 'runner',
    },
    plugins
}]