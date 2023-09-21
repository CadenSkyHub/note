# 权限管理（DCL）

## 创建用户

- `username`：你将创建的用户名
- `host`：指定该用户在哪个主机上可以登陆
    - 如果是本地用户可用`localhost`
    - 如果想让该用户可以**从任意远程主机登陆**，可以使用通配符 `%`
- `password`：该用户的登陆密码，密码可以为空，如果为空则该用户可以不需要密码登陆服务器

``` sql
create user 'username'@'host' identified by 'password';
```



**示例**

``` sql
create user 'dog'@'localhost' identified by '123456';
create user 'pig'@'192.168.1.101_' identified by '123456';
create user 'pig'@'%' identified by '123456';
create user 'pig'@'%' identified by '';
create user 'pig'@'%';
```





## 查看用户

``` sql
-- 先使用数据库
use mysql;

-- 再查询用户
select user from user;
```



::: details 输出

``` sql
mysql> select user from user;
+------------------+
| user             |
+------------------+
| Guomq            |
| root             |
| ydjy             |
| mysql.infoschema |
| mysql.session    |
| mysql.sys        |
| root             |
+------------------+
7 rows in set (0.00 sec)
```

:::





## 授权

- `privileges`：用户的操作权限，如`SELECT`，`INSERT`，`UPDATE`等，如果要授予所的权限则使用`ALL`
- `databasename`：数据库名
- `tablename`：表名，如果要授予该用户对所有数据库和表的相应操作权限则可用`*`表示，如`*.*`

``` sql
grant privileges on databasename.tablename to 'username'@'host'
```



**刷新权限**

``` sql
flush privileges;
```



**示例**

``` sql
grant SELECT, INSERT on test.user to 'pig'@'%';
grant ALL on *.* to 'pig'@'%';
grant ALL on maindataplus.* to 'pig'@'%';
```



::: tip 提示：用以上命令授权的用户不能给其它用户授权，如果想让该用户可以授权，用以下命令

``` sql
grant privileges on databasename.tablename to 'username'@'host' with grant option;
```

:::



## 设置与更改用户密码

``` sql
set password for 'username'@'host' = PASSWORD('newpassword');
```

如果是修改当前登录用户密码

``` sql
set password = PASSWORD("newpassword");
```



**示例**

``` sql
set password for 'pig'@'%' = PASSWORD("123456");
```



## 撤销用户权限

- `privileges`：用户的操作权限，如`SELECT`，`INSERT`，`UPDATE`等，如果要授予所的权限则使用`ALL`
- `databasename`：数据库名
- `tablename`：表名，如果要授予该用户对所有数据库和表的相应操作权限则可用`*`表示，如`*.*`

``` sql
revoke privilege on databasename.tablename from 'username'@'host';
```



::: warning 注意

假如你在给用户`'pig'@'%'`授权的时候是这样的（或类似的）：`GRANT SELECT ON test.user TO 'pig'@'%'`，

则在使用`REVOKE SELECT ON *.* FROM 'pig'@'%';`命令并不能撤销该用户对`test`数据库中`user`表的`SELECT` 操作。



相反，如果授权使用的是`GRANT SELECT ON *.* TO 'pig'@'%';`则`REVOKE SELECT ON test.user FROM 'pig'@'%';`命令也不能撤销该用户对`test`数据库中`user`表的`Select`权限。



具体信息可以用命令`SHOW GRANTS FOR 'pig'@'%';` 查看。

:::



## 删除用户

``` sql
drop user 'username'@'host';
```



