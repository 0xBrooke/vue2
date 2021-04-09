module.exports = {
    printWidth: 80, // 一行的字符数，如果超过会进行换行 ✔
    singleQuote: true, // 字符串使用单引号 ✔
    quoteProps: 'as-needed', // 当没有严格要求时，禁止对象字面量属性名称使用引号 ✔
    trailingComma: 'none', // 不使用尾逗号, 如[a,b,c,d,]数组项d后面的逗号 ✔
    bracketSpacing: true, // 在对象字面量声明所使用的的花括号后（{）和前（}）输出空格 ✔
    jsxBracketSameLine: true, // 将多行JSX元素的>放在最后一行的末尾，而不是单独放在下一行（不适用于自闭元素）
    semi: true, // 在每一条语句后面添加分号 ✔
    tabWidth: 4, // 一个tab代表4个空格 ✔
    arrowParens: 'avoid', // 箭头函数参数括号,能省则省
    useTabs: false, // 使用tab缩进而非空格 ✔
    htmlWhitespaceSensitivity: 'ignore'
};
