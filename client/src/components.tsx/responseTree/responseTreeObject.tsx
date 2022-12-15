import * as R from 'ramda'
import { FC, useState } from 'react'

import { Json, JsonKey, JsonValue } from '../../types'
import ReponseTreeJson from './responseTreeJson'

interface ObjectItemProps {
  index: number
  length: number
  level?: number
  name: JsonKey
  spacer?: string
  value: JsonValue
}

const isFoldable = (value: JsonValue): boolean => {
  const type = R.type(value)

  return (type === 'Array' || type === 'Object') && !R.isEmpty(value)
}

const ObjectItem: FC<ObjectItemProps> = ({ index, length, level = 0, name, spacer = '', value }) => {
  const [showState, setShowState] = useState(true)
  const handleShow = () => {
    setShowState(_show => !_show)
  }
  const arrowCls = `highlighter-fold-arrow ${!showState ? 'folded' : ''}`

  return (
    <>
      {spacer}
      <span className="highlighter-attr">
        {isFoldable(value) && <span className={arrowCls} onClick={handleShow} />}
        <span className="hljs-attr">"{name}"</span>
        {': '}
      </span>
      <ReponseTreeJson
        attr={true}
        last={index === length}
        level={level}
        onShowClick={handleShow}
        show={showState}
        value={value}
      />
    </>
  )
}

interface Props {
  attr?: boolean
  last?: boolean
  level?: number
  onShowClick?: () => void
  show?: boolean
  value: Json
}

const ResponseTreeObject: FC<Props> = ({ attr = false, last = true, level = 0, onShowClick, show = false, value }) => {
  const entries = Object.entries(value)
  const spacer = ' '.repeat(level)
  const isEmpty = R.isEmpty(entries)
  const [showState, setShowState] = useState(true)

  if (isEmpty) {
    return (
      <>
        {!attr && spacer}
        {'{}'}
        {!last && ','}
        {'\n'}
      </>
    )
  }

  const handleShow = () => {
    setShowState(_show => !_show)
  }
  const length = entries.length - 1
  const levelNext = level + 2
  const spacerNext = ' '.repeat(levelNext)
  const arrowCls = `highlighter-fold-arrow ${!showState ? 'folded' : ''}`
  const isShown = (!attr && showState) || (attr && show)

  return (
    <>
      {attr ? (
        '{'
      ) : (
        <>
          {spacer}
          <span className="highlighter-attr">
            <span className={arrowCls} onClick={handleShow} />
            {'{'}
          </span>
        </>
      )}
      {isShown ? (
        <>
          {'\n'}
          {entries.map(([key, item], index) => (
            <ObjectItem
              index={index}
              key={key}
              length={length}
              level={levelNext}
              name={key}
              spacer={spacerNext}
              value={item}
            />
          ))}
          {spacer}
        </>
      ) : (
        <small className="highlighter-rest text-muted" onClick={attr ? onShowClick : handleShow}>
          {' ... '}
        </small>
      )}
      {'}'}
      {!last && ','}
      {'\n'}
    </>
  )
}

export default ResponseTreeObject
