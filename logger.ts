import chalk from 'chalk';

export const logger = {
    log,
    debug,
    error
}

export function log(message: any, ...messages: any[]) {
    printLog('LOG', message);
}

export function debug(message: any, ...messages: any[]) {
    printLog( 'DEBUG', message, ...messages);
}

export function error(message: any, ...messages: any[]) {
    printLog(message, 'ERROR');
}

function printLog(type = 'LOG', message: any | Object, ...messages: any[]) {
    if (type === 'DEBUG') {
        console.debug(chalk.gray(`[DEBUG] ${message}`, ...messages));
    } else if (type === 'ERROR') {
        console.error(message, ...messages);
        console.error(chalk.red(`[ERROR] ${message}`, ...messages));
    } else if (type === 'LOG') {
        console.log(chalk.blue(`[LOG] ${message}`, ...messages));
    }
}