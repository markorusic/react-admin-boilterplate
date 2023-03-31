import { Button, Descriptions } from 'antd'
import { useAuth } from '@/core/auth'
import { useLang, LangSwitch } from '@/core/localization'

export const Settings = () => {
  const { t } = useLang()
  const { user, logout } = useAuth()

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Descriptions title={t('settings.myInfo')} bordered layout="vertical">
          <Descriptions.Item label={t('common.name')}>
            {user?.name}
          </Descriptions.Item>

          <Descriptions.Item label={t('common.role')}>
            {user?.role}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.actions')}>
            <Button danger onClick={logout}>
              {t('auth.logout')}
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div>
        <Descriptions title={t('settings.lang')} bordered layout="vertical">
          <Descriptions.Item label={t('settings.setLang')}>
            <LangSwitch />
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  )
}
