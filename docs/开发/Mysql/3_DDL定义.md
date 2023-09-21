# 数据库管理（DDL）



## 数据库管理

### 创建数据库

``` sql
create database 数据库名;
```



- `if not exists`:加上表示如果数据库不存在，则创建数据库，如果存在，则不执行任何操作
- `default charset 字符集`: 指定字符集，建议：`utf8mb4` 
- `collate 排序规则`: 指定排序规则，建议：`utf8_general_ci`

``` sql
create database [if not exists] 数据库名 [default charset 字符集] [collate 排序规则];
```



### 查询所有数据库

``` sql
show databases;
```



### 删除数据库

`if exists`:如果存在，则删除，如果不存在，则不执行任何操作

``` sql
drop database [if exists] 数据库名;
```



### 使用数据库

``` sql
use 数据库名;
```



### 查看当前数据库

``` sql
select database();
```





## 表管理

### 创建

``` sql
create table `表名`(
    `字段1` 字段1类型 [约束] [comment '字段1注释'],
    `字段2` 字段2类型 [约束] [comment '字段2注释'],
    `字段3` 字段3类型 [约束] [comment '字段3注释'],
    ...
    `字段n` 字段n类型 [约束] [comment '字段n注释']
)[comment '表注释']
```

::: warning 注意事项

- 注释需要加上单引号
- 每个字段用 **逗号** 隔开， 除了 **最后一行！**
- 推荐给字**段名、表名**加上 **\`就是代码块那个符号`**

:::



**示例**

``` sql
create table `User`(
    `id` int not null unique auto_increment comment '主键',
    `name` varchar(5) not null comment '名字',
    `gender` varchar(2) comment '性别',
    primary key (`id`)  --指定主键--
) comment `用户表`;
```

::: details 输出

``` sql
mysql> desc user;
+--------+------------+------+-----+---------+----------------+
| Field  | Type       | Null | Key | Default | Extra          |
+--------+------------+------+-----+---------+----------------+
| id     | int        | NO   | PRI | NULL    | AUTO_INCREMENT |
| name   | varchar(5) | NO   |     | NULL    |                |
| gender | varchar(2) | YES  |     | NULL    |                |
+--------+------------+------+-----+---------+----------------+
```

:::



### 删除表

``` sql
drop table `表名`;
```



### 清空表

``` sql
truncate table `表名`;
```



### 查询表

- 查询当前数据库所有表

    ``` sql
    show tables;
    ```

- 查询表结构

    ``` sql
    desc 表名;
    ```

- 查询创建表的时候的结构

    ``` sql
    show create table 表名;
    ```



### 修改表名

``` sql
alter table `旧表名` rename to `新表名`;

# 示例
alter table `user` rename to `users`;
```



### 添加字段

``` sql
alter table `表名` add `字段名` 类型 [comment '注释'] [约束];

# 示例
alter table `user` add `age` int comment '年龄' not null ;
```



### 修改字段

**修改字段类型、约束**

``` sql
alter table `表名` modify `字段名` 新数据类型

# 示例
alter table `user` modify `age` varchar(2);
```



**修改字段名及类型**

``` sql
alter table `表名` change `旧字段名` `新字段名` 类型 [comment '注释'] [约束];

# 示例
alter table `user` change `age` `email` varchar(50) comment '邮箱' not null;
```



### 删除字段

``` sql
alter table `表名` drop `字段名`;

# 示例
alter table `user` drop `email`;
```



### 示例（创建、更新时间）

``` sql
create table `testing`(
    id int not null unique auto_increment comment 'ID',
    create_time datetime default current_timestamp comment '创建时间',
    update_time datetime default current_timestamp on update current_timestamp() comment '更新时间'
    primary key (id)
)comment '测试一下';
```



::: info 如果只需要日期

``` sql
create_date date default current_date comment '创建时间'
```

:::





