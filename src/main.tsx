import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './core/query-provider'
import { LangProvider } from './core/localization'
import { AuthProvider } from './core/auth'
import { App } from './app'

import 'antd/dist/antd.min.css'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <LangProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LangProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
