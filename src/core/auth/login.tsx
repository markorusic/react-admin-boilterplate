import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth-provider'
import { useLang } from '../localization'
import { AsyncButton } from '../utils/async-button'

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
      <div style={{ textAlign: 'center' }}>
        <AsyncButton
          asyncFn={() => login({ username: 'Jon Doe', password: '123' })}
        >
          {t('auth.login')}
        </AsyncButton>
      </div>
    </div>
  )
}
