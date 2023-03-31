import React, {
  cloneElement,
  ComponentType,
  FC,
  ReactElement,
  ReactNode,
  useEffect,
} from 'react'
import dayjs from 'dayjs'
import {
  useFormikContext,
  useField,
  FormikConfig,
  Formik,
  Form as FormikFrom,
  FormikProps,
} from 'formik'
import {
  Button,
  ButtonProps,
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
  Radio,
  notification,
  SwitchProps,
  Switch,
} from 'antd'
import { TextAreaProps as BaseTextAreaProps } from 'antd/lib/input'
import { SaveOutlined } from '@ant-design/icons'
import { ZodSchema } from 'zod'
import { DatePickerProps, DatePicker } from './date-picker'
import { useModal } from '../utils/modal'
import { Table, TableProps } from '../table'
import { ID, Identifiable } from '../types'
import { TranslationKeys, useLang } from '../localization'
import { DATE_FORMAT } from '../utils/date'
import { validationSchemaAdapter } from '../utils/validation-adapter'

export type FormProps<T> = FormikConfig<T> & {
  successMessage?: TranslationKeys | null
  closeModalOnSubmit?: boolean
  zValidationSchema?: ZodSchema<T>
}

export type CreateFormProps<T = any> = Omit<FormProps<T>, 'initialValues'> & {
  initialValues?: T
}

export const withForm = <Props, FormValues>(
  mapProps: (componentProps: Props) => FormProps<FormValues>,
  Component: ComponentType<FormikProps<FormValues>>,
) => {
  return function InnerComponent(componentProps: Props) {
    return (
      <Form {...mapProps(componentProps)}>
        {(formik) => <Component {...formik} />}
      </Form>
    )
  }
}

export function Form<T>({
  children,
  successMessage,
  zValidationSchema,
  enableReinitialize = true,
  closeModalOnSubmit = true,
  ...props
}: FormProps<T>) {
  const { t } = useLang()
  const modal = useModal()

  return (
    <Formik
      enableReinitialize={enableReinitialize}
      validationSchema={
        zValidationSchema
          ? validationSchemaAdapter(zValidationSchema)
          : undefined
      }
      {...props}
      onSubmit={(values, helpers) =>
        props
          .onSubmit(values, helpers)
          // @ts-ignore
          ?.then(() => {
            if (successMessage) {
              notification.success({ message: t(successMessage) })
            }
            if (closeModalOnSubmit) {
              modal?.close()
            }
          })
          .catch((err: any) => {
            notification.error({ message: t('error.unknown') })
            return Promise.reject(err)
          })
      }
    >
      <FormUI>{children}</FormUI>
    </Formik>
  )
}

const FormUI: FC = ({ children }) => {
  const formik = useFormikContext()
  const modal = useModal()

  useEffect(() => {
    if (formik.dirty) {
      modal?.preventImmediateClosing()
    } else {
      modal?.allowImmediateClosing()
    }
  }, [modal, formik.dirty])

  return (
    <FormikFrom
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        if (!formik.isSubmitting) {
          formik.handleSubmit(event)
        }
      }}
    >
      {typeof children === 'function' ? children(formik) : children}
    </FormikFrom>
  )
}

export type BaseInputProps = {
  name: string
  label?: TranslationKeys
  unsafe_label?: string
  errorPosition?: 'top' | 'bottom'
}

export const FormInputContainer: FC<BaseInputProps> = ({
  name,
  label,
  unsafe_label = '',
  errorPosition = 'bottom',
  children,
}) => {
  const { t } = useLang()
  const [, meta] = useField(name)

  const id = `${name}`
  const displayLabel = label ? t(label) : unsafe_label

  const errorElement =
    meta.touched && meta.error ? (
      <div>
        <span style={{ color: 'red' }}>{t(meta.error as TranslationKeys)}</span>
      </div>
    ) : null

  return (
    <div style={{ marginBottom: 8 }}>
      <div>
        <label style={{ fontWeight: 500, cursor: 'pointer' }} htmlFor={id}>
          {displayLabel}
        </label>
      </div>
      {errorPosition === 'top' && errorElement}
      <div>{cloneElement(children as ReactElement, { id })}</div>
      {errorPosition === 'bottom' && errorElement}
    </div>
  )
}

export const SubmitButton: FC<ButtonProps> = (props) => {
  const form = useFormikContext()
  return (
    <div style={{ padding: '8px 0' }}>
      <Button
        type="primary"
        shape="round"
        icon={<SaveOutlined />}
        {...props}
        htmlType="submit"
        loading={form.isSubmitting}
      >
        {props.children ?? useLang().t('common.save')}
      </Button>
    </div>
  )
}

export type TextInputProps = BaseInputProps & InputProps
export const TextInput: FC<TextInputProps> = (props) => {
  const [field] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Input {...field} {...props} />
    </FormInputContainer>
  )
}

export type TextAreaProps = BaseInputProps & BaseTextAreaProps
export const TextAreaInput: FC<TextAreaProps> = (props) => {
  const [field] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Input.TextArea {...field} {...props} />
    </FormInputContainer>
  )
}

export type NumberInputProps = BaseInputProps & InputNumberProps
export const NumberInput: FC<NumberInputProps> = (props) => {
  const [field, , helpers] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <InputNumber
        {...field}
        {...props}
        onChange={(value) => helpers.setValue(value)}
      />
    </FormInputContainer>
  )
}

export type DateInputProps = BaseInputProps & DatePickerProps
export const DateInput: React.FC<DateInputProps> = (props) => {
  const [field, , helpers] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <DatePicker
        style={{ width: 180 }}
        format={DATE_FORMAT}
        {...props}
        {...field}
        value={dayjs(field.value)}
        onChange={(value) => helpers.setValue(value?.toString())}
      />
    </FormInputContainer>
  )
}

export type RadioInputProps = BaseInputProps & {
  options: { title: ReactNode; value: any }[]
}
export const RadioInput: FC<RadioInputProps> = ({ options, ...props }) => {
  const [field] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Radio.Group {...field}>
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.title}
          </Radio>
        ))}
      </Radio.Group>
    </FormInputContainer>
  )
}

export type SwitchInputProps = BaseInputProps & SwitchProps
export const SwitchInput: FC<SwitchInputProps> = (props) => {
  const [field, , helpers] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Switch
        {...props}
        checked={field.value}
        onChange={(value) => helpers.setValue(value)}
      />
    </FormInputContainer>
  )
}

export type TableInputProps<T extends Identifiable> = BaseInputProps &
  TableProps<T>
export const TableInput = <T extends Identifiable>(
  props: TableInputProps<T>,
) => {
  const [field, , helpers] = useField<ID[] | undefined>(props.name)
  const value = field.value ?? []

  return (
    <FormInputContainer errorPosition="top" {...props}>
      <Table
        {...props}
        rowSelection={{
          ...props.rowSelection,
          selectedRowKeys: value,
          onSelect: (item, selected) => {
            helpers.setValue(
              selected
                ? value.concat(item.id)
                : value.filter((id) => id !== item.id),
            )
          },
        }}
      />
    </FormInputContainer>
  )
}
