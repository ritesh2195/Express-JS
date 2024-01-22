const mangoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
const app = require('./app')

const DB = process.env.DATABASE

mangoose.
    connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT

app.listen(port,()=>{

    console.log(`server is running on port ${port}`)
})