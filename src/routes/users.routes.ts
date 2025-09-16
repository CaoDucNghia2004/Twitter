import express from 'express'
import { loginController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'
const usersRouter = express.Router()

// usersRouter.use((req, res, next) => {
//   console.log('Something is happening.')
//   next()
// })

usersRouter.post('/login', loginValidator, loginController)

export default usersRouter
