#!/usr/bin/env node

const fs = require('fs');
const {
    title,
    success,
    warn,
    projectDir,
    homeDir
} = require('./lib/utils.js');

// 生成 run.sh
function genarateRun(filename) {
    const fullPath = projectDir(filename)
    if (fs.existsSync(fullPath)) {
        return warn(fullPath + '已存在');
    }
    const content = `#!/usr/bin/env bash
NODE_ENV=$env PORT=$PORT0 node main.js
    `
    fs.writeFileSync(fullPath, content);
    success(fullPath)
}

// 生成项目配置
function genarateNci(filename) {
    const fullPath = projectDir(filename);
    if (fs.existsSync(fullPath)) {
        return warn(fullPath + ' 已存在 ')
    }
    const content = `{
  "dockerHost": "harbor.finupgroup.com",
  "dockerGroup": "",
  "baseImage": "harbor.finupgroup.com/nchannel/node:alinode",
  "appName": ""
}`
    fs.writeFileSync(fullPath, content);
    success(fullPath)
}

function genarateGlobalNci(filename) {
    const fullPath = homeDir(filename);
    if (fs.existsSync(fullPath)) {
        warn(fullPath + ' 已存在 ')
        return;
    }
    const content = `{
  "dockerHost": "harbor.finupgroup.com",
  "dockerGroup": "",
  "baseImage": "harbor.finupgroup.com/nchannel/node:alinode",
  "dockerUser": "",
  "dockerPass": ""
}`

    fs.writeFileSync(fullPath, content);
    success(fullPath)
}

function init() {
    title('初始化配置')
    genarateNci('nci.json');
    genarateRun('run.sh');
    genarateGlobalNci('.ncirc.json');
}

init()