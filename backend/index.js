const express = require('express')
const connectToMongo = require('./db');
const cors = require('cors')

connectToMongo();

const app = express()
app.use(express.json())
app.use(cors())

const port = 5000;

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})