export const StatusCodeColor = (status: number): string => {
  switch (status) {
    case 200:
      return 'bg-green-lt'
    case 400:
      return 'bg-red-lt'
    case 500:
      return 'bg-red-lt'
    default:
      return 'bg-yellow-lt'
  }
}
