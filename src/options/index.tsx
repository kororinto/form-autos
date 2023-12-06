import { useState } from 'react'

import './index.scss'

import { Input } from 'antd'

const Options = () => {
  const [data, setData] = useState('')

  return (
    <div className="flex flex-col p-[16px] w-[300px]">
      There is options page!
    </div>
  )
}

export default Options
