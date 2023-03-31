import React, { ReactNode, FC, useEffect, useState, useMemo } from 'react'
import {
  Button,
  ButtonProps,
  ModalProps as BaseModalProps,
  Modal as BaseModal,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { TranslationKeys, useLang } from '../localization'

export type ModalInjectedProps = {
  on: boolean
  close: VoidFunction
  preventImmediateClosing: VoidFunction
  allowImmediateClosing: VoidFunction
}

const ModalContext = React.createContext<ModalInjectedProps | null>(null)

export type ModalProps = BaseModalProps & {
  on: boolean
  close: VoidFunction
  children: ReactNode | ((injectedProps: ModalInjectedProps) => ReactNode)
}

export const useModal = () => React.useContext(ModalContext)

export const Modal = ({ on, close, children, ...props }: ModalProps) => {
  const { t } = useLang()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const value: ModalInjectedProps = useMemo(
    () => ({
      on,
      close,
      preventImmediateClosing: () => setConfirmCancel(true),
      allowImmediateClosing: () => setConfirmCancel(false),
    }),
    [on, close, setConfirmCancel],
  )

  useEffect(() => {
    if (!on) {
      setConfirmCancel(false)
    }
  }, [on, setConfirmCancel])

  const onCancel = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (confirmCancel) {
      BaseModal.confirm({
        title: t('common.confirmModalClose'),
        onOk: close,
      })
    } else {
      close()
    }
  }

  const afterClose = () => {
    const otherModal: HTMLElement | null =
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
  title?: TranslationKeys
  unsafe_title?: string
  buttonProps?: ButtonProps
  modalProps?: BaseModalProps
  children: ModalProps['children']
}

export const ButtonModal: FC<ButtonModalProps> = ({
  title,
  unsafe_title,
  buttonProps,
  modalProps,
  children,
}) => {
  const { t } = useLang()
  const [on, setOn] = useState(false)
  const displayTitle = title ? t(title) : unsafe_title

  return (
    <>
      <Button {...buttonProps} onClick={() => setOn(true)}>
        {displayTitle}
      </Button>

      <Modal
        title={displayTitle}
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

export const createButtonModalProps: Omit<ButtonModalProps, 'children'> = {
  title: 'common.create',
  // modalProps: { width: 1200 },
  buttonProps: {
    type: 'primary',
    shape: 'round',
    icon: <PlusOutlined />,
  },
} as const
