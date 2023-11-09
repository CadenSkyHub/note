# React 基础

## 推荐目录配置

```
├─ /node_modules
├─ /public
|  └─ favicon.ico        <-- 网页图标
├─ /src
|  ├─ /api               <-- api目录
|  |  └─ index.jsx       <-- api库
|  ├─ /common            <-- 全局公用目录
|  |  ├─ /fonts          <-- 字体文件目录
|  |  ├─ /images         <-- 图片文件目录
|  |  ├─ /js             <-- 公用js文件目录
|  |  └─ /styles         <-- 公用样式文件目录
|  |  |  ├─ frame.styl   <-- 全部公用样式（import本目录其他全部styl）
|  |  |  ├─ reset.styl   <-- 清零样式
|  |  |  └─ global.styl  <-- 全局公用样式
|  ├─ /components        <-- 公共模块组件目录
|  |  ├─ /header         <-- 头部导航模块
|  |  |  ├─ index.jsx    <-- header主文件
|  |  |  └─ header.styl  <-- header样式文件
|  |  └─ ...             <-- 其他模块
|  ├─ /pages             <-- 页面组件目录
|  |  ├─ /home           <-- home页目录
|  |  |  ├─ index.jsx    <-- home主文件
|  |  |  └─ home.styl    <-- home样式文件
|  |  ├─ /login          <-- login页目录
|  |  |  ├─ index.jsx    <-- login主文件
|  |  |  └─ login.styl   <-- login样式文件
|  |  └─ ...             <-- 其他页面
|  ├─ /route             <-- 路由配置目录
|  ├─ /store             <-- Redux配置目录
|  ├─ globalConfig.jsx   <-- 全局配置文件
|  ├─ main.jsx           <-- 项目入口文件
|  └─ mock.jsx           <-- mock数据文件
├─ .eslintrc.cjs         <-- ESLint配置文件
├─.gitignore
├─ index.html            <-- HTML页模板
├─ package.json
├─ vite.config.js        <-- Vite配置文件
└─ yarn.lock
```



## jsx语法

在 `jsx` 通过 大括号 `{}` 识别`js`表达式，比如常见的变量、函数调用、方法调用等

1. 使用引号传递字符串
2. 使用`js`变量
3. 函数调用和方法调用
4. 使用`js`对象



``` jsx {14,17,20,23,25}
const neirong = '内容'
const diaoyong = () => {
    return '函数调用，方法调用'
}

const obj = {
    'name': '张三'
}

function App() {
    return (
        <div>
            {/*使用引号传递字符串*/}
            {"Hello World"}

            {/*使用js变量*/}
            {neirong}

            {/*函数调用和方法调用*/}
            {diaoyong()}

            {/*使用js对象*/}
            {obj.name}

						<div style={{color:'red'}}>neirong</div>
        </div>
    );
}

export default App;
```



## 条件渲染

### 简单条件渲染

- 通过逻辑运算符 `&&`， 控制单一盒子显示
- 通过 三元表达式

``` jsx {7,10}
const isLogin = true;

function App() {
    return (
        <div>
            {/*逻辑运算符*/}
            {isLogin && <h1>已登录</h1>}

            {/*三元表达式*/}
            {isLogin ? <h1>已登录</h1> : <h2><a href="#">去登录啊</a></h2>}
        </div>
    );
}

export default App;
```



### 复杂条件渲染

自定义函数 + `if / switch` 判断语句



```jsx {4-17,22}
// 需求，根据 权限 显示不同内容
const role = 1 // 0:无权限 1:管理员 2:会员

const showTemplate = () => {
    if (role === 1) {
        return (
            <>
                <div>管理员</div>
                <div>管理员界面</div>
            </>
        )
    } else if (role === 0) {
        return <div>无权限</div>
    } else {
        return <div>会员</div>
    }
}

function App() {
    return (
        <>
            {showTemplate()}
        </>
    );
}

export default App;
```



## 事件绑定

语法：`on + 事件名称 = {事件处理结果}`，驼峰命名法



### 点击事件

`onClick`

**基本使用**

``` jsx {10}
// 需求，点击按钮，弹出对话框
// 点击事件
const handleBtn = () =>{
    alert('点了！点了！')
}

function App() {
    return (
        <>
            <button onClick={handleBtn}>点我啊</button>
        </>
    );
}

export default App;
```



**传递事件对象**

```jsx {9}
// 点击事件
const handleBtn = (e) => {
    console.log(e)
}

function App() {
    return (
        <>
            <button onClick={handleBtn}>点击了</button>
        </>
    );
}

export default App;
```





**传递自定义参数**

需要写成箭头函数形式

```jsx {2-4,8-13}
// 点击事件
const handleBtn = (e) => {
    console.log(e)
}

function App() {
    return (
        <>
            <button onClick={() => {
                handleBtn('内容啊')
            }}>点击了
            </button>
        </>
    );
}

export default App;
```



**传递事件对象和自定义参数**

顺序参数

```jsx {9}
// 点击事件
const handleBtn = (param, e) => {
    console.log(param, e)
}

function App() {
    return (
        <>
            <button onClick={(e) => handleBtn('我是自定义参数', e)}>点击</button>
        </>
    );
}

export default App;
```



## useState

[useState 教程](https://www.yuque.com/fechaichai/qeamqf/xbai87#useState)

状态绑定

- 也就是双向绑定吧。
- 要定义在组件中，脱离组件会报错

::: danger 规则

- 修改时，要用 `setxxx` 来替换，直接修改 `xxx` 是不能引起视图更新的
- 对于对象的修改，应该始终传给`setxxx` 一个全新的对象。

:::



**简单数据**

``` jsx {4,16,17}
import {useState} from "react";
function App() {
    // 定义，要在组件中。。
    const [count, setCount] = useState(0)
    // 0：初始值
    // count : 原始值, 状态变量
    // setCount : 要更改的值，修改状态变量

    // count + 1
    const handleAddOne = () =>{
        setCount(count + 1)
    }

    return (
        <>
            <div>{count}</div>
            <button onClick={handleAddOne}>点我 +1 </button>
        </>
    );
}

export default App;
```



**对象数据**

```jsx {9,11-15}
import {useState} from "react";

const zhangsan = {
    name: '张三',
    age: 15
}

function App() {
    const [san, setSan] = useState(zhangsan)

    const handleAddOne = () => {
        setSan({	// 是对象，传对象 ({...})
            ...count,	// 不需要改的就这么传进去就行
            age: san.age + 1	// 注意这里
        })
    }

    return (
        <>
            <div>{san.name}</div>
            <div>{san.age}</div>
            <button onClick={handleAddOne}>点我年龄 +1</button>
        </>
    );
}

export default App;
```



## useEffect

[useEffect 教程](https://www.yuque.com/fechaichai/qeamqf/xbai87#useEffect)



::: tip 解释

副作用是相对于主作用来说的，一个函数除了主作用，其他的作用就是副作用。对于 React 组件来说，**主作用就是根据数据（state/props）渲染 UI**，除此之外都是副作用（比如，手动修改 DOM）

常见副作用

1. 数据请求 ajax发送
2. 手动修改dom
3. localstorage操作

:::
