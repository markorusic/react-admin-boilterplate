import { useState, useEffect } from 'react'

export let useStoredState = <T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  let [value, setValue] = useState(() => {
    try {
      let rawValue = localStorage.getItem(key)
      if (rawValue) {
        let parsedValue = JSON.parse(rawValue) as T
        return parsedValue || defaultValue
      }
    } catch (error) {}
    return defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
