import React, { FC, ReactNode } from 'react'
import { Link, Route, useLocation } from 'react-router-dom'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Menu, PageHeader } from 'antd'
import { RequireAuth, useAuth } from './auth'
import { useLang } from './localization'

export type NavigationItem = {
  title: string
  path: string
  element: ReactNode
  icon?: ReactNode
  hidden?: boolean
}

export let navigationRoutes = (navigationItems: NavigationItem[]) => {
  return (
    <>
      {navigationItems.map(item => {
        return (
          <Route
            key={item.path}
            path={item.path}
            element={
              <RequireAuth>
                <PageLayout
                  title={item.title}
                  navigationItems={navigationItems}
                >
                  {item.element}
                </PageLayout>
              </RequireAuth>
            }
          />
        )
      })}
      <Route
        path="*"
        element={
          <PageLayout
            title={useLang().t('page.notfound')}
            navigationItems={navigationItems}
          />
        }
      />
    </>
  )
}

export type PageLayoutProps = {
  title: string
  navigationItems?: NavigationItem[]
}

export let PageLayout: FC<PageLayoutProps> = ({
  title,
  navigationItems = [],
  children
}) => {
  let location = useLocation()
  let { t } = useLang()
  let { user, logout } = useAuth()

  let visibleNavigationItems = navigationItems.filter(item => !item.hidden)

  return (
    <main style={{ maxWidth: 1440, margin: '0 auto' }}>
      <Menu
        mode="horizontal"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Menu.SubMenu key="user" icon={<UserOutlined />} title={user?.name}>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
            {t('auth.logout')}
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>

      <div style={{ display: 'flex' }}>
        <Menu selectedKeys={[location.pathname]} style={{ minWidth: 200 }}>
          {visibleNavigationItems.map(item => (
            <Menu.Item key={item.path} icon={item.icon}>
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <div style={{ width: '100%', padding: 16, position: 'relative' }}>
          <PageHeader
            style={{ padding: 0 }}
            title={title}
            onBack={() => window.history.back()}
          />
          <div style={{ paddingTop: 8 }}>{children}</div>
        </div>
      </div>
    </main>
  )
}
