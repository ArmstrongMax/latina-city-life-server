const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const usersRouter = require('./routes/usersRouter')
const partiesRouter = require ('./routes/partiesRouter')
const participantsRouter = require('./routes/participantsRouter')


const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))


app.use('/api/v1/parties', partiesRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/participants', participantsRouter)


module.exports = app;
