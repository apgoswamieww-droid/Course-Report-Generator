import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(file, folder = 'uploads') {
  const buffer = Buffer.from(await file.arrayBuffer())
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (err, result) => {
        if (err) reject(err)
        else resolve(result.secure_url)
      },
    )
    stream.end(buffer)
  })
}

export async function deleteFileByUrl(url) {
  if (!url || !url.includes('cloudinary')) return
  const parts = url.split('/')
  const publicIdWithExt = parts.slice(-2).join('/').replace(/\.[^.]+$/, '')
  await cloudinary.uploader.destroy(publicIdWithExt)
}
