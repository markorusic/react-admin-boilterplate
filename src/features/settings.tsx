import React from 'react'
import { useAuth } from '../core/auth'
import { useLang, LangSwitch } from '../core/localization'

export let Settings = () => {
  let { t } = useLang()
  let { user } = useAuth()
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3>{t('settings.myInfo')}</h3>
        <div>
          {t('common.name')}: {user?.name}
        </div>
        <div>
          {t('common.role')}: {user?.role}
        </div>
      </div>
      <div>
        <h3>{t('settings.lang')}</h3>
        <LangSwitch />
      </div>
    </div>
  )
}
