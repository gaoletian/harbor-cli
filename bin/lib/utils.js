/**
 * Created by 高乐天 on 17/9/26.
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const log = console.log;
const _ = require('lodash');
const existsSync = fs.existsSync;
// cli路径
const cliPathResolve = filename => path.join(__dirname, '../../', filename);
// 脚本路径
const scriptResolve = filename => path.join(__dirname, '../../script', filename);
// 当前路径
const projectDir = filename => (filename ? process.cwd() + '/' + filename : process.cwd());
// HOME
const homeDir = filename => process.env.HOME + '/' + filename;
// 分割线路径
const hr = () => log(chalk.gray('--------------------------------------------------------'));
// 成功日志
const success = msg => log(chalk.green(msg));
// 警告日志
const warn = msg => log(chalk.yellow(msg));
// 格式化json
const beautyJson = json => JSON.stringify(json, null, 2);

/**
 * 执行shell 不返回结果
 * @param cmd
 * @return {*}
 */
const execOption = {
  encoding: 'utf-8',
  stdio: ['inherit', 'inherit', 'inherit']
};
const execSync = cmd => require('child_process').execSync(cmd, execOption);

/**
 * 执行shell 并返回结果
 * @param cmd
 */
const shell = cmd => require('child_process').execSync(cmd, {
  encoding: 'utf-8'
});

/**
 * 执行shell脚本
 * @param {string} shellName - shell 脚本名称
 * @param {Array} args - 参数数组类型
 */
const sh = (shellName, args = []) => execSync(`sh ${scriptResolve(shellName)} ${args.join(' ')}`);

/**
 * 带分割线的标题
 * @param text
 */
const title = text => {
  hr();
  log(chalk.red(text));
  hr();
};

/**
 * 帮助信息着色
 * @param template
 * @return {string|XML}
 */
const helpColor = template => {
  return chalk.cyanBright(
    template
    .replace(/\n\n/g, '\n')
    .replace(/(\||<|>|\[|\]|=)/g, chalk.white('$1'))
    .replace(/('.*?')/g, chalk.cyanBright('$1'))
    .replace(/(# .*)/g, chalk.white('$1'))
    .replace(/('|# )/g, '')
    .replace(/(Example:|Commands:|Options:|Usage:|Envirment:)/g, chalk.greenBright('$1'))
  );
};

/**
 * @type {{path: *, readConfig: (function()), setConfig: (function()), ls: (function()), set: (function(*=, *=)), unset: (function())}}
 */
const nciConfig = {
  path: {
    projectPath: projectDir('nci.json'),
    globalPath: path.join(process.env.HOME || '/root', '.ncirc.json')
  },
  readConfig() {
    const {
      projectPath,
      globalPath
    } = this.path;
    const globalConfig = existsSync(globalPath) ? require(globalPath) : {};
    const projectConfig = existsSync(projectPath) ? require(projectPath) : {};
    return Object.assign({}, globalConfig, projectConfig);
  },
  /**
   * 设置属性
   * @param keyPath
   * @param val
   */
  set(keyPath, val) {
    let config = this.readConfig();
    _.set(config, keyPath, val);
    fs.writeFileSync(this.path.globalPath, beautyJson(config));
  },
  /**
   * 获取属性
   * @param keyPath
   * @return {*}
   */
  get(keyPath) {
    let config = this.readConfig();
    return _.get(config, keyPath, null);
  },
  /**
   * 删除属性
   * @param keyPath
   */
  unset(keyPath) {
    let config = this.readConfig();
    _.unset(config, keyPath);
    fs.writeFileSync(this.path.globalPath, beautyJson(config));
    log(this.readConfig());
  }
};

/**
 * 是否部署项目
 * @return {bool}
 */
const isDockerDir = () => existsSync(projectDir('nci.json')) || existsSync(projectDir('.Dockerfile'));

/**
 * 目录检测 是否包含docker相关文件
 */
const mustBeDocker = () => {
  if (!isDockerDir()) {
    title('请在部署项目下执行');
    process.exit(1);
  }
};

module.exports = {
  cliPathResolve,
  scriptResolve,
  projectDir,
  homeDir,
  beautyJson,
  execSync,
  shell,
  title,
  success,
  warn,
  helpColor,
  sh,
  nciConfig,
  log,
  isDockerDir,
  mustBeDocker,
};