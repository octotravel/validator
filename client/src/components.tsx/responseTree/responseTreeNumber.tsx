import { FC } from 'react'

interface Props {
  attr?: boolean
  last?: boolean
  level?: number
  value: number
}

const ResponseTreeNumber: FC<Props> = ({ attr = false, last = true, level = 0, value }) => {
  const spacer = ' '.repeat(level)

  return (
    <>
      {!attr && spacer}
      <span className="hljs-number">{value}</span>
      {!last && ','}
      {'\n'}
    </>
  )
}

export default ResponseTreeNumber
