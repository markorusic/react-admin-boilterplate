import React from 'react'
import { BrowserRouter, Routes } from 'react-router-dom'
import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import { navigationRoutes } from './core/navigation'
import { lang } from './lang'

export let App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {navigationRoutes([
          {
            title: lang('pages.home'),
            path: '/',
            icon: <HomeOutlined />,
            element: <div>home</div>
          },
          {
            title: lang('pages.users'),
            path: '/users',
            icon: <UserOutlined />,
            element: <div>users</div>
          },
          {
            title: lang('pages.stagod'),
            path: '/stagod',
            icon: <UserOutlined />,
            element: <div>stagod</div>
          }
        ])}
      </Routes>
    </BrowserRouter>
  )
}
