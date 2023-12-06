import { StyleProvider } from '@ant-design/cssinjs'
import zhCN from 'antd/es/locale/zh_CN'
import type { PlasmoCSConfig } from 'plasmo'
import { render as reactRender } from 'rc-util/lib/React/render'
import './index.scss'
import { Button, ConfigProvider } from 'antd'

// 进行 content_scripts 的配置
export const config: PlasmoCSConfig = {
  matches: [
    'http://localhost:*/*',
    'https://elearning.test.zcygov.cn/*',
    'https://elearning-staging.zcygov.cn/*',
    'https://elearning.zcygov.cn/*',
    'https://e-learning.zcygov.cn/*',
    'https://www.baidu.com/*'
  ]
}

const primary = '#006bfd'
const hover = '#005DDD'

window.addEventListener('load', () => {
  console.log('content script loaded')

  const container = document.createElement('div')
  container.className = 'fixed top-0 right-0 z-[9999]'
  document.body.appendChild(container)

  reactRender(
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primary,
          colorPrimaryHover: hover,
          colorInfo: primary,
          colorInfoText: primary,
          colorLink: primary,
          colorLinkHover: hover,
          colorPrimaryText: primary,
          colorText: '#20242C',
          colorSuccess: '#26bd71',
          colorWarning: '#ff7900',
          colorError: '#f53f3f',
          zIndexPopupBase: 10000
        },
        components: {
          Button: {
            borderRadius: 16
          }
        }
      }}
      locale={zhCN}
      autoInsertSpaceInButton={false}>
      <StyleProvider hashPriority="high">
        <Button type="primary">按钮</Button>
      </StyleProvider>
    </ConfigProvider>,
    container
  )
})
