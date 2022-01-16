import React from 'react'
import { Spin as BaseSpin, SpinProps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export let Spin: React.FC<SpinProps> = props => (
  <BaseSpin
    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
    {...props}
    delay={300}
  />
)
