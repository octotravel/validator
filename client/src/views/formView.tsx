import { Col, Row, Button, Container } from 'react-bootstrap'
import { FC, useEffect } from 'react'
import FormInput from '../components.tsx/formInput'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useFlowListManagement } from '../context/validationContext'
import { PostData } from '../types'
import { ToastContainer, toast } from 'react-toastify'
import { usePersistForm } from '../components.tsx/usePersitForm'
import 'react-toastify/dist/ReactToastify.css'
import { yupResolver } from '@hookform/resolvers/yup'
import { querySchema } from '../schema/Schema'

const FormInputView: FC = () => {
  const { handleFetchFlows, error, isLoading, resetError } = useFlowListManagement()
  const methods = useForm<PostData>({
    resolver: yupResolver(querySchema)
  })

  const {
    handleSubmit,
    watch,
    setValue,
  } = methods

  usePersistForm<PostData>({
    formName: 'FORM_DATA_KEY',
    watch,
    setValue,
    shouldDirty: true,
  })

  useEffect(() => {
    if (error) {
      toast.error(error as any, {
        position: 'top-right',
        autoClose: 5000,
        onClose() {
          resetError()
        },
      })
    }
  }, [error, resetError])

  const onSubmitHandler: SubmitHandler<PostData> = values => {
    handleFetchFlows(values)
  }

  const handleResetForm = () => {
    localStorage.removeItem('FORM_DATA_KEY')
    window.location.reload()
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <fieldset className=" bg-white form-fieldset">
          <ToastContainer />
          <Container>
            <Row className="py-2" spacing={4}>
              <Col xs={12} sm={6} md={4}>
                <FormInput label="Endpoint" name="endpoint" required={true} />
              </Col>
              <Col xs={12} sm={6} md={4}>
                <FormInput label="Api Key" name="apiKey" required={true} />
              </Col>
            </Row>
            <Row>
              <Col className=" d-flex justify-content-start ">
                <Button className="mt-3" type="submit" disabled={isLoading}>
                  Validate
                </Button>
              </Col>
              <Col className=" d-flex justify-content-end ">
                <Button className="mt-3 btn btn-light text-blue  " type="button" onClick={handleResetForm}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Container>
        </fieldset>
      </form>
    </FormProvider>
  )
}

export default FormInputView
