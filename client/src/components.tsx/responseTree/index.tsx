import { FC } from 'react'
import { Accordion } from 'react-bootstrap'
import { ScenarioResult } from '../../types'
import * as R from 'ramda'
import ReponseTreeJson from './responseTreeJson'
import { StatusCodeColor } from '../../utils/statusCode'
import { ResultColor } from './../../utils/validationResult'

type IListView = {
  scenario: ScenarioResult
  id: string
}

const ResponseTree: FC<IListView> = ({ scenario, id }) => {
  const responseBodyState = scenario.response?.body !== null && scenario.response?.error === null;
  const responseIsNotNull =
    scenario.response?.body !== null && scenario.response?.body?.length === 0 && scenario.response?.error === null;
  const warnings = scenario.errors.filter(error => error.type === 'WARNING');
  const errors = scenario.errors.filter(error => error.type === 'CRITICAL');


  return (
    <Accordion.Item eventKey={id}>
      <Accordion.Header as="div" className=" accordio-header">
        <div>
          <span className={`badge ${ResultColor(scenario.validationResult)}`}>{`${
            scenario.success ? 'SUCCESS' : 'FAILED'
          }`}</span>
        </div>
        <label className=" px-3 text-muted">{scenario.name}</label>
      </Accordion.Header>
      <Accordion.Body as="div" className="h-25 .bg-gradient overflow-auto">
        <div className="card-body">
          <div className="mb-2">
            {scenario.description && <p className="mb-3 text-muted">{scenario.description}</p>}
            <strong className="mb-3 text-muted">url</strong>
          </div>

          <div className=" mb-3 py-2 square border w-full text-muted"><span className='badge badge-primary mx-2'>{scenario.request?.method}</span>{scenario.request?.url}</div>

          {scenario.request?.body && (
            <div>
              <div className="mb-2">
                <strong className=" mb-3 text-muted">req body</strong>
              </div>

              <div className=" mb-3 px-3 p-1 square border bg-light w-full " style={{ minHeight: '60px' }}>
                <pre
                  className={'text-muted'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    margin: 0,
                    maxHeight: '30vh',
                    whiteSpace: 'pre',
                  }}
                >
                  <code>{!R.isNil(scenario.request?.body) && <ReponseTreeJson value={scenario.request?.body} />}</code>
                </pre>
              </div>
            </div>
          )}
          {!responseIsNotNull && (
            <div>
              <div className="mb-2">
                <strong className="mb-3 px-2 text-muted">res body</strong>
                <span className={`badge  ${StatusCodeColor(scenario.response?.status ?? 0)}`}>{scenario.response?.status}</span>
              </div>

              <div className=" mb-3 px-3 p-1 square border w-full " style={{ minHeight: '70px' }}>
                {responseBodyState ? (
                  <pre
                    className={'text-muted'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      margin: 0,
                      maxHeight: '30vh',
                      whiteSpace: 'pre',
                    }}
                  >
                    <code>{!R.isNil(scenario.response?.body) && <ReponseTreeJson value={scenario.response?.body} />}</code>
                  </pre>
                ) : (
                  <pre
                    className={'text-muted'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      margin: 0,
                      maxHeight: '30vh',
                      whiteSpace: 'pre',
                    }}
                  >
                    <code>
                      {!R.isNil(scenario.response?.error) && <ReponseTreeJson value={scenario.response?.error?.body} />}
                    </code>
                  </pre>
                )}
              </div>
            </div>
          )}
          {warnings.length > 0 && (
            <div>
              <div className="mb-2">
                <strong className="badge bg-yellow-lt">warnings</strong>
              </div>

              <div className="mb-3  px-3 p-2 square border w-full text-muted" style={{ minHeight: '30px' }}>
                {warnings.map((err, index) => {
                  return <div key={index} className='px-2'><li>{err.message}</li></div>
                })}
              </div>
            </div>
          )}
          {errors.length > 0 && (
            <div>
              <div className="mb-2">
                <strong className="badge bg-red-lt">errors</strong>
              </div>

              <div className="mb-3  px-3 p-2 square border w-full text-muted" style={{ minHeight: '30px' }}>
                {errors.map((err, index) => {
                  return <div key={index} className='px-2'><li>{err.message}</li></div>
                })}
              </div>
            </div>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  )
}

export default ResponseTree
