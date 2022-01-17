import { Routes } from 'react-router-dom'
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import { navigationRoutes } from './core/navigation'
import { useLang } from './core/localization'
import { Settings } from './features/settings'
import { UsersPage } from './features/users/users-page'

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
          element: <UsersPage />
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
