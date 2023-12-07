import { StyleProvider } from '@ant-design/cssinjs'
// import './index.scss'

import { Button, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import cssText from 'data-text:~contents/index.scss'
import type { PlasmoCSConfig, PlasmoCSUIProps } from 'plasmo'
import { useCallback, useRef, type FC } from 'react'

import { getClosestText } from './utils'

const primary = '#006bfd'
const hover = '#005DDD'

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

export const getStyle = () => {
  const style = document.createElement('style')
  style.textContent = cssText
  return style
}

// focus事件
const focusEvent = new Event('focus', { bubbles: true, cancelable: true })
// input事件
const inputEvent = new Event('input', { bubbles: true, cancelable: true })
// change事件
const changeEvent = new Event('change', { bubbles: true, cancelable: true })
// blur事件
const blurEvent = new Event('blur', { bubbles: true, cancelable: true })

const addActiveStyle = (el: HTMLElement) => {
  el.setAttribute('form-autos-shadow', el.style.boxShadow)
  el.style.boxShadow = '#006bfd 0 0 1px 1px'
}

const clearActiveStyle = (el: HTMLElement) => {
  el.style.boxShadow = el.getAttribute('form-autos-shadow')
  el.removeAttribute('form-autos-shadow')
}

const MyPopup: FC<PlasmoCSUIProps> = ({ anchor }) => {
  // const [pageInputs, setPageInputs] = useState<HTMLInputElement[]>();
  const pageInputs = useRef<HTMLInputElement[]>([])
  const activeEl = useRef<HTMLElement>()

  const mouseoverElementHandler = useCallback((e: MouseEvent) => {
    const el = e.target as HTMLElement
    // 清除上一个的样式
    activeEl.current && clearActiveStyle(activeEl.current)
    // 更新当前el
    activeEl.current = el
    addActiveStyle(activeEl.current)

    document.addEventListener('click', clickElementHandler)
  }, [])

  const clickElementHandler = useCallback((e: MouseEvent) => {
    removeListener()
    const el = e.target as HTMLElement
    const inputs = Array.from(el.querySelectorAll('input'))
    pageInputs.current = inputs
  }, [])

  const removeListener = useCallback(() => {
    document.removeEventListener('mouseover', mouseoverElementHandler)
    document.removeEventListener('click', clickElementHandler)
  }, [])

  // 获取表单
  const getInputs = () => {
    removeListener()
    document.addEventListener('mouseover', mouseoverElementHandler)
  }

  const fillInputs = () => {
    const textInputs = pageInputs.current.filter(
      (input) => input.type === 'text'
    )

    const displayTextInputs = textInputs.filter((input) => {
      const inputComputedStyle = getComputedStyle(input)
      return (
        inputComputedStyle.display !== 'none' &&
        inputComputedStyle.visibility !== 'hidden' &&
        inputComputedStyle.opacity !== '0'
      )
    })

    displayTextInputs.forEach((input) => {
      console.log(input)
      // 分发事件 模拟用户输入
      // input.dispatchEvent(focusEvent)
      // input.dispatchEvent(inputEvent)
      // input.dispatchEvent(changeEvent)
      // input.dispatchEvent(blurEvent)

      console.log(getClosestText(input))
    })
  }

  return (
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
          colorError: '#f53f3f'
        }
      }}
      locale={zhCN}>
      <StyleProvider
        hashPriority="high"
        container={document.querySelector('plasmo-csui').shadowRoot}>
        <div className="fixed right-0 top-0 bg-[pink] text-[14px]">
          <Button type="primary" onClick={getInputs}>
            获取表单
          </Button>
          <Button type="primary" onClick={fillInputs}>
            填入表单
          </Button>
        </div>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default MyPopup
