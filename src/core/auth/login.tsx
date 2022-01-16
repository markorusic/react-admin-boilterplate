import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from './auth-provider'
import { t, useLang } from '../localization'
import { Form, TextInput, SubmitButton } from '../form'
import { validationSchemaAdapter } from '../utils/validation-adapter'

let Credentials = z.object({
  username: z.string({ required_error: t('error.requiredField') }),
  password: z.string({ required_error: t('error.requiredField') })
})

export let Login = () => {
  let { t } = useLang()
  let { user, login } = useAuth()
  let location = useLocation()

  let from =
    (location.state as { from: Location } | undefined)?.from?.pathname || '/'

  if (user) {
    return <Navigate to={from} />
  }

  return (
    <div style={{ margin: '0 auto', width: 425, padding: 32 }}>
      <h1 style={{ textAlign: 'center' }}>{t('login.title')}</h1>
      <Form
        validationSchema={validationSchemaAdapter(Credentials)}
        initialValues={{ username: '', password: '' }}
        onSubmit={login}
      >
        <TextInput name="username" label="common.username" />
        <TextInput name="password" type="password" label="common.password" />
        <div style={{ textAlign: 'center' }}>
          <SubmitButton icon={null}>{t('auth.login')}</SubmitButton>
        </div>
      </Form>
    </div>
  )
}
