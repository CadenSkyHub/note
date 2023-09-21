# 自定义 CSS

参考：[扩展默认主题](https://vitepress.dev/guide/extending-default-theme)

## 自定义主题 / 字体

### 自定义 css
默认主题 CSS 是可以通过覆盖根级 `CSS` 变量来定制的：

在 `docs/.vitepress` 下新建 `theme` 文件夹

``` bash {4-6}
├─cache
│  └─deps
├─nav_bar
└─theme     <- 这里
    └─ index.js
    └─ custom.css
```


::: danger 提示
当创建 `theme/index.js` 可能暂时无法访问，将代码写上就可以了
:::


``` javascript
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```
``` css
/* .vitepress/theme/custom.css */
:root {
  --c-brand: #646cff;           /* 颜色 */
  --c-brand-light: #747bff; 
}


/* 字体 */
:root {
    --vp-font-family-base: "Inter var experimental", "Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    /*--vp-font-family-mono: "Menlo, Monaco, Consolas,"Courier New", monospace"*/
}
```

## 自定义字体

- 可以使用以上方式定义字体。
- 如果需要使用自己特定的字体，则点击下方详情，查看更详细的指南

[详情](https://vitepress.dev/guide/extending-default-theme#using-different-fonts)