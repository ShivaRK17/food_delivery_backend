require('dotenv').config()
const express = require('express')
const dbconn = require('./db/db')
const app = express()
const port = process.env.PORT
const cors = require('cors')
app.use(cors())

dbconn()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())
app.use('/api',require('./routes/User'))
app.use('/api',require('./routes/Food'))
app.use('/api',require('./routes/Order'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})