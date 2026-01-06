import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'

//console.log(__dirname) => E:\HOC_NODEJS\DuAn_Twitter\Twitter\src\controllers
//console.log(path.resolve()) => E:\HOC_NODEJS\DuAn_Twitter\Twitter
//console.log(path.resolve('uploads')) => E:\HOC_NODEJS\DuAn_Twitter\Twitter\uploads

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
