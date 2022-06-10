const mongoose =require('mongoose')

//connect to mongodb
const dbURI = process.env('dbURI')

mongoose.connect(dbURI)

