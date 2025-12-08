import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()
const port = 3000

app.use(express.json()) // xử lý cái Json đầu vào chuyển thành obj cho chúng ta

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)

databaseService.connect()

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err.message })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
