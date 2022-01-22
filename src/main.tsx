import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './core/query-provider'
import { LangProvider } from './core/localization'
import { AuthProvider } from './core/auth'

import 'antd/dist/antd.min.css'
import './index.css'
import { App } from './app'

if (process.env.NODE_ENV === 'development') {
  let module = import.meta.globEager('./mocks/browser.ts')['./mocks/browser.ts']
  let { worker } = module
  worker.start()
}

ReactDOM.render(
  <BrowserRouter>
    <QueryProvider>
      <LangProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LangProvider>
    </QueryProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
