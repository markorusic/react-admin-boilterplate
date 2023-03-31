import { Navigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from './auth-provider'
import { useLang } from '../localization'
import { Form, TextInput, SubmitButton } from '../form'
import { HeadTitle } from '../utils/head-title'
import { zMessage } from '../validation'

const Credentials = z.object({
  username: z.string(zMessage.required),
  password: z.string(zMessage.required),
})

export const Login = () => {
  const { t } = useLang()
  const { user, login } = useAuth()
  const location = useLocation()

  const from =
    (location.state as { from: Location } | undefined)?.from?.pathname || '/'

  if (user) {
    return <Navigate to={from} />
  }

  return (
    <div style={{ margin: '0 auto', width: 425, padding: 32 }}>
      <HeadTitle title="login.title" />
      <h1 style={{ textAlign: 'center' }}>{t('login.title')}</h1>
      <Form
        zValidationSchema={Credentials}
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
