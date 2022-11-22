import * as R from 'ramda'
import { FC, useState } from 'react'
import { Json } from '../../types'

import ReponseTreeJson from './responseTreeJson'

interface Props {
  attr?: boolean
  last?: boolean
  level?: number
  onShowClick?: () => void
  show?: boolean
  value: Json
}

const ResponseTreeArray: FC<Props> = ({ attr = false, last = true, level = 0, onShowClick, show = false, value }) => {
  const spacer = ' '.repeat(level)
  const isEmpty = R.isEmpty(value)
  const [showState, setShowState] = useState(level === 0)

  if (isEmpty) {
    return (
      <>
        {!attr && spacer}
        {'[]'}
        {!last && ','}
        {'\n'}
      </>
    )
  }

  const handleShow = () => {
    setShowState(_show => !_show)
  }
  const length = value.length - 1
  const levelNext = level + 2
  const arrowCls = `highlighter-fold-arrow ${!showState ? 'folded' : ''}`
  const isShown = (!attr && showState) || (attr && show)

  return (
    <>
      {attr ? (
        '['
      ) : (
        <>
          {spacer}
          <span className="highlighter-attr">
            <span className={arrowCls} onClick={handleShow} />
            {'['}
          </span>
        </>
      )}
      {isShown ? (
        <>
          {'\n'}
          {value.map((item: Json, index: number) => (
            <ReponseTreeJson key={index} last={index === length} level={levelNext} value={item} />
          ))}
          {spacer}
        </>
      ) : (
        <small className="highlighter-rest text-muted" onClick={attr ? onShowClick : handleShow}>
          {' ... '}
        </small>
      )}
      {']'}
      {!last && ','}
      {'\n'}
    </>
  )
}

export default ResponseTreeArray
