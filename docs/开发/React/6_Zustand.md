# Zustand



[zustand (React)](https://awesomedevin.github.io/zustand-vue/docs/introduce/start/zustand)

[参考教程 | 教学](https://www.yuque.com/fechaichai/qeamqf/ngfwmf#MRV2O)



## 开始

### 安装

``` bash
npm install zustand # or yarn add zustand
```



### 初始化

``` javascript
import {create} from "zustand";

// 创建一个 useCountStore 钩子
export const useCountStore = create((set) => ({
    age: 1,
    // 定义一个 +1 的方法，注意要传入 state 参数，就是当前 store
    add: () => set((state) => ({
        age: state.age + 1
    })),
    // 定义一个 -1 的方法
    minus: () => set((state) => ({
        age: state.age - 1
    })),
    // 定义一个 + 传入参的方法
    addPlus: (num) => set((state) => ({
        age: state.age + num
    }))
}))
```





### 绑定组件

[Zustand 调用方式说明](https://awesomedevin.github.io/zustand-vue/docs/basic/fetch)

``` javascript
const Home = () => {
    // 引用
    const age = useCountStore((state) => state.age)	 // 为什么这么用。看上方说明
    const add = useCountStore((state) => state.add)
    const minus = useCountStore((state => state.minus))

    return (
        <div>
            <h1>Home</h1>
            <h2>{age}</h2>
            <button onClick={minus}>减</button>
            <button onClick={add}>加</button>
        </div>
    )
}

export default Home;
```



## 异步支持

### 创建

```JavaScript {4-10,15-18}
import {create} from "zustand";

// 创建异步
const getData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(100)
        }, 3000)
    })
}

export const useCountStore = create((set) => ({
    age: 1,
    // 异步支持
    fetchAge: async () => {
        const data = await getData()
        set({age: data})
    }
}))
```



### 绑定组件

```javascript {6,12}
import {useCountStore} from "@/store/count.js";

const Home = () => {
    // 引用
    const age = useCountStore((state) => state.age)
    const fetchData = useCountStore((state) => state.fetchAge)

    return (
        <div>
            <h1>Home</h1>
            <h2>{age}</h2>
            <button onClick={fetchData}>点我获取数据</button>
        </div>
    )
}

export default Home;
```



