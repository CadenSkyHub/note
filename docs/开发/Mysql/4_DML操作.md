# 表操作（DML）



::: warning 注意

- 插入数据时，指定的字段顺序应与值得顺序是一一对应的
- 字符串和日期类型的值应该包含在引号中
- 插入的数据大小，应该在字段规定的范围内

:::



## 新增数据（insert）

 ### 插入单列

``` sql
insert into `表名` (字段名) values ('值');

# 例
insert into `users` (name) values ('张三');
```



### 插入多列

``` sql
insert into `表名`(字段名1,字段名2,...,字段名n) values (值1,值2,...,值n)

# 例
insert into `users` (name,gender) values ('李四','男');
```



### 批量插入

``` sql
insert into `表名` (字段名1,字段名2,...,字段名n) 
values(值1,值2,...,值n),(值1,值2,...,值n);

# 例
insert into `users` (name,gender) 
values ('张六','男'),('王五','女');
```



## 修改数据（update）

::: danger 注意！
修改语句的条件不是必须的，但是如果没有条件，则会修改整张表的数据

:::



``` sql
update `表名`
set `字段名1`=值1,`字段名2`=值2,...,`字段名n`=值n
[where 条件]
```



**示例**

``` sql
# 例(将 id=1 数据的 name 改为 麻子)
update `users`
set `name`='麻子'
where id=1;

# 例(将 id=3 数据的 name 改为 猴子，gender 改为 女)
update `users`
set `name`='猴子',`gender`='女'
where id=3;

# 例(将 所有数据的 gender 改为 未知)
update `users`
set `gender`='未知';
```



## 删除（delete）

::: danger 注意！

**删除语句的条件不是必须的，但是如果没有条件，则会修改整张表的数据**

:::



::: tip 提示

**`delete`语句不能删除某一个字段的值 (可以使用 `update`)**

:::



``` sql
delete from `表名` [where 条件];
```



**示例**

``` sql
# 例（将 id=3 的人删除）
delete from `users` where id=3;

# 例（将 name 等于 麻子 的人删除）
delete from `users` where `name`='麻子';
```



