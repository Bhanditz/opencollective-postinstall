const execSync = require('child_process').execSync;
const chalk = require('chalk');
const utils = require('../lib/utils');

const padding = utils.padding;
const formatCurrency = utils.formatCurrency;

const package_name = process.env.npm_package_name;
const collective_url = process.env.npm_package_collective_url;
const collective_suggested_donation_amount = process.env.npm_package_collective_suggested_donation_amount;
const collective_suggested_donation_interval = process.env.npm_package_collective_suggested_donation_interval;
const user_agent = process.env.npm_config_user_agent;

function getDonateURL() {
  var donate_url = collective_url;
  if (collective_suggested_donation_amount) {
    donate_url += `/donate/${collective_suggested_donation_amount}`;
    if (collective_suggested_donation_interval) {
      donate_url += `/${collective_suggested_donation_interval}`;
    }
    donate_url += (npm_config_user_agent.match(/yarn/)) ? '/yarn' : '/npm';
  }
  return donate_url;
}

const print = function(str, opts) {
  opts = opts || { color: null, align: 'center'};
  opts.align = opts.align || 'center';
  const terminalCols = parseInt(execSync(`tput cols`).toString());
  const strLength = str.replace(/\u001b\[[0-9]{2}m/g,'').length;
  const leftPaddingLength = (opts.align === 'center') ? Math.floor((terminalCols - strLength) / 2) : 2; 
  const leftPadding = padding(leftPaddingLength);
  if (opts.color) {
    str = chalk[opts.color](str);
  }

  console.log(leftPadding, str);
}

const printStats = function(stats) {
  if (!stats) return;
  print(`Number of contributors: ${stats.contributorsCount}`);
  print(`Number of backers: ${stats.backersCount}`);
  print(`Annual budget: ${formatCurrency(stats.yearlyIncome, stats.currency)}`);
  print(`Current balance: ${formatCurrency(stats.balance, stats.currency)}`, { color: 'bold' });  
}

const printLogo = function(logotxt) {
  if (!logotxt) return;
  logotxt.split('\n').forEach((line) => print(line, { color: 'blue' }));
}

const printFooter = function(stats) {
  console.log("");
  
  print(`Thanks for installing ${package_name} 🙏.`, { color: 'yellow' });
  print(`Please consider donating to our open collective`, { color: 'dim' });
  print(`to help us maintain this package.`, { color: 'dim' });
  console.log("");
  printStats(stats);
  console.log("");
  print(`${chalk.bold("👉  Donate:")} ${chalk.underline(getDonateURL())}`);
  console.log("");
}

module.exports = {
  print,
  printLogo,
  printStats,
  printFooter
};
