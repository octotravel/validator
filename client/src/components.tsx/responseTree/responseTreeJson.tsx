import * as R from 'ramda'
import { FC } from 'react'
import { Json } from '../../types'
import ResponseTreeString from './reponseTreeString'
import ResponseTreeArray from './responseTreeArray'
import ResponseTreeBoolean from './responseTreeBoolean'
import ResponseTreeNil from './responseTreeNil'
import ResponseTreeNumber from './responseTreeNumber'
import ResponseTreeObject from './responseTreeObject'

interface Props {
  attr?: boolean
  last?: boolean
  level?: number
  onShowClick?: () => void
  show?: boolean
  value: Json
}

const ReponseTreeJson: FC<Props> = ({ attr = false, last = true, level = 0, onShowClick, show = true, value }) => {
  const props = {
    attr: attr,
    last: last,
    level: level,
    value: value,
  }

  switch (R.type(value)) {
    case 'Array':
      return <ResponseTreeArray {...props} onShowClick={onShowClick} show={show} />
    case 'Boolean':
      return <ResponseTreeBoolean {...props} />
    case 'Null':
      return <ResponseTreeNil {...props} />
    case 'Number':
      return <ResponseTreeNumber {...props} />
    case 'Object':
      return <ResponseTreeObject {...props} onShowClick={onShowClick} show={show} />
    case 'String':
      return <ResponseTreeString {...props} />
  }

  return <span />
}

export default ReponseTreeJson
