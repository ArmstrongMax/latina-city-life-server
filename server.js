const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const app = require('./app')

const dataBase = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(dataBase).then(() => { console.log('Database connection successful')
})

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION. Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
})
process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down')
    server.close(() => {
        console.log('Process terminated!');
    })
})

