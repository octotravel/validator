import { FC } from 'react'

interface Props {
  attr?: boolean
  last?: boolean
  level?: number
  value: boolean
}

const ResponseTreeBoolean: FC<Props> = ({ attr = false, last = true, level = 0, value }) => {
  const spacer = ' '.repeat(level)

  return (
    <>
      {!attr && spacer}
      <span className={`hljs-literal ${value === true ? 'text-success' : 'text-danger'}`}>{JSON.stringify(value)}</span>
      {!last && ','}
      {'\n'}
    </>
  )
}

export default ResponseTreeBoolean
