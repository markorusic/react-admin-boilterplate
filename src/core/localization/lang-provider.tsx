import React, { createContext, FC, useContext } from 'react'
import { useStoredState } from '../utils/use-stored-state'
import { TranslationKeys } from './translation-keys'
import en from '../../lang/en.json'
import sr from '../../lang/sr.json'

export type LangSlugs = 'en' | 'sr'
export let defaultLang: LangSlugs = 'en'
export let langNames: Record<LangSlugs, string> = {
  en: 'English',
  sr: 'Srpski'
}

type Languages = Record<LangSlugs, Record<TranslationKeys, string>>
let langs: Languages = { en, sr }

const LangContext = createContext<LangSlugs>(defaultLang)
const ChangeLangContext = createContext<(slug: LangSlugs) => void>(() => {})

export let LangProvider: FC = ({ children }) => {
  let [lang, setLang] = useStoredState<LangSlugs>('lang', defaultLang)
  return (
    <LangContext.Provider value={lang}>
      <ChangeLangContext.Provider value={setLang}>
        {children}
      </ChangeLangContext.Provider>
    </LangContext.Provider>
  )
}

export let t = (key: TranslationKeys) => key

export let useLang = () => {
  let lang = useContext(LangContext)
  return {
    lang,
    t(key: TranslationKeys) {
      return langs?.[lang]?.[key] ?? key
    }
  }
}

export let useChangeLang = () => useContext(ChangeLangContext)
