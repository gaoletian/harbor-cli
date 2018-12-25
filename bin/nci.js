#!/usr/bin/env node

/**
 * Created by 高乐天 on 17/9/25.
 */

const program = require('./lib/commander');

program
  .command(
    'config [set|unset] [key] [value]',
    '# JSON风格全局配置 -例如:  "nci cfg set dockerUser 017041" 配置 harbor 私服用户名 为 017041'
  )
  .alias('cfg')
  .command(
    'docker <build|run> [nppub|pub]',
    '# 生成并发布docker镜像,默认从pub环境下载依赖包 例如：构建镜像 nci dk build，测试镜像 nci dk run'
  )
  .alias('dk')
  .command(
    'init',
    '# 初始化工程配置, 生成 nci.josn 和 run.sh'
  )

program.parse(process.argv);