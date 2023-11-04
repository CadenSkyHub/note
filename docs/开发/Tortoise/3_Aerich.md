# Aerich（BUG）

[tortoise/aerich](https://github.com/tortoise/aerich)



## 安装`aerich`

```bash
pip install aerich
```



## 将`aerich`添加到配置中

``` python
TORTOISE_ORM = {
    "connections": {
        "default": "mysql://peewee:password@10.10.10.200:3306/peewee",
    },
    "apps": {
        "models": {"models": ["models","aerich.models"], "default_connection": "default"},
    },
}
```



## 初始化

``` bash
aerich init -h
```

``` bash
Usage: aerich init [OPTIONS]

  Init config file and generate root migrate location.

Options:
  -t, --tortoise-orm TEXT  Tortoise-ORM config module dict variable, like
                           settings.TORTOISE_ORM.  [required]
  --location TEXT          Migrate store location.  [default: ./migrations]
  -s, --src_folder TEXT    Folder of the source, relative to the project root.
  -h, --help               Show this message and exit.
```





初始化配置文件和迁移位置

``` bash
aerich init -t main.TORTOISE_ORM		# -t 后跟的是 TORTOISE_ORM 字典对象的位置
```



## 初始化数据库

```bash
aerich init-db
```

::: details 报错

```
如果报错
tortoise.exceptions.ConfigurationError: DB configuration not initialised. Make sure to call Tortoise.init with a valid configuration before attempting to create connections. 

尝试新建一个 `seetings.py` 文件，将 TORTOISE_ORM 配置对象复制到这里，然后重新初始化，再初始化数据库试试
```

:::

## 将数据库表生成ORM模型



检查所有表格并打印到控制台

> 注意：
>
> - 好像有个BUG，会生成两个id
> - 此命令是有限的，无法推断某些字段，例如 `IntEnumField``ForeignKeyField` `timestamp` 等。

``` bash
aerich --app models inspectdb		# 查看所有
aerich inspectdb -t 表名	# 查看单个表
```



```
> aerich inspectdb -t proverbs

from tortoise import Model, fields
class Proverbs(Model):
    id = fields.IntField(pk=True, description='ID', )
    id = fields.IntField(pk=True, description='ID', )
    proverb = fields.CharField(unique=True, max_length=200, description='谚语', )
    author = fields.CharField(max_length=100, description='作者', )
    description = fields.CharField(max_length=1000, null=True, description='描述', )
```





从数据库生成表

```bash
aerich --app models inspectdb > models.py # 所有表
aerich inspectdb -t 表名 > models.py	# 单个表
```

