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
const compression = require('compression')


const app = express();
app.use(cors({origin: ['http://127.0.0.1:3000', 'https://latina-city-life-client.herokuapp.com'], credentials:true}))
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(compression())

app.use('/api/v1/parties', partiesRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/participation', participantsRouter)
app.use('/images', imagesRouter)
app.get('/favicon.ico', (req, res) => res.status(200).end());

app.use(globalErrorHandler)

module.exports = app;
