import React from 'react'
import { Routes } from 'react-router-dom'
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import { navigationRoutes } from './core/navigation'
import { useLang } from './core/localization'
import { Settings } from './features/settings'

export let App = () => {
  let { t } = useLang()
  return (
    <Routes>
      {navigationRoutes([
        {
          title: t('page.home'),
          path: '/',
          icon: <HomeOutlined />,
          element: <div>{t('page.home')}</div>
        },
        {
          title: t('page.users'),
          path: '/users',
          icon: <UserOutlined />,
          element: <div>{t('page.users')}</div>
        },
        {
          title: t('page.settings'),
          path: '/settings',
          icon: <SettingOutlined />,
          element: <Settings />
        }
      ])}
    </Routes>
  )
}
