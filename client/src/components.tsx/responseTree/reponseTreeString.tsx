import { FC } from 'react'

interface Props {
  attr?: boolean
  last?: boolean
  level?: number
  value: string
}

const ResponseTreeString: FC<Props> = ({ attr = false, last = true, level = 0, value }) => {
  const spacer = ' '.repeat(level)

  return (
    <>
      {!attr && spacer}
      <span className="hljs-string">{JSON.stringify(value)}</span>
      {!last && ','}
      {'\n'}
    </>
  )
}

export default ResponseTreeString
