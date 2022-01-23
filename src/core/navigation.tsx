import React, { FC, ReactNode } from 'react'
import { Link, Outlet, Route, useLocation } from 'react-router-dom'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, PageHeader } from 'antd'
import { Login, RequireAuth, useAuth, UserRole } from './auth'
import { t, TranslationKeys, useLang } from './localization'
import { checkAccess } from './auth/require-role'
import { HeadTitle } from './utils/head-title'
import { useStoredState } from './utils/use-stored-state'

export type ChildNavigationItem = {
  title: TranslationKeys
  path: string
  element: ReactNode
  icon?: ReactNode
  hidden?: boolean
  role?: UserRole
}

export type GroupNavigationItem = Omit<
  ChildNavigationItem,
  'element' | 'path'
> & {
  children: ChildNavigationItem[]
}

type NavigationItem = ChildNavigationItem | GroupNavigationItem

function renderNavigationItem(item: ChildNavigationItem) {
  return (
    <Route
      key={item.path}
      path={item.path}
      element={<Container title={item.title}>{item.element}</Container>}
    />
  )
}

export function navigationRoutes(navigationItems: NavigationItem[]) {
  let { t } = useLang()
  let { user } = useAuth()
  let accessibleNavigationItems = navigationItems.filter(item => {
    return checkAccess(user, item.role)
  })

  return (
    <>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <PageLayout navigationItems={accessibleNavigationItems} />
          </RequireAuth>
        }
      >
        {accessibleNavigationItems.map(item => {
          if ('children' in item) {
            return item.children.map(renderNavigationItem)
          }
          return renderNavigationItem(item)
        })}
        <Route
          path="*"
          element={
            <Container title="page.notfound">
              <Button type="primary">
                <Link to="/">{t('notfound.backToHome')}</Link>
              </Button>
            </Container>
          }
        />
      </Route>
    </>
  )
}

type LayoutProps = {
  navigationItems?: NavigationItem[]
}

let PageLayout: FC<LayoutProps> = ({ navigationItems = [] }) => {
  let location = useLocation()
  let { t } = useLang()
  let { user, logout } = useAuth()
  let [collapsed, setCollapsed] = useStoredState('sider-collapsed', false)

  function renderMenuItem(item: ChildNavigationItem) {
    return (
      <Menu.Item key={item.path} icon={item.icon}>
        <Link to={item.path}>{t(item.title)}</Link>
      </Menu.Item>
    )
  }

  let visibleNavigationItems = navigationItems.filter(item => !item.hidden)
  let openSubmenueKeys = visibleNavigationItems
    .filter(item => {
      if ('children' in item) {
        let groupItem = item as GroupNavigationItem
        return groupItem.children.some(i => i.path === location.pathname)
      }
      return false
    })
    .map(item => item.title)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={openSubmenueKeys}
        >
          <Menu.SubMenu key="user" icon={<UserOutlined />} title={user?.name}>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
              {t('auth.logout')}
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Divider />

          {visibleNavigationItems.map(item => {
            if ('children' in item) {
              return (
                <Menu.SubMenu
                  key={item.title}
                  icon={item.icon}
                  title={t(item.title)}
                >
                  {item.children.map(renderMenuItem)}
                </Menu.SubMenu>
              )
            }
            return renderMenuItem(item)
          })}
        </Menu>
      </Layout.Sider>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

type ContainerProps = {
  title: TranslationKeys
}

let Container: FC<ContainerProps> = ({ title, children }) => {
  let { t } = useLang()
  return (
    <div style={{ width: '100%', padding: 16, position: 'relative' }}>
      <HeadTitle title={title} />
      <PageHeader
        style={{ padding: 0 }}
        title={t(title)}
        onBack={() => window.history.back()}
      />
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 4,
          marginTop: 8,
          padding: 16
        }}
      >
        {children}
      </div>
    </div>
  )
}
