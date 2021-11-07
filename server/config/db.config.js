const { connect, connection } = require('mongoose')
const { config } = require('dotenv')

module.exports = () => {
    config()
    const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    
    connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connection estabislished with MongoDB')
        })
        .catch(error => console.error(error.message))

    connection.on('error', (error) => {
        console.error(error.message)
    })

    connection.on('disconnected', () => {
        console.log('Mongoose Disconnected')
    })

    process.on('SIGINT', () => {
        connection.close(() => {
            console.log('Mongoose connection closed on Application Timeout')
            process.exit(0)
        })
    })

}
