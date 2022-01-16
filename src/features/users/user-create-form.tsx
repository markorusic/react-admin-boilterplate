import React from 'react'
import { UserRole } from '../../core/auth'
import { RequireRole } from '../../core/auth/require-role'
import {
  CreateFormProps,
  Form,
  RadioInput,
  SubmitButton,
  TextInput
} from '../../core/form'
import { ButtonModal, createButtonModalProps } from '../../core/utils/modal'
import { validationSchemaAdapter } from '../../core/utils/validation-adapter'
import { UserMutationRequest, UserStatus } from './types'

export type UserCreateFormProps = CreateFormProps<UserMutationRequest>

export let UserCreateForm = (props: UserCreateFormProps) => {
  return (
    <Form
      {...props}
      validationSchema={validationSchemaAdapter(UserMutationRequest)}
      onSubmit={values => console.log('values', values)}
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
        options={(Object.keys(UserRole) as Array<keyof typeof UserRole>).map(
          key => ({
            value: UserRole[key],
            title: UserRole[key]
          })
        )}
      />
      <RadioInput
        name="status"
        label="common.status"
        options={(
          Object.keys(UserStatus) as Array<keyof typeof UserStatus>
        ).map(key => ({
          value: UserStatus[key],
          title: UserStatus[key]
        }))}
      />
      <SubmitButton />
    </Form>
  )
}

export let UserCreateButtonModal = () => {
  return (
    <RequireRole role={UserRole.superAdmin}>
      <ButtonModal {...createButtonModalProps}>
        <UserCreateForm />
      </ButtonModal>
    </RequireRole>
  )
}
