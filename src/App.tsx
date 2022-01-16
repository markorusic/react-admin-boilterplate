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
          path: '/',
          title: 'page.home',
          icon: <HomeOutlined />,
          element: <div>{t('page.home')}</div>
        },
        {
          path: '/users',
          title: 'page.users',
          icon: <UserOutlined />,
          element: <div>{t('page.users')}</div>
        },
        {
          path: '/settings',
          title: 'page.settings',
          icon: <SettingOutlined />,
          element: <Settings />
        }
      ])}
    </Routes>
  )
}
