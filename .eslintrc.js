module.exports = {
    root: true, // 以当前目录为根目录，不再向上查找 .eslintrc.js
    env: {
        node: true,
        browser: true,
        es6: true
    },
    globals: { // 项目需要的全局变量
        vue: true, // false 表示这个全局变量不允许被重新赋值
        window: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/prettier',
        'plugin:prettier/recommended'
    ],
    plugins: ['prettier'],
    parserOptions: {
        sourceType: 'module', // 如果你的代码是 ECMAScript 模块
        parser: 'babel-eslint', // 使用babel-eslint作为解析器，一个对Babel解析器的包装，使其能够与 ESLint 兼容
        ecmaFeatures: {
            // 你想使用的额外的语言特性
            experimentalObjectRestSpread: false, // 启用对对象的扩展
            jsx: true, // 启用jsx语法
            globalReturn: false, // 允许在全局作用域下使用 return 语句
            impliedStrict: false // 启用严格校验模式
        }
    },
    rules: {
        'prettier/prettier': 'error', // 当eslint和编辑器格式化配置冲突时报错，设置为'off'关闭报错
        'no-console': 'off', // 禁止生产使用 console
        'no-alert':  'off', // 禁止生产使用 alert
        'no-debugger': 'off', // 禁止生产使用 debugger
        'arrow-parens': ['error', 'as-needed'], // 箭头函数参数括号,能省则省
        indent: [2, 4, { SwitchCase: 1 }], // 一个缩进必须用4个空格替代, SwitchCase为1个缩进级别
        semi: ['error', 'always'], // 要求在语句末尾使用分号
        quotes: ['error', 'single', { allowTemplateLiterals: true }], // 要求尽可能地使用单引号'', 允许字符串使用反勾号``
        'quote-props': ['error', 'as-needed'], // 当没有严格要求时，禁止对象字面量属性名称使用引号
        'space-before-function-paren': 0, // 禁止在参数的 ( 前面有空格，prettier不支持有空格
        'no-useless-escape': 'error', // 禁用不必要的转义字符
        'no-unused-vars': 2, // 定义了但未使用的变量报错
        'no-extend-native': 2, // 禁止扩展原生对象Object.prototype
        'no-unused-expressions': [2, { "allowShortCircuit": true }], // 禁止出现未使用过的表达式, 允许在表达式中使用逻辑短路求值如a && b()
        'no-inner-declarations': ["error", "both"], // 禁止 function 和 var 声明出现在嵌套的语句块中
        'valid-jsdoc': 1, // 注释规范，有问题报警告
        'accessor-pairs': 2, // 如果只定义 setter 而不定义 getter，将会报错
        curly: 1, //  强制代码块使用大括号，以避免bug的发生，并且增加代码的清晰度
        'dot-notation': 1, // 首选使用点号foo.bar访问属性，因为它更加易读，简洁，也更适于 JavaScript 压缩
        eqeqeq: 1, // 使用类型安全的 === 和 !== 操作符代替 == 和 != 操作符
        'no-else-return': 1, // 如果 if 块中包含了一个 return 语句，else 块就成了多余的了。可以将其内容移至块外
        'no-eq-null': 2, // 如null进行比较时用 === 和 !==
        'no-eval': 2, // 禁用eval()
        'no-implied-eval': 2, // 禁用隐式的eval()
        'no-invalid-this': 2, // 禁止 this 关键字在类或类对象之外出现
        'no-lone-blocks': 2, // 禁用不必要的嵌套块
        'no-dupe-keys': 0,
        'no-undef': 'off',
    }
};
