import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from '@/core/query-provider'
import { LangProvider } from '@/core/localization'
import { AuthProvider } from '@/core/auth'
import { env } from './config/env'
import { auth } from './services/auth'
import { App } from './app'

import 'antd/dist/antd.min.css'
import './index.css'

if (!env.apiBaseUrl) {
  let module = import.meta.globEager('./mocks/browser.ts')['./mocks/browser.ts']
  let { worker } = module
  worker.start()
}

ReactDOM.render(
  <BrowserRouter>
    <QueryProvider>
      <LangProvider>
        <AuthProvider auth={auth}>
          <App />
        </AuthProvider>
      </LangProvider>
    </QueryProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
