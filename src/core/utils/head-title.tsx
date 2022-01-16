import React from 'react'
import { TranslationKeys, useLang } from '../localization'

export type HeadTitleProps = {
  title?: TranslationKeys
  unsafe_title?: string
}

export let HeadTitle = ({ title, unsafe_title }: HeadTitleProps) => {
  let { t } = useLang()
  let displayTitle = title ? t(title) : unsafe_title

  React.useEffect(() => {
    if (displayTitle) {
      document.title = displayTitle
    }
  }, [displayTitle])

  return null
}
