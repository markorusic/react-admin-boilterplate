import React from 'react'
import { Routes } from 'react-router-dom'
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import { navigationRoutes } from './core/navigation'
import { useLang } from './core/localization'
import { Settings } from './features/settings'
import { UserTable } from './features/users/user-table'

export let App = () => {
  return (
    <Routes>
      {navigationRoutes([
        {
          path: '/',
          title: 'page.home',
          icon: <HomeOutlined />,
          element: <div>{useLang().t('page.home')}</div>
        },
        {
          path: '/users',
          title: 'page.users',
          icon: <UserOutlined />,
          element: <UserTable />
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
