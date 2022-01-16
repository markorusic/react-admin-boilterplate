import React, {
  cloneElement,
  ComponentType,
  FC,
  ReactElement,
  ReactNode,
  useEffect
} from 'react'
import dayjs from 'dayjs'
import {
  useFormikContext,
  useField,
  FormikConfig,
  Formik,
  Form as FormikFrom,
  FormikProps
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
  Switch
} from 'antd'
import { TextAreaProps as BaseTextAreaProps } from 'antd/lib/input'
import { DatePickerProps, DatePicker } from './date-picker'
import { useModal } from '../utils/modal'
import { SaveOutlined } from '@ant-design/icons'
import { Table, TableProps } from '../table'
import { ID, Identifiable } from '../types'
import { TranslationKeys, useLang } from '../localization'
import { DATE_FORMAT } from '../utils/date'

export type FormProps<T> = FormikConfig<T> & {
  successMessage?: TranslationKeys | null
  closeModalOnSubmit?: boolean
}

export type CreateFormProps<T = any> = Omit<
  FormProps<T>,
  'initialValues' | 'onSubmit'
> & {
  initialValues?: T
  refreshData?: () => void
}

export type UpdateFormProps<T> = Omit<FormProps<T>, 'onSubmit'> & {
  refreshData?: () => void
}

export let withForm = <Props, FormValues>(
  mapProps: (componentProps: Props) => FormProps<FormValues>,
  Component: ComponentType<FormikProps<FormValues>>
) => {
  return function InnerComponent(componentProps: Props) {
    return (
      <Form {...mapProps(componentProps)}>
        {formik => <Component {...formik} />}
      </Form>
    )
  }
}

export function Form<T>({
  children,
  successMessage = 'common.successfullyExecuted',
  enableReinitialize = true,
  closeModalOnSubmit = true,
  ...props
}: FormProps<T>) {
  let { t } = useLang()
  let modal = useModal()
  return (
    <Formik
      enableReinitialize={enableReinitialize}
      {...props}
      onSubmit={(values, helpers) =>
        props
          .onSubmit(values, helpers)
          // @ts-ignore
          ?.then(() => {
            if (successMessage) {
              notification.success({
                message: t(successMessage)
              })
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

let FormUI: FC = ({ children }) => {
  let formik = useFormikContext()
  let modal = useModal()

  useEffect(() => {
    if (formik.dirty) {
      modal?.preventImmediateClosing()
    } else {
      modal?.allowImmediateClosing()
    }
  }, [modal, formik.dirty])

  return (
    <FormikFrom
      onSubmit={event => {
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

export let FormInputContainer: FC<BaseInputProps> = ({
  name,
  label,
  unsafe_label = '',
  errorPosition = 'bottom',
  children
}) => {
  let { t } = useLang()
  let [, meta] = useField(name)
  let id = `${name}`

  let displayLabel = label ? t(label) : unsafe_label

  // TODO: this is hacky solution, consider something more better
  let errorValue = meta.error?.replace(name, displayLabel)

  let errorElement =
    meta.touched && meta.error ? (
      <div>
        <span style={{ color: 'red' }}>
          {t(errorValue as TranslationKeys) ?? errorValue}
        </span>
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

export let SubmitButton: FC<ButtonProps> = props => {
  let form = useFormikContext()
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
export let TextInput: FC<TextInputProps> = props => {
  let [field] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Input {...field} {...props} />
    </FormInputContainer>
  )
}

export type TextAreaProps = BaseInputProps & BaseTextAreaProps
export let TextAreaInput: FC<TextAreaProps> = props => {
  let [field] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Input.TextArea {...field} {...props} />
    </FormInputContainer>
  )
}

export type NumberInputProps = BaseInputProps & InputNumberProps
export let NumberInput: FC<NumberInputProps> = props => {
  let [field, , helpers] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <InputNumber
        {...field}
        {...props}
        onChange={value => helpers.setValue(value)}
      />
    </FormInputContainer>
  )
}

export type DateInputProps = BaseInputProps & DatePickerProps
export let DateInput: React.FC<DateInputProps> = props => {
  let [field, , helpers] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <DatePicker
        style={{ width: 180 }}
        format={DATE_FORMAT}
        {...props}
        {...field}
        value={dayjs(field.value)}
        onChange={value => helpers.setValue(value?.toString())}
      />
    </FormInputContainer>
  )
}

export type RadioInputProps = BaseInputProps & {
  options: { title: ReactNode; value: any }[]
}
export let RadioInput: FC<RadioInputProps> = ({ options, ...props }) => {
  let [field] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Radio.Group {...field}>
        {options.map(option => (
          <Radio key={option.value} value={option.value}>
            {option.title}
          </Radio>
        ))}
      </Radio.Group>
    </FormInputContainer>
  )
}

export type SwitchInputProps = BaseInputProps & SwitchProps
export let SwitchInput: FC<SwitchInputProps> = props => {
  let [field, , helpers] = useField(props.name)
  return (
    <FormInputContainer {...props}>
      <Switch
        {...props}
        checked={field.value}
        onChange={value => helpers.setValue(value)}
      />
    </FormInputContainer>
  )
}

export type TableInputProps<T extends Identifiable> = BaseInputProps &
  TableProps<T>
export let TableInput = <T extends Identifiable>(props: TableInputProps<T>) => {
  let [field, , helpers] = useField<ID[] | undefined>(props.name)
  let value = field.value ?? []

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
                : value.filter(id => id !== item.id)
            )
          }
        }}
      />
    </FormInputContainer>
  )
}
