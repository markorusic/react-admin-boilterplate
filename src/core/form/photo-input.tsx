import React, { useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { notification, Upload, UploadProps } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { useField } from 'formik'
import { useLang } from '../localization'
import { BaseInputProps, FormInputContainer } from '.'

export type UploadFn = (file: Blob | string | RcFile) => Promise<string>

type PhotoInputProps = UploadProps &
  BaseInputProps & {
    uploadFn: UploadFn
  }

export function PhotoInput({ uploadFn, ...props }: PhotoInputProps) {
  const { t } = useLang()
  const [field, , helpers] = useField<string>(props.name)
  const [loading, setLoading] = useState(false)
  return (
    <FormInputContainer {...props}>
      <Upload
        listType="picture-card"
        showUploadList={false}
        customRequest={async ({ file }) => {
          try {
            setLoading(true)
            const path = await uploadFn(file)
            helpers.setValue(path)
            notification.success({ message: t('common.uploadSuccess') })
          } catch (err: any) {
            notification.error({
              message: err?.response?.data?.message ?? t('common.uploadError'),
            })
          } finally {
            setLoading(false)
          }
        }}
        {...props}
      >
        {field.value ? (
          <div>
            <img
              alt=""
              src={field.value}
              style={{
                width: '100%',
                height: 'auto',
                overflow: 'hidden',
                objectFit: 'contain',
              }}
            />
          </div>
        ) : (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>{t('common.upload')}</div>
          </div>
        )}
      </Upload>
    </FormInputContainer>
  )
}
