const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const globalErrorHandler = require('./controllers/errorController')
const usersRouter = require('./routes/usersRouter')
const partiesRouter = require ('./routes/partiesRouter')
const participantsRouter = require('./routes/participantsRouter')
const imagesRouter = require('./routes/imagesRouter')


const app = express();
app.use(cors())
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
app.use('/images', imagesRouter)
app.get('/favicon.ico', (req, res) => res.status(200).end());

app.use(globalErrorHandler)

module.exports = app;
