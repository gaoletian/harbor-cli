/**
 * Created by 高乐天 on 17/9/28.
 */

const { helpColor } = require('./utils');
const Command = require('commander').Command;

// overwrite outputHelp
Command.prototype.outputHelp = function(cb) {
  let helpInfo = `
  Envirment:
    'nodejs >= 8.4.0    webstorm >= 2017.2'
  `;
  helpInfo += this.helpInformation();
  helpInfo = helpColor(helpInfo);
  process.stdout.write(cb ? cb(helpInfo) : helpInfo);
  this.emit('--help');
  return this;
};

// overwrite addImplicitHelpCommand
Command.prototype.addImplicitHelpCommand = function() {
  this.command('help', '# 显示帮助').alias('h');
};

exports = module.exports = new Command();
exports.Command = Command;
