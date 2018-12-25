# 安装

```bash
# 全局安装
npm i -g harbor-cli

# 初始化
cd you-app-dir

# 项目目录下  自动生成 nci.json 和 run.sh
nci init   

# 配置私服 用户名和密码
nci config set dockerUser username
nci config set dockerPass password

# 手动配置 nci.json  "dockerGroup", "baseImage", "appName" 三项 

# 修改 run.sh 应用启动脚本


# 生成docker镜像并推送到 harbor私服
nci docker build 


```

# 命令行界面

```bash
  Envirment:
    nodejs >= 8.4.0

  Usage: nci [command]

  Options:
    -h, --help  output usage information

  Commands:
    config|cfg [set|unset] [key] [value]  JSON风格全局配置 -例如:  "nci cfg set dockerUser xxxx" 配置 harbor 私服用户名 为 xxxxx
    docker|dk <build|run>   生成并发布docker镜像,默认从pub环境下载依赖包 例如：构建镜像 nci dk build，测试镜像 nci dk run
    init                                  初始化工程配置, 生成 nci.josn 和 run.sh
    help|h                                显示帮助
```

# 配置

> 全局配置文件路径为： ~/.ncirc.json

> 项目配置文件路径为： nci.json

```json
{ 
  "dockerHost": "company-private-docker-mirror-host",
  "dockerGroup": "your-docker-group",
  "baseImage": "harbor.finupgroup.com/nchannel/phnode:8",
  "dockerUser": "your-docker-user",
  "dockerPass": "your-docker-password",
  "appName": "appName for docker image's name"
 }
 
```
