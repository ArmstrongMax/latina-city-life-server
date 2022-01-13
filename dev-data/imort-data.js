const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '../config.env' })
const Party = require('../models/partiesModel')
const fs = require ('fs')


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB).then(() => { console.log('Database connection successful')
})

const parties = JSON.parse(fs.readFileSync(`${__dirname}/parties.json`, 'utf8'))
const importData = async () => {
    try {
        await Party.create(parties)
        console.log('data successfully loaded')
    } catch (e) {
        console.log(e)
    }
}
const deleteData = async () => {
    try {
        await Party.deleteMany()
        console.log('data successfully deleted')
    } catch (e) {
        console.log(e)
    }
}
if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}