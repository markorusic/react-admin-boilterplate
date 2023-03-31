import { useState, useEffect } from 'react'

export const useStoredState = <T>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState(() => {
    try {
      const rawValue = localStorage.getItem(key)
      if (rawValue) {
        const parsedValue = JSON.parse(rawValue) as T
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
