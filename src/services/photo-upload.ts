import { UploadFn } from '@/core/form/photo-input'
import { http } from '@/core/http-client'

export const uploadFile: UploadFn = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await http.post<{ src: string }>(
    '/api/file-upload',
    formData,
    {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    },
  )
  return data.src
}
