const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT = 5000

app.use(bodyParser.urlencoded({ extended: true }))

const userRouter = require('./routes/userRoutes')
app.use('/user', userRouter)

app.listen(PORT, ()=>{
  console.log('Server is up and running', PORT)
})
