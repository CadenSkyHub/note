# fastapi Oauth



Fastapi 密码加密、生成 token

## 密码加密及校验

```bash
# 密码加密库
pip install "passlib[bcrypt]"
```



``` python
from passlib.context import CryptContext

# 第一步
# 密码加密选项设置（初始化）
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# 第二步
# 密码加密
def hash_password(password: str) -> str:
    """
    密码加密
    :param password: 明文密码
    :return: 加密后的密码
    """
    return pwd_context.hash(password)


# 第三步
# 从数据库获取用户，这里使用的是 mongodb,pymongo, 根据实际情况来
def get_user(db, username: str) -> tuple | None:
    """
    从数据库获取用户
    :param db: 数据库
    :param username: 用户名
    :return: 获取到的用户密码和用户，或者 None
    """
    user = db.find_one({'username': username})
    if user:
        # mongodb 的 _id 为 ObjectID 类型，需要转化为 str 类型
        user['_id'] = str(user['_id'])
        return user['password'], user

    return None,None


# 第四步
# 密码校验
def verify_password(plain_password, hashed_password) -> bool:
    """
    密码校验
    校验成功返回 True
    校验失败返回 False
    :param plain_password: 明文密码
    :param hashed_password: hash 加密后的密码
    :return: bool
    """
    return pwd_context.verify(plain_password, hashed_password)


# 第五步
# 执行校验
def verify_user(db, username: str, password: str) -> dict | bool:
    """
    正确则返回用户信息，校验不成则返回 False
    :param db: 数据库
    :param username: 用户名
    :param password: 密码
    :return: 校验结果
    """
    # 获取用户
    hashed_password, user_info = get_user(db, username)

    # 如果用户获取不到，
    if user_info is None:
        return False


    # 如果校验不成功
    if not verify_password(password, hashed_password):
        return False

    # 如果成功，删除 password 并返回用户
    del user_info['password']
    return user_info
```



### 类实现

``` python
from passlib.context import CryptContext


class UserPwd:
    def __init__(self, db=None):
        # 密码加密选项设置
        self.__pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")
        self.__db = db

    # 密码加密
    def hash_password(self, password: str) -> str:
        """
        密码加密
        :param password: 明文密码
        :return: 加密后的密码
        """
        return self.__pwd_context.hash(password)

    # 从数据库获取用户，这里使用的是 mongodb,pymongo, 根据实际情况来
    def get_user(self, username: str) -> tuple | None:
        """
        从数据库获取用户
        :param username: 用户名
        :return: 获取到的用户密码和用户，或者 None
        """
        user = self.__db.find_one({'username': username})
        if user:
            # mongodb 的 _id 为 ObjectID 类型，需要转化为 str 类型
            user['_id'] = str(user['_id'])
            return user['password'], user

        return None,None

    # 密码校验
    def verify_password(self, plain_password, hashed_password) -> bool:
        """
        密码校验
        校验成功返回 True
        校验失败返回 False
        :param plain_password: 明文密码
        :param hashed_password: hash 加密后的密码
        :return: bool
        """
        return self.__pwd_context.verify(plain_password, hashed_password)

    # 校验
    def verify_user(self, username: str, password: str) -> dict | bool:
        """
        正确则返回用户信息，校验不成则返回 False
        :param username: 用户名
        :param password: 明文密码
        :return: 校验结果
        """
        # 获取用户
        hashed_password, user_info = self.get_user(username)

        # 如果用户获取不到，
        if user_info is None:
            return False

        # 如果校验不成功
        if not self.verify_password(password, hashed_password):
            return False

        # 如果成功，删除 password 并返回用户
        del user_info['password']
        return user_info
```





## python-jose库



- 用户在前端输入 `username` 与`password`，并点击**回车**
- （用户浏览器中运行的）前端把 `username` 与`password` 发送至 API 中指定的 URL（使用 `tokenUrl="token"` 声明）
- API 检查 `username` 与`password`，并用令牌（`Token`） 响应
- 令牌只是用于验证用户的字符串
- 一般来说，令牌会在一段时间后过期
  - 过时后，用户要再次登录
  - 这样一来，就算令牌被人窃取，风险也较低。因为它与永久密钥不同，**在绝大多数情况下**不会长期有效
- 前端临时将令牌存储在某个位置
- 用户点击前端，前往前端应用的其它部件
- 前端需要从 API 中提取更多数据：
  - 为指定的端点（Endpoint）进行身份验证
  - 因此，用 API 验证身份时，要发送值为 `Bearer` + 令牌的请求头 `Authorization`
  - 假如令牌为 `foobar`，`Authorization` 请求头就是： `Bearer foobar`



``` bash
# JWT 库
pip install "python-jose[cryptography]"
```





::: details SECRET_KEY可通过此方式生成

使用以下命令，生成安全的随机密钥：

``` bash
openssl rand -hex 32
```

然后，把生成的密钥复制到常量 **SECRET_KEY**

:::



``` python
from bson import ObjectId
from datetime import timedelta, datetime  # 时间类型，时间模块，创建token传入的过期时间类型
from jose import JWTError, jwt  # 主包
from fastapi import Depends, HTTPException, status  # 依赖、响应状态
from fastapi.security import OAuth2PasswordBearer  # 校验 token 依赖

# 第一步
# 常量定义，建议写到其他文件来导入
SECRET_KEY = "37b8dcadfbc6825c3a18da2dd4622a7a101c75bfdb13682c023e31d27a0cef7f"	# openssl rand -hex 32
ALGORITHM = "HS256" # 算法
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 时间间隔参数，不传默认 30 分钟


# 第二步
# 创建校验 token 的依赖，指定 token 路由
# 这个要求必须是 username 和 password 字段，可以改，但是比较麻烦
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/sign')

# 第三步
# 创建 token
def create_token(data: dict, expires_delta: timedelta | None = None) -> tuple:
    """
    创建 token
    :param data: 对用JWT的Payload字段，这里是tokens的载荷，在这里就是用户的信息
    :param expires_delta: 一个可选的时间间隔参数，用于指定JWT的过期时间。如果没有提供，则默认为30分钟后过期。
    :return:
    """
    # 将 data 深拷贝
    to_encode = data.copy()

    # 如果携带了 token 过期时间
    if expires_delta:
        expires = datetime.utcnow() + expires_delta
    else:
        expires = datetime.utcnow() + timedelta(minutes=30)

    # 在深拷贝用户信息，增加一个 exp , 为 token 过期时间
    to_encode['exp'] = expires

    # 获取 token 到期时间，这个主要是用于前端设置会话过期，可加可不加。return 出去
    from calendar import timegm
    exp = timegm(expires.utctimetuple())

    # 生成 token 并 返回
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM), exp


# 第四步
# 校验 token, 返回用户信息
def verify_token_get_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    校验 token, 返回用户信息
    :param token: token 的依赖
    :return: 用户信息
    """
    # 自定义报错信息
    token_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={'resCode': 0, 'resMsg': '用户未登录或 token 已失效'}
    )

    try:
        # 解析 token
        pay_load = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # 获取到用户的 _id
        user_id = pay_load.get('_id')

        # 判断是不是空值
        if user_id is None:
            raise token_exception

        # 从数据库获取用户（这里是用的 mongodb,pymongo, 需根据实际情况来操作）
        from database import dbClient
        user = dbClient.user_col.find({'_id': ObjectId(user_id)})
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={'resMsg': '用户不存在'})
        return user

    except JWTError:
        raise token_exception
```



### 类实现

``` python
# 常量定义，建议写到其他文件来导入
SECRET_KEY = "37b8dcadfbc6825c3a18da2dd4622a7a101c75bfdb13682c023e31d27a0cef7f"	# openssl rand -hex 32
ALGORITHM = "HS256" # 算法
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # 时间间隔参数，不传默认 30 分钟


# 创建校验 token 的依赖，指定 token 路由
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/sign')


class Token:
    def __init__(self, db=None):
        # 数据库
        self.__db = db

    # 创建 token
    @staticmethod
    def create_token(data: dict, expires_delta: timedelta | None = None) -> tuple:
        """
        创建 token
        :param data: 对用JWT的Payload字段，这里是tokens的载荷，在这里就是用户的信息
        :param expires_delta: 一个可选的时间间隔参数，用于指定JWT的过期时间。如果没有提供，则默认为30分钟后过期。
        :return:
        """
        # 将 data 深拷贝
        to_encode = data.copy()

        # 如果携带了 token 过期时间
        if expires_delta:
            expires = datetime.utcnow() + expires_delta
        else:
            expires = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

        # 在深拷贝用户信息，增加一个 exp , 为 token 过期时间
        to_encode['exp'] = expires

        # 获取 token 到期时间，这个主要是用于前端设置会话过期，可加可不加。return 出去
        from calendar import timegm
        exp = timegm(expires.utctimetuple())

        # 生成 token 并 返回
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM), exp

    # 解析，获取数据 token
    # 返回用户信息，获取当前 token用户,token 依赖
    def get_current_user(self, token: str = Depends(oauth2_scheme)) -> dict:
        """
        校验 token, 返回用户信息
        :param token: token 的依赖
        :return: 用户信息
        """
        # 自定义报错信息
        token_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={'resCode': 0, 'resMsg': '用户未登录或 token 已失效'}
        )

        try:
            # 解析 token
            pay_load = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

            # 获取到用户的 _id
            user_id = pay_load.get('_id')

            # 判断是不是空值
            if user_id is None:
                raise token_exception

            # 从数据库获取用户（这里是用的 mongodb,pymongo, 需根据实际情况来操作）
            user = self.__db.find_one({'_id': ObjectId(user_id)})
            if user is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={'resMsg': '用户不存在'})

            # 将 _id 转为 字符串
            user['_id'] = str(user['_id'])

            return user

        except JWTError:
            raise token_exception
```





## 自定义验证依赖（自由）

```python
from fastapi import Request, HTTPException
from fastapi import status

"""
自定义验证依赖
"""
async def get_token_scheme(request: Request):
    """
    1. 校验请求头中是否有 "Authorization"
        如果有，则获取 scheme -> Bearer 和 token
        如果没有，返回错误
    2.校验 scheme
    3.没问题 返回 token
    """
    # 自定义错误
    header_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="缺失请求头 Authorization",
        headers={"WWW-Authenticate": "Bearer"},
    )

    bearer_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authorization 格式有误",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 校验请求头中的 "Authorization"
    authorization = request.headers.get("Authorization")
    # 如果请求头中没有 "Authorization"
    if not authorization:
        raise header_error

    # 获取 scheme 和 token
    scheme, _, param = authorization.partition(" ")

    # 校验 scheme
    if scheme.lower() != "bearer":
        raise bearer_error

    # 上述都没问题，则返回 param
    return param
  
  
  
  
  
# 使用依赖
# 解析 token
async def get_current_user(token: str = Depends(get_token_scheme)) -> dict:
    # 自定义报错信息
    token_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='用户未登录或 token 已失效'
    )
    print(123)

    try:
        # 解析 token
        pay_load = jwt.decode(token, TOKEN_SETTINGS['SECRET_KEY'], algorithms=[TOKEN_SETTINGS['ALGORITHM']])

        # 获取到用户的 id
        user_id = pay_load.get('id')

        # 判断是不是空值
        if user_id is None:
            raise token_exception

        # 从数据库获取用户
        from app import User
        user = await User.get_or_none(id=user_id).values()

        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='用户不存在')

        del user['password']
        return user

    except JWTError:
        raise token_exception
        
        
        
"""
创建路由依赖
"""
async def get_active_current_user(user=Depends(token.get_current_user)):
    if user:
        return user
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail='用户未登录或 token 已失效')

```





## 使用

### 注册功能

``` python
from database import dbClient, Document
from oauth2 import UserPwd
from admin import User
from fastapi import APIRouter

user_doc = Document(dbClient.user_col)

registerApiRouter = APIRouter()


@registerApiRouter.post('/')
async def register(user: User):
    try:
        hash_pwd = UserPwd()
        new_user = user.model_dump()
        new_user['password'] = hash_pwd.hash_password(new_user['password'])  # 密码加密

        res = user_doc.post(new_user)
        if res:
            return {'resCode': 2000, 'resMsg': '创建用户成功！'}
    except:
        return {'resCode': 5000, 'resMsg': '系统错误'}
```







### 登录功能

::: info 提示

这里用到请求表单，需要安装 ：`python-multipart`， 更安全

``` bash
pip install python-multipart
```

:::



::: danger 警告

OAuth2PasswordBearer ，`OAuth2PasswordRequestForm` 类规范的 "密码流" 模式规定要通过表单字段发送 `username` 和 `password`。

该规范要求字段必须命名为 `username` 和 `password`，并通过表单字段发送，不能用 JSON。

如果要用其他字段，[请自定义验证路由](#自定义验证依赖（自由）)

:::

``` python {16-40}
from database import dbClient, Document
from oauth2 import UserPwd, Token
from fastapi import APIRouter, Depends, HTTPException, status

user_doc = Document(dbClient.user_col)
user_pwd = UserPwd(dbClient.user_col)
tokens = Token(dbClient.user_col)

signApiRouter = APIRouter()

from fastapi.security import OAuth2PasswordRequestForm


@signApiRouter.post('')
async def sign(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        # 检查账号密码
        verify_res = user_pwd.verify_user(form_data.username, form_data.password)
        # 如果账户不存在或密码错误
        if not verify_res:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail={'resCode': 0, 'resMsg': '账户或密码错误！'})

        # 创建 token
        # 传入用户和 token 有效时间
        # 获取到 token 和 exp：过期时间
        token, exp = tokens.create_token(verify_res, timedelta(minutes=30))

        # 返回 token 和 过期时间
        return {
            'access_token': token,
            'token_type': 'bearer',
            'exp': exp,
            'resCode': 1,
            'resMsg': '登录成功！'
        }
    except HTTPException:
        return {'resCode': 0, 'resMsg': '账户或密码错误！'}

    except:
        return {'resCode': 5000, 'resMsg': '系统错误'}
```





### 自定义登录表单/form-data

::: info 提示

这里用到请求表单，需要安装 ：`python-multipart`， 更安全

``` bash
pip install python-multipart
```

:::



``` python
@userRouters.post('/login')
async def login(mobile: str = Form(..., ), password: str = Form(...)):
    # 校验密码
    user = await verify_user(mobile, password)
    if user:
        user['create_time'] = user['create_time'].strftime('%Y-%m-%d %H:%M:%S')

        tk, exp = await token.create_token(user, timedelta(minutes=60 * 24 * 3))

        return {
            'token': tk,
            'exp': exp
        }
    else:
        return '用户名或密码错误'
```





### 创建依赖

``` python
# 导入数据库
from database import dbClient

# 实例化，因为 Token 有验证用户，所以需要传入数据库
token_dep = Token(dbClient.user_col)

# 创建路由依赖
# current : 当前
def get_active_current_user(user=Depends(token_dep.get_current_user)):
    if user:
        return user
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail={'resCode': 0, 'resMsg': '用户未登录或 token 已失效'})
```





### 使用依赖

将依赖注入路由

``` python {4，10-11,14,16}
# 导入依赖
from oauth2 import get_active_current_user

app.include_router(adminRouter, prefix='/admin',dependencies=[Depends(get_active_current_user)])

# 在相关操作中获取用户
from fastapi import APIRouter,Depends
from oauth2 import get_active_current_user

@adminProcessApiRouter.post('', summary='新增流程')
async def post_process(process: model.Process, userinfo = Depends(get_active_current_user)):
    try:
        print(userinfo)
        res = process_doc.post_and_chick_repeat(process.model_dump(), 'name')
        return ret.post(res)
    except:
        return ret.sys_error()
```





## vue 登录

逻辑

::: details 需要用到 qs

``` bash
npm install qs
```

:::

`/view/login.vue`

``` vue {5,9-12,15-21,32,34,36}
<script setup lang="ts">

import {ref} from "vue";
import http from "@/http/http";
import qs from 'qs'
import {ElMessage} from "element-plus";
import router from "@/router";

const user = ref<{
    username: string
    password: string
}>()

const handleLoginBtn = () => {
    http({
        url: '/sign',
        method: 'post',
        data: qs.stringify(user.value),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => {
        if (res.data.resCode === 1) {
            // 轻提示
            ElMessage({
                message: '登录成功',
                type: 'success',
            })

            // console.log(res.data.access_token)
            // 将 token 写入本地存储
            let token = 'Bearer' + ' ' + res.data.access_token
            // 保存到本地
            localStorage.setItem('token', token)
            // 将过期时间也保存到本地
            localStorage.setItem('exp', res.data.exp)
            // 跳转到首页
            router.push({
                name: 'process'
            })


        } else {
            // console.log(res.data)
            ElMessage({
                message: '登录失败，账号或密码错误',
                type: 'error',
            })
        }
    })
}
```





### 请求拦截

每次请求时，都要携带上 token

`/http/http.ts`

``` javascript {8-18,23-32}
// console.log(localStorage.exp)  // 获取 localStorage 时间戳
// console.log(Math.round(new Date() / 1000))  // 获取当前时间戳

/*
* 判断是否登录, 判断是否过期
* 本地有 token，且没过期
* */
const isLogin = (): boolean => {
    const isToken: string = localStorage.getItem('token')
    const exp: string = localStorage.getItem('exp')
    if (isToken) {
        // 判断是否过期
        const now: number = Math.round(new Date() / 1000)
        return now < exp;
    } else {
        return false
    }
}


// 请求拦截
http.interceptors.request.use(config => {
    if(isLogin){
        // 获取到，并且添加到请求头
        config.headers.Authorization = localStorage.token
    }else{
        // 跳转到登录页
        router.push({
            name: 'login'
        })
    }
    return config
}, error => {
    return error
})
```





### 路由守卫

[vue-路由守卫](https://blog.csdn.net/qq_21161977/article/details/112390177)

``` typescript {5-15,25}
/*
* 判断是否登录, 判断是否过期
* 本地有 token，且没过期
* */
const isLogin = (): boolean => {
    const isToken: string = localStorage.getItem('token')
    const exp: string = localStorage.getItem('exp')
    if (isToken) {
        // 判断是否过期
        const now: number = Math.round(new Date() / 1000)
        return now < exp;
    } else {
        return false
    }
}


// 路由守卫
router.beforeEach((to, from, next) => {
    // 先判断本地是否有 token
    const isToken = localStorage.token
    // 是否是去往 login
    if (to.path == '/login') {
        // next()
        isLogin() ? next(from) : next()	// 这么写，是控制已经登录的不让他去 登录页
    } else {
        isToken ? next() : next('/login')
    }
})
```

