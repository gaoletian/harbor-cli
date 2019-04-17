#!/usr/bin/env node

const program = require('./lib/commander');
const {
	sh,
	shell,
	nciConfig,
	log,
	warn,
	helpColor,
	title,
	mustBeDocker,
	execSync
} = require('./lib/utils.js');

const config = nciConfig.readConfig();
const {
	baseImage,
	dockerHost,
	dockerGroup,
	dockerUser,
	dockerPass,
	appName
} = config;

program.option('-t, --tag [default]', '指定docker镜像标签', '').arguments('[cmd]').parse(process.argv);

let helpInfo = `
  Usage: nci docker|dk <build|run|info >
	  
    option:
	-t --tag     自定义镜像标签 默认为时间戳 
	
  Example: 

    # #构建镜像
    'nci docker build' 简写 'nci dk build'
    
    # #运行镜像
    'nci docker run' 简写 'nci dk run'
  `;

const dockerLoginCmd = `docker login -u ${dockerUser} -p ${dockerPass} ${dockerHost}`;

const checkNciConfig = () => {
	if (!dockerUser || !dockerPass || !dockerGroup || !appName) {
		warn(`
		配置不正确, 请依次执行以下命令

		nci init
		nci config set dockerUser  私服用户名
		nci config set dockerPass  私服密码

		手动配置 nci.json "dockerGroup", "appName", "baseImage"
		`);
		process.exit(1);
	}
}

switch (program.args[0]) {
	case 'build':
		{
			checkNciConfig();
			mustBeDocker();
			title('登陆docker');
			execSync(dockerLoginCmd);
			title('构建镜像');
			sh('dock.sh', ['build', dockerHost, dockerGroup, baseImage, appName, program.tag]);
			break;
		}
	case 'run':
		{
			mustBeDocker();
			sh('dock.sh', ['run']);
			break;
		}
	case 'upload':
		{
			mustBeDocker();
			sh('dock.sh', ['upload']);
			break;
		}
	case 'info':
		{
			mustBeDocker();
			sh('dock.sh', ['info', dockerHost, dockerGroup, baseImage, appName, program.tag]);
			break;
		}
	default:
		log(helpColor(helpInfo));
}