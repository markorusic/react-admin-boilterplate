import React from 'react'
import { useLang, LangSwitch } from '../core/localization'

export let Settings = () => {
  let { t } = useLang()
  return (
    <div>
      <h3>{t('settings.lang')}</h3>
      <LangSwitch />
    </div>
  )
}
