import React, { useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { notification, Upload, UploadProps } from 'antd'
import { useField } from 'formik'
import { BaseInputProps, FormInputContainer } from '.'
import { UploadFn } from './photo-input'
import { useLang } from '../localization'

type GalleryInputProps = UploadProps &
  BaseInputProps & {
    uploadFn: UploadFn
  }

export const GalleryInput = ({ uploadFn, ...props }: GalleryInputProps) => {
  let { t } = useLang()
  const [field, , helpers] = useField<string[]>(props.name)
  const [loading, setLoading] = useState(false)
  return (
    <FormInputContainer {...props}>
      <Upload
        listType="picture-card"
        onRemove={removed => {
          const filteredPaths = field.value.filter(path => removed.url !== path)
          helpers.setValue(filteredPaths)
        }}
        fileList={field.value.map((url, index) => ({
          url,
          uid: url + index,
          name: `Photo ${index}`,
          status: 'done'
        }))}
        customRequest={async ({ file }) => {
          try {
            setLoading(true)
            const path = await uploadFn(file)
            helpers.setValue([...field.value, path])
            notification.success({ message: t('common.uploadSuccess') })
          } catch (err: any) {
            notification.error({
              message: err?.response?.data?.message ?? t('common.uploadError')
            })
          } finally {
            setLoading(false)
          }
        }}
        {...props}
      >
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>{t('common.upload')}</div>
        </div>
      </Upload>
    </FormInputContainer>
  )
}
