# 查询（DQL）



``` sql 
select
    字段列表
from
    表名列表
where
    条件列表
group by 
    分组字段列表
having 
    分组后条件列表
order by 
    排序字段列表
limit
    分页参数
```



::: details 演示数据

``` sql
create table `emp`(
  id int comment '编号',
  workno varchar(10) comment '工号',
  name varchar(10) comment '姓名',
  gender char(1) comment '性别',
  age tinyint unsigned comment '年龄',
  idcard char(18) comment '身份证号',
  workaddress varchar(50) comment '工作地址',
  entrydate date comment '入职时间'
) comment '员工表';


INSERT INTO `emp`
(id,workno,name,gender,age,idcard,workaddress,entrydate)
VALUES
    (1,'00001','柳岩666','女',20,'123456789012345678','北京','2000-01-01'),
    (2,'00002','张无忌','男',18,'123456789012345670','北京','2005-09-01'),
    (3,'00003','韦一笑','男',38,'123456789712345670','上海','2005-08-01'),
    (4,'00004','赵敏','女',18,'123456757123845670','北京','2009-12-01'),
    (5,'00005','小昭','女',16,'123456769012345678','上海','2007-07-01'),
    (6,'00006','杨逍','男',28,'12345678931234567X','北京','2006-01-01'),
    (7,'00007','范瑶','男',40,'123456789212345670','北京','2005-05-01'),
    (8,'00008','黛绮丝','女',38,'123456157123645670','天津','2015-05-01'),
    (9,'00009','范凉凉','女',45,'123156789012345678','北京','2010-04-01'),
    (10,'00010','陈友谅','男',53,'123456789012345670','上海','2011-01-01'),
    (11,'00011','张士诚','男',55,'123567897123465670','江苏','2015-05-01'),
    (12,'00012','常遇春','男',32,'123446757152345670','北京','2004-02-01'),
    (13,'00013','张三丰','男',88,'123656789012345678','江苏','2020-11-01'),
    (14,'00014','灭绝','女',65,'123456719012345670','西安','2019-05-01'),
    (15,'00015','胡青牛','男',70,'12345674971234567X','西安','2018-04-01'),
    (16,'00016','周芷若','女',18,null,'北京','2012-06-01');
```

:::



## 1. 基本查询



### 查询全部字段

``` sql
select * from `表名`;
```



### 查询指定字段

``` sql
# 单个
select `字段名` from `表名`;

# 多个
select `字段1`,`字段2`,...`字段n` from `表名`;
```



### 设置别名

**关键字 `AS`**

- 紧跟列名，也可以在列名和别名之间加入关键字 `AS`, 别名使用`双引号`。以便在别名中包含空格或特殊字符。区分大小写。
- `AS` 可以省略

``` sql
select `字段1` [as 别名1],`字段2` [as 别名2],...`字段n` [as 别名n] from `表名`;


# 简写
select 字段1 "别名1",字段2 "别名2" From `表名`;
```



### 去除重复数据

``` sql
select distinct 字段列表 from `表名`;
```



### 练习

::: details 查询指定字段 `name`  ,`workno`  ,`age` 返回

``` sql
select `name`,`workno` from `emp`;
```

::: 



::: details 查询所有字段返回

``` sql
select * from `emp`;
```

:::



::: details 查询所有员工的工作地址，起别名 工作地址

``` sql
select `workaddress` "工作地址" from `emp`;
```

:::



::: details 查询公司员工的上班地址，不要重复

``` sql
select distinct `workaddress` from `emp`;
```

:::



## 2. 条件查询(where)

``` sql
# 语法：

select 字段列表
from `表名`
where 条件列表
```



### 比较运算符

|     比较运算符     | 说明                                           |
| :----------------: | :--------------------------------------------- |
|        `>`         | 大于                                           |
|        `>=`        | 大于等于                                       |
|        `<`         | 小于                                           |
|        `<=`        | 小于等于                                       |
|        `=`         | 等于                                           |
|     `<>`或`!=`     | 不等于                                         |
| `between...and...` | 判断一个值是否在这两个值之间（含最小、最大值） |
|     `in(...)`      | 判断一个值是否为列表中的任意一个值             |
|   `like 占位符`    | 模糊查询                                       |
|     `is null`      | 判断值、字符串或表达式是否为空                 |



### 模糊查询

- `%` 代表不确定个数的字符
- `_` 代表不确定的字符



`%` 示例

``` sql
# 第一位为a
like 'a%'

# 最后一位为a
like '%a'

# 包含a
like '%a%'
```



`_` 示例

``` sql
# 第二位为a
like '_a%'

# 第五位为a
like '____a%'

# 只有两位
like '__'

# 只有三位
like '___'

# 倒数第二位为a
like '%a_'
```





###  逻辑运算符

| 逻辑运算符  | 说明                        |
| :---------: | :-------------------------- |
| `AND`或`&&` | 且（多个条件成立）          |
| `OR`或`||`  | 或 （多个条件任意一个成立） |
| `NOT`或`!`  | 非                          |





### 练习

::: details 查询年龄等于 88 的员工

``` sql
select * from `emp` where `age` = 88;
```

:::



::: details 查询年龄小于 20 的员工

``` sql
select * from `emp` where `age` < 20;
```

:::



::: details 查询年龄小于等于 20 的员工

``` sql
select * from `emp` where `age` <= 20;
```

:::



::: details 查询没有身份证号的员工

``` sql
select * from `emp` where `idcard` is null ;
```

:::



::: details 查询有身份证号的员工

``` sql
select * from `emp` where `idcard` is not null ;
```

:::



::: details 查询年龄不等于 88 的员工

``` sql
select * from emp where age != 88;
# 或
select * from emp where age <> 88;
```

:::



::: details 查询年龄在 15（包含） 到 20（包含）之间的员工信息

``` sql
select * from emp where age >= 15 and age <= 20;
# 或
select * from emp where age between 15 and 20;
```

:::



::: details 查询性别为 女 且 年龄小于 25 岁的员工信息

``` sql
select * from emp where gender = '女' and age < 25;
```

:::



::: details 查询年龄等于 18 或 20 或 40 的员工信息

``` sql
select * from emp where age = 18 or age = 20 or age = 40;
# 或
select * from emp where age in (18,20,40);
```

:::



::: details 查询姓名为两个字的员工信息

``` sql
select * from emp where name like '__';
```

:::



::: details 查询身份证号最后一位是 x 的员工信息

``` sql
select * from emp where idcard like '%x';
```

:::



## 3. 聚合函数

将一列数据作为一个整体，进行纵向计算。

::: danger 注意

**所有 `NULL` 值不参与运算**

:::



### 聚合函数

|  函数   | 说明     |
| :-----: | :------- |
| `count` | 统计数量 |
|  `max`  | 最大值   |
|  `min`  | 最小值   |
|  `avg`  | 平均值   |
|  `sum`  | 求和     |



### 语法

``` sql
select 聚合函数(字段列表) from `表名`;
```



### 练习

::: details 统计该企业员工数量

``` sql
select count(`id`) from emp;
```

:::



::: details 统计该企业员工的平均年龄

``` sql
select avg(`age`) from emp;
```

:::



::: details 统计该企业员工的最大年龄

``` sql
select max(`age`) from emp;
```

:::



::: details 统计该企业员工的最小年龄

``` sql
select min(`age`) from emp;
```

:::



::: details 统计 西安 地区的年龄之和

``` sql
select sum(`age`) from emp where workaddress = '西安';
```

:::





## 4. 分组查询(group by)



`where` 与 `having`区别

- 执行时机不同：`where` 是分组之前进行过滤，不满足 `where` 条件，不参与分组。而 `having` 是分组后对结果进行过滤。
- 判断条件不同：`where` 不能对聚合函数进行判断，而 `having` 可以。

::: warning 注意

- **执行顺序：`where` > 聚合函数 > `having`**
- 分组之后，*查询的字段一般为聚合函数和分组字段*，查询其他字段无任何意义

:::



### 语法

``` sql
select 字段列表
from 表名
    [where 条件]
group by 分组字段名
    [having 分组后过滤条件]
```



### 练习

::: details 根据性别分组，统计男性员工和女性员工数量

``` sql
select gender,count(*) from emp group by gender;
```

:::



::: details 根据性别分组，统计男性员工和女性员工的平均年龄

``` sql
select gender,avg(age) from emp group by gender;
```

:::



::: details 查询小于45岁的员工，并根据工作地址分组，获取员工数量大于等于 3 的工作地址

``` sql
select workaddress,count(*) 
from emp 
where age < 45 
group by workaddress 
having count(*) >= 3;
```

:::



## 5. 排序查询(Order by)



### 语法

``` sql
select 字段列表
from 表名
order by 字段1 排序方式1,字段2 排序方式2...字段n 排序方式n;
```



### 排序方式

- ASC：升序（默认）
- DESC：降序

- `ORDER BY` 在 `SELECT` 语句的结尾
- 当使用 `中文别名时` 失效，只可使用英文别名 

::: warning 提示

如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序

:::



### 练习

::: details 根据年龄对公司的员工进行升序排序

``` sql
select * from emp order by age;
```

:::



::: details 根据入职时间，对员工进行降序排序

``` sql
select * from emp order by entrydate DESC ;
```

:::



::: details 根据年龄对公司的员工进行升序排序，年龄相同，再按照入职时间进行排序

``` sql
select * from emp order by age, entrydate;
```

:::



## 6. 分页查询(Limit)

- 关键字 `LIMIT`
- 每页显示 `pageSize` 条数据，显示第 `pageNo` 页
    - `pageSize`：查询记录数
    - `pageNo`：起始索引
- 公式：`LIMIT (pageNo - 1) * pageSize, pageSize`



### 语法

``` sql
select 字段列表
from 表名
limit 起始索引,查询记录数。
```





### 练习

::: details 查询第 1 页员工数据，每页展示 10 条数据

``` sql
select * from emp limit 0,10;
```

:::



::: details 查询第 2 页员工数据，每页展示 10 条数据

``` sql
select * from emp limit 10,10;
```

:::



## 7. 整体练习



::: details 查询年龄为 20,21,22,23 岁员工的信息

``` sql
select * from emp where age in (20,21,22,23);
```

:::



::: details 查询性别为 男， 并且年龄在 20-40岁（含）以内的姓名为三个字的员工

``` sql
select * from emp where gender = '男' and age between 20 and 40 and name like '___';
```

:::



::: details 统计60岁以下男女员工的数量

``` sql
select * from emp where genderselect count(*) from emp where gender = '女' and age < 60;
# 只输出数量
select gender, count(*) from emp where gender = '女' and age < 60 group by gender; = '男' and age between 20 and 40 and name like '___';
```

:::



::: details 查询所有年龄 小于等于35岁员工的姓名和年龄，并对查询结果按年龄升序排序，如果年龄相同按入职时间降序排序

``` sql
select name,age from emp where age <= 35 order by age and entrydate DESC ;
```

:::

