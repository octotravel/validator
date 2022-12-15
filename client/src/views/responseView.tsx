import { FC } from 'react'
import { useFlowListManagement } from '../context/validationContext'
import { Accordion, Badge, Container, ProgressBar } from 'react-bootstrap'
import { FlowResult, ValidationResult } from '../types'
import ListView from '../components.tsx/listView'

const OutputView: FC = () => {
  const { flows, isLoading } = useFlowListManagement()
  const flowData: FlowResult[] = flows && flows
  const totalScenarios = flowData?.reduce((count, current) => count + current.scenarios.length, 0)

  const successScenarios = flowData.length > 0 ? flowData?.map(item => {
    return item.scenarios.filter(el => el.success === true)
  }).flat(1).length : ''
  
  const warningScenarios = flowData.length > 0 ? flowData.map(flow => {
    return flow.scenarios.filter(scenario => scenario.validationResult === ValidationResult.WARNING)
  }).flat(1).length : '';

  const errorScenarios = flowData.length > 0 ? flowData.map(flow => {
    return flow.scenarios.filter(scenario => scenario.validationResult === ValidationResult.FAILED)
  }).flat(1).length : '';

  return (
    <>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <ProgressBar animated now={100} />
          </div>
        ) : (
        <>
          {flows.length > 0 ? (
            <div className="mb-3">
              <div className="card w-full">
                <div className="card-body">
                  <Container>
                    <div className="mr-3 mb-3  py-2 text-capitalize">
                      <Badge bg='primary'>
                        {`${totalScenarios}`}
                      </Badge>
                      <strong className="px-2">Total Scenarios</strong>

                      <Badge className='ms-3 bg-green-lt'>
                        {`${successScenarios}`}
                      </Badge>
                      <strong className="px-2">Successful</strong>

                      <Badge className='ms-3 bg-yellow-lt'>
                        {`${warningScenarios}`}
                      </Badge>
                      <strong className="px-2">Warnings</strong>

                      <Badge className='ms-3 bg-red-lt'>
                        {`${errorScenarios}`}
                      </Badge>
                      <strong className="px-2">Critical Errors</strong>
                    </div>

                    <Accordion as="div" className=" h-50 bg-light">
                      {flowData?.map((flow, index) => {
                        return <ListView key={index} id={index.toString()} flow={flow} />
                      })}
                    </Accordion>
                  </Container>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>  
        )}
    </>
  )
}

export default OutputView
