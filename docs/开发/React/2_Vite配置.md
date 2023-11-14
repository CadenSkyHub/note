# Vite 配置



## css预处理

[功能 | Vite css 预处理](https://cn.vitejs.dev/guide/features.html#css-pre-processors)

需要安装相关预处理的依赖。

``` bash
# .scss and .sass
npm add -D sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```





## 设置host:port

```js {8-11}
// vite.config.js

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
    plugins: [react()],
})
```





## 设置路径别名

```js {1,5-9}
import path from 'path'

// vite.config.js
export default defineConfig({
    resolve:{
        alias:{
            '@':path.resolve(__dirname, 'src'),
        }
    },
})
```



::: tip 提示：如果使用TS

如果使用ts,还需要同时修改 `tsconfig.json` 这样 `IDE` 才能识别别名

``` json
"compilerOptions": {
  "paths": {
    "@/*": [
      "src/*"
    ]
  }
}
```

:::



> 这里需要注意的是，基于Vite脚手架的工程在src目录里并没有使用js文件，而是以jsx文件进行开发。默认情况下，js文件是不能正常加载的。在后续章节会讲解如何通过修改Vite配置来兼容js文件，但是仍然不推荐这么做。除此之外，在src目录之外的`vite.config.js`则相反，没有使用jsx文件。


## codesever
如果使用的是 `codesever`，需要做以下配置。注意端口号和 `base` 地址，要一致

``` json {13,16}
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  base: '/absproxy/5177',
  server: {
    host:'0.0.0.0',
    port: 5177
  }
})

```


