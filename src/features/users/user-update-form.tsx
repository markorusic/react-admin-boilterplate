import { UserRole } from '@/core/auth'
import {
  Form,
  FormProps,
  RadioInput,
  SubmitButton,
  TextInput
} from '@/core/form'
import { UserMutationRequest, UserStatus } from './types'

export type UserUpdateFormProps = FormProps<UserMutationRequest>

export let UserUpdateForm = (props: UserUpdateFormProps) => {
  return (
    <Form {...props} zValidationSchema={UserMutationRequest}>
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
