import { FC } from 'react'

interface Props {
  attr?: boolean
  last?: boolean
  level?: number
  value: null
}

const ResponseTreeNil: FC<Props> = ({ attr = false, last = true, level = 0, value }) => {
  const spacer = ' '.repeat(level)

  return (
    <>
      {!attr && spacer}
      <span className="hljs-literal">{JSON.stringify(value)}</span>
      {!last && ','}
      {'\n'}
    </>
  )
}

export default ResponseTreeNil
