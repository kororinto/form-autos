import { StyleProvider } from '@ant-design/cssinjs'
// import './index.scss'

import { Button, ConfigProvider, Form, Input, List } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import cssText from 'data-text:~contents/index.scss'
import type { PlasmoCSConfig, PlasmoCSUIProps } from 'plasmo'
import { useCallback, useMemo, useRef, useState, type FC } from 'react'

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
  const presets = localStorage.getItem('form-autos-presets')
    ? JSON.parse(localStorage.getItem('form-autos-presets'))
    : []

  const [pageInputs, setPageInputs] = useState<HTMLInputElement[]>([])
  const activeEl = useRef<HTMLElement>()
  const [presetVisible, setPresetVisible] = useState(false)

  const [form] = Form.useForm()

  // 文本输入框
  const textInputs = useMemo(
    () =>
      pageInputs?.filter((input) => {
        const inputComputedStyle = getComputedStyle(input)
        return (
          input.type === 'text' &&
          inputComputedStyle.display !== 'none' &&
          inputComputedStyle.visibility !== 'hidden' &&
          inputComputedStyle.opacity !== '0'
        )
      }) || [],
    [pageInputs]
  )

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
    inputs.forEach((input) => {
      console.log(input)

      input.setAttribute('form-autos-label', getClosestText(input))
    })
    setPageInputs(inputs)
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

  const fillInputs = useCallback(() => {}, [textInputs])

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
        <div className="fixed right-0 top-0 bg-blank text-[14px] h-[100vh] shadow-left rounded-l-[8px] min-w-[500px] max-w-[800px] flex">
          <div>
            {/* header */}
            <div className="flex justify-center p-[16px] gap-x-[16px] border-b border-gray-4">
              <Button type="primary" onClick={getInputs}>
                获取表单
              </Button>
              <Button
                type="primary"
                onClick={() => setPresetVisible(!presetVisible)}>
                预设
              </Button>
            </div>
            {/* content */}
            <div className="p-[16px] flex flex-col gap-y-[12px]">
              <Form form={form} labelCol={{ span: 8 }} className="!pr-[100px]">
                {textInputs.map((item, index) => (
                  <Form.Item
                    name={item.id}
                    label={item.getAttribute('form-autos-label')}
                    key={index}>
                    <Input
                      onChange={(e) => {
                        item.value = e.target.value
                        // 分发事件 模拟用户输入
                        item.dispatchEvent(focusEvent)
                        item.dispatchEvent(inputEvent)
                        item.dispatchEvent(changeEvent)
                        item.dispatchEvent(blurEvent)
                      }}
                    />
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      presets.push(JSON.stringify(form.getFieldsValue()))
                      localStorage.setItem('form-autos-presets', presets)
                    }}>
                    存为预设
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          {presetVisible && (
            <div className="w-[200px] flex-shrink-0 flex-grow-0 h-full border-r border-gray-4">
              <List>
                {presets.map((preset, index) => (
                  <List.Item key={index}>
                    {preset}
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </div>
      </StyleProvider>
    </ConfigProvider>
  )
}

export default MyPopup
