import { Button } from 'antd'
import { LangSlugs, langNames, useChangeLang, useLang } from '.'

export let LangSwitch = () => {
  let { lang } = useLang()
  let changeLang = useChangeLang()
  return (
    <div style={{ display: 'flex' }}>
      {Object.keys(langNames).map(langKey => (
        <div key={langKey} style={{ marginRight: '8px' }}>
          <Button
            type={langKey === lang ? 'primary' : 'default'}
            onClick={() => changeLang(langKey as LangSlugs)}
          >
            {langNames[langKey as LangSlugs]}
          </Button>
        </div>
      ))}
    </div>
  )
}
