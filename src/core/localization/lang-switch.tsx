import React from 'react'
import { Button } from 'antd'
import { LangSlugs, langNames, useChangeLang, useLang } from '.'

export let LangSwitch = () => {
  let { lang } = useLang()
  let changeLang = useChangeLang()
  return (
    <>
      {Object.keys(langNames).map(langKey => (
        <Button
          key={langKey}
          type={langKey === lang ? 'primary' : 'default'}
          onClick={() => changeLang(langKey as LangSlugs)}
        >
          {langNames[langKey as LangSlugs]}
        </Button>
      ))}
    </>
  )
}
