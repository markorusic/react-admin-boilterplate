import { UserRole } from '@/core/auth'
import {
  CreateFormProps,
  Form,
  RadioInput,
  SubmitButton,
  TextInput
} from '@/core/form'
import { UserMutationRequest, UserStatus } from './types'

export type UserCreateFormProps = CreateFormProps<UserMutationRequest>

export let UserCreateForm = (props: UserCreateFormProps) => {
  return (
    <Form
      {...props}
      zValidationSchema={UserMutationRequest}
      initialValues={{
        name: '',
        email: '',
        role: UserRole.admin,
        status: UserStatus.active
      }}
    >
      <TextInput name="name" label="common.name" />
      <TextInput name="email" label="common.email" />
      <RadioInput
        name="role"
        label="common.role"
        options={Object.values(UserRole).map(value => ({
          value,
          title: value
        }))}
      />
      <RadioInput
        name="status"
        label="common.status"
        options={Object.values(UserStatus).map(value => ({
          value,
          title: value
        }))}
      />
      <SubmitButton />
    </Form>
  )
}
