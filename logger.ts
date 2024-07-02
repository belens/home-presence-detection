
export function debug(message, type = 'LOG') {

    printLog(message, 'DEBUG')

}


function printLog(message, type = 'LOG') {

    if (type === 'DEBUG') {
        console.debug(message)
    }

}