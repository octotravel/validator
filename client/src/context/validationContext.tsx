import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { ValidationContextData, FlowResult, PostData } from '../types'
import { BaseUrl } from '../config/config'

export const validationsContextDefaultValue: ValidationContextData = {
  flows: [],
  isLoading: false,
  error: '',
  fetchFlows: () => null,
  resetError: () => null,
}

export const ValidationContext = createContext<ValidationContextData>(validationsContextDefaultValue)

export function useProductsContextValue(): ValidationContextData {
  const [flows, setFlows] = useState<FlowResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFlows = useCallback(
    async (postData: PostData) => {
      setIsLoading(true)
      try {
        const response = await axios.post(BaseUrl, {backend: postData})
        const data = response?.data
        setFlows(data)
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 400) {
            setError(error.response.data.errorMessage)
          } else {
            setError('Invalid request!, please try again.')
          }
        } else {
          setError('Invalid request!, please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [setFlows]
  )

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  return useMemo(
    () => ({ flows, error, isLoading, fetchFlows, resetError }),
    [flows, isLoading, error, fetchFlows, resetError]
  )
}

export function useFlowListManagement(): any {
  const { flows, fetchFlows, isLoading, error, resetError }: ValidationContextData = useContext(ValidationContext)
  const handleFetchFlows = useCallback(
    (postData: PostData) => {
      fetchFlows(postData)
    },
    [fetchFlows]
  )
  return {
    handleFetchFlows,
    flows,
    isLoading,
    error,
    resetError,
  }
}
