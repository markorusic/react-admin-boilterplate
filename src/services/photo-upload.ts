import { UploadFn } from '../core/form/photo-input'
import { http } from '../core/http-client'

export let uploadFile: UploadFn = async file => {
  let formData = new FormData()
  formData.append('file', file)
  let response = await http.post<string>('/file-upload', formData, {
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
  return response.data
}
