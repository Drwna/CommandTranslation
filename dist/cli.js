#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const main_1 = require("./main");
const program = new commander_1.Command();
program.version('0.0.1')
    .name('n-translate')
    .usage('<English>')
    .argument('<English>')
    .action((english) => {
    (0, main_1.translate)(english);
});
program.parse();
