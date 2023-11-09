

# React-Router



[React基础 | 参考](https://www.yuque.com/fechaichai/qeamqf/xbai87)



::: danger 注意

- [lazy – React 中文文档 (docschina.org)](https://react.docschina.org/reference/react/lazy#lazy)
- [使用 React.lazy() 实现按需加载组件，提高应用性能！ - 掘金 (juejin.cn)](https://juejin.cn/post/7224322566826934327)



可以使用懒加载导入，优化,

但是如果使用 `lazy` 还需要使用 `Suspense` 组件进行包装

``` javascript
import {lazy} from "react";
const FullLayout = lazy(() => import('@/layout/FullLayout'))
```



``` json {1,4,3}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <SomeComponent />
 </Suspense>
```

`fallback` 是在组件加载时，页面显示的内容，例如 `Loading...`



:::

## 开始

### 安装路由

```bash
npm install react-router-dom
```



### 配置路由

``` js {9}
// router/index.jsx

import {createBrowserRouter} from "react-router-dom";
import Home from "@/page/home/index.jsx";

const routers = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,	 // 注意这里！
    }
])

export default routers;


```



``` js {8-9,13-14}
// main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './mock/index.jsx'

import {RouterProvider} from "react-router-dom";
import routers from "@/routers/index.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/*<App/>   不需要 App 了*/}
        <RouterProvider router={routers}/>
    </React.StrictMode>,
)
```







## 路由模式

| 路由模式  | url表现      | 是否需要后端支持 |                      |
| --------- | ------------ | ---------------- | -------------------- |
| `history` | `url/path`   | 是               | `createBrowerRouter` |
| `hash`    | `url/#/path` | 否               | `createHashRouter`   |



``` js {3,7}
// history
import {createBrowserRouter} from "react-router-dom";
const routers = createHashRouter([...])

// hash
import {createHashRouter} from "react-router-dom";                                  
const routers = createHashRouter([...])
```











## 路由导航

### 声明式导航

通过 `<link/>` 组件描述出要跳转到哪里去

`to` 属性为跳转的路由 `path` , 最后浏览器渲染为 `a` 标签



```js {1,6-8}
import {Link} from  "react-router-dom";
const Home = () =>{
    return (
        <div>
            <h1>Home</h1>
            <Link to='/login'>
                <button>去登录页</button>
            </Link>
        </div>
    )
}

export default Home;
```



### 编程式导航

通过 `useNavigate` 钩子，调用方法，以 `命令式的形式`。这样会更加灵活。

::: tip 提示

实际使用可以封装一下。

:::

```js {1,8}
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Login</h1>
            <button onClick={() => navigate('/')}>去首页</button>
        </div>
    )
}

export default Login
```



### Routers

提供一个路由出口，组件内部会存在多个内置的Route组件，满足条件的路由会被渲染到组件内部。就像 `router-view`

``` html
<Routers>
  <Router/>
  <Router/>
  <Router/>
</Routers>
```



### Router

用于定义路由路径和渲染组件的对应关系，当url上访问的地址为 /about 时，当前路由发生匹配，对应的About组件渲染

- `element`：因为react体系内 把组件叫做react element
- `path`:匹配的路径地址

``` html
<Routers>
  <Router path='/about' element={ <About/> }/>	<!-- 当url上访问的地址为 /about 时，当前路由发生匹配，对应的 About 组件渲染 */  -->
  <Router path='/love' element={ <Love/> }/>  <!-- 当url上访问的地址为 /love 时，当前路由发生匹配，对应的 Love 组件渲染 */  -->
</Routers>
```







## 导航传参

### `query`参数

- 钩子函数 `useSearchParams()`
- 注意：获取的时候数组解构，然后 用 `get`

```js {11,23,26,27}
/* 发送参数
* Login 组件
*/
import {useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1>Login</h1>
            <button onClick={() => navigate('/?ref="login"')}>去首页
            </button>
        </div>
    )
}

export default Login

/* 接收参数
* Home 组件
*/

import {useSearchParams} from "react-router-dom";

const Home = () => {
    const [querys] = useSearchParams()	// 注意这里是数组解构！
    console.log(querys.get('ref'))
    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

export default Home;
```





### `path`参数

::: danger 注意！

跟 `vue-router` 一样需要在路由上指定

``` 
path:'/users/:id'
```

:::



- 钩子函数： `useParams()`
- 无需解构，获取到的是 对象形式，通过 `.`来获取具体值



``` jsx {10, 23,26-28}
/*
* 发送参数
*/
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <Link to='/users/2'>
                <button>去用户页</button>
            </Link>
        </div>
    )
}

export default Home;


/*
* 接收参数
*/
import {useParams} from "react-router-dom";

const User = () => {
    const params = useParams()
    console.log(params)  // {id: '2'}
    console.log(params.id)  // 2
    return (
        <>
            <h1>Users</h1>
        </>
    )
}

export default User
```



## 嵌套路由

- 使用 `children` 实现嵌套关系
- 使用 `<Outlet>` 组件，配置二级路由渲染位置



### 二级路由出口

```jsx {1,8,9,12,13}
import {Outlet,Link} from "react-router-dom";

const FullLayout = () => {
    return (
        <>
            <div>FullLayout</div>
            <ul>
                <Link to='/admin'>用户管理</Link>   // 注意这里！ 因为默认显示，所以要添加一级路由的地址
                <Link to='/admin/login'>登录管理</Link>	// 路径写全
            </ul>

            {/*二级路由出口*/}
            <Outlet></Outlet>
        </>
    )
}

export default FullLayout
```



### 路由配置

**方法一**

``` js {6,9,10}
{
  path: '/admin',
    element: <FullLayout/>,
      children: [
        {
          path: '',  // 因为是默认显示页面，所以不添加路由地址。或者看下面那个方法
          element: <User/>
        },
          {
          path: 'login',  // 不加前面的 /
          element: <Login/>
        }
      ]
}
```

**方法二**

``` javascript {6,9,10}
{
  path: '/admin',
    element: <FullLayout/>,
      children: [
        {
          index: true, // index设置为true 变成默认的二级路由
        },
          {
          path: 'login',  // 不加前面的 /
          element: <Login/>
        }
      ]
}
```





## 404路由

::: danger 注意！

一定要配置到路由的最后位置

:::



```js {20-23}
const routers = createBrowserRouter([
    {
        path: '/',
        element: <Home/>,
    },
    {
        path: '/admin',
        element: <FullLayout/>,
        children: [
            {
                path: '',  // 因为是默认显示页面，所以不添加路由地址
                element: <User/>
            },
            {
                path: 'login',  // 不加前面的 /
                element: <Login/>
            }
        ]
    },
    {
        path:'/*',
        element:<NotFound/>
    }
])
```



## 集中式路由管理

::: info 提示

场景: 当我们需要路由权限控制点时候, 对路由数组做一些权限的筛选过滤，所谓的集中式路由配置就是用一个数组统一把所有的路由对应关系写好替换 本来的Roues组件

:::

```javascript
import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom'

import Layout from './pages/Layout'
import Board from './pages/Board'
import Article from './pages/Article'
import NotFound from './pages/NotFound'

// 1. 准备一个路由数组 数组中定义所有的路由对应关系
const routesList = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <Board />,
        index: true, // index设置为true 变成默认的二级路由
      },
      {
        path: 'article',
        element: <Article />,
      },
    ],
  },
  // 增加n个路由对应关系
  {
    path: '*',
    element: <NotFound />,
  },
]

// 2. 使用useRoutes方法传入routesList生成Routes组件
function WrapperRoutes() {
  let element = useRoutes(routesList)
  return element
}


// 顶层 App
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* 3. 替换之前的Routes组件 */}
        <WrapperRoutes />
      </BrowserRouter>
    </div>
  )
}

export default App
```



