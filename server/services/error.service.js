const formatter = (e) => {
    const err = []
    const errStr = e.substring(e.indexOf(':') + 1).trim()
    const errArray = errStr.split(',').map(e => e.trim())
    errArray.forEach(e => {
        err.push(e.substring(e.indexOf(':') + 1).trim() + '\n')
    })
    return err.join('')
}

exports.formatter = formatter