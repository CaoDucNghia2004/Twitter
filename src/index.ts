import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

databaseService.connect()
const app = express()
const port = 3000

app.use(express.json()) // xử lý cái Json đầu vào chuyển thành obj cho chúng ta

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)

// default error handler mặc định
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
