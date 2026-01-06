import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs' // đây là package có sẵn trong nodejs để thao tác với file và folder
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // mục đích là để tạo folder nested
      })
    }
  })
}

//   const form = formidable({
//     uploadDir: path.resolve('uploads'), //Chỉ định thư mục tạm (và cũng là nơi lưu file) khi upload xong
//     maxFiles: 1,
//     keepExtensions: true, //Giữ lại đuôi file gốc (.jpg, .png, .mp4)
//     maxFileSize: 300 * 1024 // 300MB
//   })

// // Chúng ta đang throw 1 mỗi trong callback của async thì nó sẽ ko làm cái function uploadSingleImageController reject được
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       throw err
//     }
//     res.json({
//       message: 'Upload image successfully'
//     })
//   })

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR, //Chỉ định thư mục tạm (và cũng là nơi lưu file) khi upload xong
    maxFiles: 4,
    keepExtensions: true, //Giữ lại đuôi file gốc (.jpg, .png, .mp4)
    maxFileSize: 300 * 1024, // 300MB,
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      // console.log('name:', name) // name là tên của field khi chúng ta upload lên
      // console.log('originalFilename:', originalFilename) // originalFilename là tên file gốc của file khi chúng ta upload lên
      // console.log('mimetype:', mimetype) // mimetype là kiểu định dạng file khi chúng ta upload lên
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })

  // Chúng ta đang throw 1 mỗi trong callback của async thì nó sẽ ko làm cái function uploadSingleImageController reject được
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      // console.log('fields:', fields)
      // console.log('files:', files)
      // console.log('err:', err)
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullName = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

export const getExtension = (fullname: string) => {
  const namearr = fullname.split('.')
  return namearr[namearr.length - 1]
}
