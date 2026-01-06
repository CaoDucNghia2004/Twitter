import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRoute from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
config()

databaseService.connect()
const app = express()
const port = process.env.PORT || 4000
// console.log('options:', options.development)

// Tạo folder upload nếu chưa tồn tại
initFolder()

app.use(express.json()) // xử lý cái Json đầu vào chuyển thành obj cho chúng ta

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)
app.use('/medias', mediasRoute)

// default error handler mặc định
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
