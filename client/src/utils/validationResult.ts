import { ValidationResult } from '../types'

export const ResultColor = (result: ValidationResult): string => {
  switch (result) {
    case ValidationResult.SUCCESS:
      return 'bg-green-lt'
    case ValidationResult.FAILED:
      return 'bg-red-lt'
    case ValidationResult.WARNING:
      return 'bg-yellow-lt'
  }
}