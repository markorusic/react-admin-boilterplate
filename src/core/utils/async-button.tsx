import React, { FC, useEffect } from 'react'
import { Button, ButtonProps, notification } from 'antd'
import { useAsyncFn } from './use-async-fn'
import { useLang } from '../localization'

export interface AsyncButtonProps extends ButtonProps {
  asyncFn: () => Promise<any>
}

export let AsyncButton: FC<AsyncButtonProps> = ({ asyncFn, ...props }) => {
  let [state, fn] = useAsyncFn(asyncFn)

  useEffect(() => {
    if (state.error) {
      notification.open({
        type: 'error',
        message:
          state.error?.response?.data?.message ?? useLang().t('error.unknown')
      })
    }
  }, [state.error])

  return <Button {...props} onClick={() => fn()} loading={state.loading} />
}
