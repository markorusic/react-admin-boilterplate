import React, { ReactNode, FC, useEffect, useState, useMemo } from 'react'
import {
  Button,
  ButtonProps,
  ModalProps as BaseModalProps,
  Modal as BaseModal
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useLang } from '../localization'

export type ModalInjectedProps = {
  on: boolean
  close: VoidFunction
  preventImmediateClosing: VoidFunction
  allowImmediateClosing: VoidFunction
}

let ModalContext = React.createContext<ModalInjectedProps | null>(null)

export type ModalProps = BaseModalProps & {
  on: boolean
  close: VoidFunction
  children: ReactNode | ((injectedProps: ModalInjectedProps) => ReactNode)
}

export let useModal = () => React.useContext(ModalContext)

export let Modal = ({ on, close, children, ...props }: ModalProps) => {
  let [confirmCancel, setConfirmCancel] = useState(false)

  let value: ModalInjectedProps = useMemo(
    () => ({
      on,
      close,
      preventImmediateClosing: () => setConfirmCancel(true),
      allowImmediateClosing: () => setConfirmCancel(false)
    }),
    [on, close, setConfirmCancel]
  )

  useEffect(() => {
    if (!on) {
      setConfirmCancel(false)
    }
  }, [on, setConfirmCancel])

  let onCancel = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (confirmCancel) {
      BaseModal.confirm({
        title: useLang().t('common.confirmModalClose'),
        onOk: close
      })
    } else {
      close()
    }
  }

  let afterClose = () => {
    let otherModal: HTMLElement | null =
      document.querySelector('.ant-modal-wrap')
    otherModal?.focus()
  }

  return (
    <ModalContext.Provider value={value}>
      <BaseModal
        footer={null}
        destroyOnClose
        style={{ top: 20 }}
        {...props}
        visible={on}
        onCancel={onCancel}
        afterClose={afterClose}
      >
        {typeof children === 'function' ? children(value) : children}
      </BaseModal>
    </ModalContext.Provider>
  )
}

export interface ButtonModalProps {
  title: string
  buttonProps?: ButtonProps
  modalProps?: BaseModalProps
  children: ModalProps['children']
}

export let ButtonModal: FC<ButtonModalProps> = ({
  title,
  buttonProps,
  modalProps,
  children
}) => {
  let [on, setOn] = useState(false)
  return (
    <>
      <Button {...buttonProps} onClick={() => setOn(true)}>
        {title}
      </Button>

      <Modal
        title={title}
        footer={null}
        destroyOnClose
        {...modalProps}
        on={on}
        close={() => setOn(false)}
      >
        {children}
      </Modal>
    </>
  )
}

export let createButtonModalProps = {
  title: 'common.create',
  modalProps: { width: 1200 },
  buttonProps: {
    type: 'primary',
    shape: 'round',
    icon: <PlusOutlined />
  }
} as const
