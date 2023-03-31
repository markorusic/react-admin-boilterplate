import { useEffect } from 'react'
import { TranslationKeys, useLang } from '../localization'

export type HeadTitleProps = {
  title?: TranslationKeys
  unsafe_title?: string
}

export const HeadTitle = ({ title, unsafe_title }: HeadTitleProps) => {
  const { t } = useLang()
  const displayTitle = title ? t(title) : unsafe_title

  useEffect(() => {
    if (displayTitle) {
      document.title = displayTitle
    }
  }, [displayTitle])

  return null
}
