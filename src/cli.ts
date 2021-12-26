import {Command} from 'commander';
import {translate} from './main';

const program = new Command();
program.version('0.0.1')
  .name('n-translate')
  .usage('<English>')
  .argument('<English>')
  .action((english) => {
    translate(english);
  });

program.parse();
