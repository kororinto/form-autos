import { useState } from 'react'

import './style.css'
import { Input } from 'antd'

function IndexPopup() {
  const [data, setData] = useState('')

  return (
    <div className="flex flex-col p-[16px] w-[300px]">
      <div className="whitespace-nowrap">
        Welcome to your
        <a href="https://www.plasmo.com" target="_blank">
          {' '}
          Plasmo
        </a>{' '}
        Extension!
      </div>
      <Input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
