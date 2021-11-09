const fs = require('fs')

const del = (url) => {

    const fileUrl = new URL(url)
    fs.unlink(`.${fileUrl.pathname}`, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!')
    })
    //console.log(imageUrl.pathname)

}

exports.del = del