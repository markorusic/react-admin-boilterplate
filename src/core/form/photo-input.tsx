import React, { FC, useState } from 'react'
import { useField } from 'formik'
import { Upload, notification, UploadProps } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { BaseInputProps, FormInputContainer } from '.'
import { useLang } from '../localization'

export enum Orientation {
  portrait = 'portrait',
  landscape = 'landscape',
  any = 'any'
}

let isSupportedType = (type: string) =>
  type === 'image/jpeg' || type === 'image/png' || type === 'image/webp'

let isValidSize = (size: number) => size / 1024 / 1024 < 10

let isValidResolution = (
  orientation: Orientation,
  width: number,
  height: number
) =>
  orientation === Orientation.any ||
  (orientation === Orientation.portrait && width < height) ||
  (orientation === Orientation.landscape && width > height)

let getResolution: any = (base64Img: string) => {
  return new Promise(resolve => {
    let image = new Image()
    image.onload = () => resolve({ width: image.width, height: image.height })
    image.src = base64Img
  })
}

let getBase64 = (file: Blob): Promise<string> => {
  return new Promise(resolve => {
    let reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.readAsDataURL(file)
  })
}

let stripBase64Img = (base64Img: string) => {
  return { images: [{ data: base64Img.split('base64,')[1] }] }
}

export type PhotoInputProps = BaseInputProps &
  UploadProps & {
    orientation?: Orientation
  }

export let PhotoInput: FC<PhotoInputProps> = ({
  orientation = Orientation.any,
  ...props
}) => {
  let { t } = useLang()

  let [{ value }, , helpers] = useField(props.name)
  let [base64Img, setBase64Img] = useState<string>('')
  let [loading, setLoading] = useState<boolean>(false)

  let validationErrors = {
    notSupported: t('common.validations.notSupportedFileType'),
    maxFileSize: `${t('common.validations.maxFileSize')}10MB.`,
    uploadError: t('common.imageUploadError'),
    invalidOrientation: t('common.validations.invalidResolution')
  }

  let beforeUpload = ({ type, size }: any) => {
    let [supported, validSize] = [isSupportedType(type), isValidSize(size)]
    if (!supported)
      notification.error({ message: validationErrors.notSupported })
    if (!validSize)
      notification.error({ message: validationErrors.maxFileSize })
    return supported && validSize
  }

  let loadImage = (file: Blob): Promise<string> =>
    new Promise((resolve, rejects) => {
      getBase64(file).then(base64Data => {
        setLoading(true)
        getResolution(base64Data).then(({ width, height }: any) => {
          if (isValidResolution(orientation, width, height)) {
            resolve(base64Data)
          }
          rejects('Invalid Resolution')
          return base64Data
        })
      })
    })

  let renderImage = (base64Data: string) => {
    setBase64Img(base64Img)
    return base64Data
  }

  let uploadImage = (base64Data: string) => {
    return new Promise(resolve => {
      notification.success({ message: t('common.successfullyExecuted') })
      resolve(true)
      //   imageUploadingService
      //     .create(stripBase64Img(base64Data))
      //     .then(({ images }) => {
      //       let [img] = images
      //       helpers.setValue(img)
      //       notification.success({ message: t('common.imageUploadSuccess') })
      //       resolve('')
      //     })
      //     .catch(() => {
      //       notification.error({ message: validationErrors.uploadError })
      //     })
    })
  }

  let startUpload = ({ file }: any) => {
    loadImage(file)
      .then(renderImage)
      .then(uploadImage)
      .catch(() => {
        notification.error({ message: validationErrors.invalidOrientation })
      })
      .finally(() => setLoading(false))
  }

  let imgSrc = value?.startsWith('http') ? value : base64Img

  return (
    <FormInputContainer {...props}>
      <Upload
        name="avatar"
        accept="image/*"
        listType="picture"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={startUpload}
      >
        <div
          style={{
            display: 'flex',
            padding: 7,
            backgroundColor: '#fafafa',
            border: '1px dashed #d9d9d9',
            borderRadius: '4px',
            justifyContent: 'flex-start'
          }}
        >
          {imgSrc ? (
            <img
              alt="invalid-url"
              style={{
                width: Orientation.portrait ? '100%' : '35em',
                height: 'auto',
                objectFit: 'contain',
                overflow: 'hidden'
              }}
              src={imgSrc}
            />
          ) : (
            <div
              style={{
                width: Orientation.landscape ? '10vw' : '5vw',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                padding: 20
              }}
            >
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
        </div>
      </Upload>
    </FormInputContainer>
  )
}
