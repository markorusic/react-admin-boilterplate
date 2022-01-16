import React from 'react'
import { Button } from 'antd'
import {
  LangSlugs,
  langNames,
  useChangeLang,
  useLang
} from '../core/localization'

export let Settings = () => {
  let { t, lang } = useLang()
  let changeLang = useChangeLang()
  return (
    <div>
      <h3>{t('settings.lang')}</h3>
      {Object.keys(langNames).map(langKey => (
        <Button
          key={langKey}
          type={langKey === lang ? 'primary' : 'default'}
          onClick={() => changeLang(langKey as LangSlugs)}
        >
          {langNames[langKey as LangSlugs]}
        </Button>
      ))}
    </div>
  )
}
