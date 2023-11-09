# Mock 数据

安装

``` 
npm install mockjs
```



新建`mock`

```js
// src/mocks/index.jsx
import Mock from 'mockjs'

const domain = '/api/'

// 模拟login接口
Mock.mock(domain + 'login', function () {
    let result = {
        code: 200,
        message: 'OK',
        data: {
            loginUid: 10000,
            nickname: '兔子先生',
            token: 'yyds2023',
        },
    }
    return result
})
```



`src/main.jsx`引入

``` js {5}
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './mock/index.jsx'
```


