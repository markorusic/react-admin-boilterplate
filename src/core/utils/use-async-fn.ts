import { DependencyList, useCallback, useEffect, useRef, useState } from 'react'

export type AsyncFn = (...args: any[]) => Promise<any>

export type AsyncState<T> = {
  loading: boolean
  error?: any
  value?: T
}

type StateFromAsyncFn<T extends AsyncFn> = AsyncState<Promise<ReturnType<T>>>

export type AsyncFnReturn<T extends AsyncFn = AsyncFn> = [
  StateFromAsyncFn<T>,
  T,
]

export function useAsyncFn<T extends AsyncFn>(
  fn: T,
  deps: DependencyList = [],
  initialState = { loading: false },
): AsyncFnReturn<T> {
  const [state, set] = useState<StateFromAsyncFn<T>>(initialState)

  const lastCallId = useRef(0)
  const mountedRef = useRef<boolean>(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const callback = useCallback((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current

    if (!state.loading) {
      set((prevState) => ({ ...prevState, loading: true }))
    }

    return fn(...args).then(
      (value) => {
        mountedRef.current &&
          callId === lastCallId.current &&
          set({ value, loading: false })

        return value
      },
      (error) => {
        mountedRef.current &&
          callId === lastCallId.current &&
          set({ error, loading: false })

        return error
      },
    ) as ReturnType<T>
  }, deps)

  return [state, callback as unknown as T]
}
