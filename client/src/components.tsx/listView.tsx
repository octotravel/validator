import { FC } from 'react'
import { Accordion } from 'react-bootstrap'
import { FlowResult } from '../types'
import ResponseTree from './responseTree'
import Badge from 'react-bootstrap/Badge'
import { ResultColor } from './../utils/validationResult';
type IListView = {
  flow: FlowResult
  id: string
}

const ListView: FC<IListView> = ({ flow, id }) => {
  return (
    <Accordion.Item eventKey={id}>
      <Accordion.Header as="div" className="shadow-sm">
        <Badge as="span" className="w-5 p-1">
          {' '}
          {flow.succesScenarios}/{flow.totalScenarios}
        </Badge>

        <div className="px-3">
          <span className={`badge ${ResultColor(flow.validationResult)}`}>{`${
            flow.success ? 'SUCCESS' : 'FAILED'
          }`}</span>
        </div>
        <label className="w-50 text-truncate px-3 text-muted">{flow.name}</label>
        {flow.docs && <a className="w-50 text-truncate px-3 text-muted" href={flow.docs}>docs</a>}
      </Accordion.Header>
      <Accordion.Body as="div" className="h-25 .bg-gradient overflow-auto">
        <Accordion as="div" className=" h-50 bg-light">
          {flow?.scenarios.map((scenerio, index) => {
            return <ResponseTree key={index} id={index.toString()} scenario={scenerio} />
          })}
        </Accordion>
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default ListView
