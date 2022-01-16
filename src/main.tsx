import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { LangProvider } from './core/localization'
import { App } from './app'

import 'antd/dist/antd.min.css'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <LangProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LangProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
