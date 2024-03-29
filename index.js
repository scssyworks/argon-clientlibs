#!/usr/bin/env node
const colors = require('chalk');
const xmlbuilder = require('xmlbuilder');
const fs = require('fs-extra');
const rpath = require('path');
const argv = require('yargs').argv;

const ignoredPaths = [];

try {
    const configFile = argv.config || 'argon.config.js';
    const argonuiConfig = require(`${process.cwd()}/${configFile}`);
    if (
        !argonuiConfig
        || (
            typeof argonuiConfig === 'object'
            && !argonuiConfig.clientlibs
        )
    ) {
        throw new Error('1');
    }
    let distFolder = `${process.cwd()}/${argonuiConfig.target}`;
    if (argonuiConfig.jcrRoot) {
        distFolder = `${process.cwd()}/${argonuiConfig.jcrRoot}`;
    }
    const clientlibsConfig = argonuiConfig.clientlibs;
    function testIgnoredPaths(path) {
        let result = false;
        ignoredPaths.forEach(ignoredPath => {
            result = result || path.includes(ignoredPath.substring(1))
        });
        return result;
    }
    // Recursive function to scan and create respective js and css text files
    function recTestFiles(testPath, targetPath) {
        if (fs.existsSync(testPath)) {
            if (!testIgnoredPaths(testPath)) {
                const fileStat = fs.lstatSync(testPath);
                if (fileStat.isFile()) {
                    const matches = testPath.match(/\.(js|css|less)$/);
                    if (matches && matches.length && matches[1]) {
                        const ext = matches[1] === 'less' ? 'css' : matches[1];
                        const fileName = `${ext}.txt`;
                        fs[
                            !fs.existsSync(`${targetPath}/${fileName}`)
                                ? 'writeFileSync'
                                : 'appendFileSync'
                        ](`${targetPath}/${fileName}`, `${rpath.relative(targetPath, testPath).replace(/[\\]/g, '/')}\n`);
                    }
                }
                if (fileStat.isDirectory()) {
                    // Recursively scan directory
                    const files = fs.readdirSync(testPath);
                    if (files.length) {
                        files.forEach(file => {
                            recTestFiles(`${testPath}/${file}`, targetPath);
                        });
                    }
                }
            }
        } else {
            throw new Error('4');
        }
    }
    Object.keys(clientlibsConfig).forEach(clientlib => {
        ignoredPaths.length = 0;
        const currentConfig = clientlibsConfig[clientlib];
        const { basePath, categories = [], jsProcessor = [], cssProcessor = [], paths = [], dependencies = [] } = currentConfig;
        if (basePath) {
            const targetPath = `${distFolder}/${basePath}`;
            if (!fs.existsSync(targetPath)) {
                fs.mkdirsSync(targetPath);
            }
            // Create .content.xml
            const content = {
                'jcr:root': {
                    '@xmlns:cq': 'http://www.day.com/jcr/cq/1.0',
                    '@xmlns:jcr': 'http://www.jcp.org/jcr/1.0',
                    '@jcr:primaryType': 'cq:ClientLibraryFolder'
                }
            }
            if (categories.length) {
                content['jcr:root']['@categories'] = `[${categories.join(';')}]`;
            } else {
                throw new Error('2');
            }
            if (jsProcessor.length) {
                content['jcr:root']['@jsProcessor'] = `[${jsProcessor.join(';')}]`;
            }
            if (cssProcessor.length) {
                content['jcr:root']['@cssProcessor'] = `[${cssProcessor.join(';')}]`;
            }
            if (dependencies.length) {
                content['jcr:root']['@dependencies'] = `[${dependencies.join(';')}]`;
            }
            const xml = xmlbuilder.create(content, {
                encoding: 'UTF-8'
            }).end({
                pretty: true
            });
            fs.writeFileSync(`${targetPath}/.content.xml`, xml);
            // Scan files and create js.txt and css.txt files
            ignoredPaths.push(...paths.filter(path => path.startsWith('!')));
            paths.forEach(path => {
                if (!path.startsWith('!')) {
                    recTestFiles(`${distFolder}/${path}`, targetPath);
                }
            });
            console.log(colors.green(`Created client library with categories "${colors.bold(categories.join(','))}"`));
        } else {
            throw new Error('3');
        }
    });
} catch (e) {
    if (e.message === '2') {
        console.log(colors.red(colors.bold('Property "categories" is missing or empty in clientlib configuration.')));
    } else if (e.message === '3') {
        console.log(colors.red(colors.bold('Property "basePath" is missing in clientlib configuration.')));
    } else if (e.message === '4') {
        console.log(colors.red(colors.bold('Please provide valid "paths" for clientlib')));
    } else {
        console.log(colors.red(colors.bold('This package requires argon configuration. Please add "argon.config.js" in your project\'s root directory!')));
    }
}