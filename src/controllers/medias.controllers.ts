import { NextFunction, Request, Response } from 'express'
import mediasService from '~/services/medias.services'

import { handleUploadSingleImage } from '~/utils/file'

//console.log(__dirname) => E:\HOC_NODEJS\DuAn_Twitter\Twitter\src\controllers
//console.log(path.resolve()) => E:\HOC_NODEJS\DuAn_Twitter\Twitter
//console.log(path.resolve('uploads')) => E:\HOC_NODEJS\DuAn_Twitter\Twitter\uploads

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasService.handleUploadSingleImage(req)
  return res.json({
    result: result
  })
}
