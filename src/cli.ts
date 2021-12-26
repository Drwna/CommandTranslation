import {Command} from 'commander';

const program = new Command();
program.version('0.0.1')
  .name('n-translate')
  .usage('<english>')

program.parse();
