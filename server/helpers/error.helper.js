class ErrorHandler extends Error {
	constructor(statusCode, message) {
		super()
		this.statusCode = statusCode
		this.message = message
	}
}

const handleError = (err, res) => {
	const { statusCode, message } = err
	if (!statusCode) {
		console.log(err)
		res.status(500).json({ message: 'Internal Server Error' })
	} else {
		res.status(statusCode).json({
			message
		})
	}
}

const formatDBError = (e) => {
	const err = []
	const errStr = e.substring(e.indexOf(':') + 1).trim()
	const errArray = errStr.split(',').map(e => e.trim())
	errArray.forEach(e => {
		err.push(e.substring(e.indexOf(':') + 1).trim() + '\n')
	})
	return err.join('')
}

module.exports = {
	ErrorHandler,
	handleError,
	formatDBError
}