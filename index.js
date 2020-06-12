const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const routes = require('./src/routes/index')

const app = express()
const { port } = require('./config')

app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/register', routes.Register)

app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
