'use strict';

const chalk = require('chalk');
const Generator = require('yeoman-generator');
const detectInstalled = require('detect-installed');
const yorc = require('../../lib/yorc');
const prompt = require('./prompt');

module.exports = class extends Generator {
  prompting() {
    return prompt(this);
  }

  get writing() {
    return {
      // Copy dotfiles.
      dotfiles() {
        this.fs.copy(
          this.templatePath('dotfiles/editorconfig'),
          this.destinationPath('.editorconfig'));
        this.fs.copy(
          this.templatePath('dotfiles/gitattributes'),
          this.destinationPath('.gitattributes'));
        this.fs.copy(
          this.templatePath('dotfiles/gitignore'),
          this.destinationPath('.gitignore'));
      },

      // Create project README.
      readme() {
        this.fs.copyTpl(
          this.templatePath('README.md'),
          this.destinationPath('README.md'),
          this.variables);
      },

      // Copy the project scripts and related assets.
      app() {
        this.fs.copy(
          this.templatePath(`${this.baseTemplate}/**`),
          this.destinationPath(),
          {
            globOptions: {
              dot: true
            }
          }
        );
      },

      // Copy sample game assets.
      assets() {
        this.fs.copy(
          [this.templatePath('static/**'), '!**/*.{html,json}'],
          this.destinationPath('static/'));
        this.fs.copyTpl(
          this.templatePath('static/index.html'),
          this.destinationPath('static/index.html'),
          this.variables);
      },

      // Copy Gulp tasks.
      tasks() {
        this.fs.copyTpl(
          this.templatePath('gulpfile.js/**'),
          this.destinationPath('gulpfile.js/'),
          this.variables);
      },

      // Set the generator configuration values.
      yorc() {
        this.config.defaults(yorc.defaultsFor(this, this.baseTemplate));
      }
    };
  }

  install() {
    // Prefer Yarn package manager, if available.
    if (detectInstalled.sync('yarn')) {
      this.yarnInstall();
    } else {
      this.npmInstall();
    }
  }

  end() {
    const command = `${detectInstalled.sync('yarn') ? 'yarn' : 'npm'} start`;
    if (!this.options['skip-install']) {
      this.log([
        '',
        'Congrats! Now, launch your project using',
        `${chalk.yellow.bold(command)} and happy hacking :)`
      ].join('\n'));
    }
  }
};
