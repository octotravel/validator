import { Row, Col, Container } from 'react-bootstrap'

import { FC } from 'react'
import Header from '../components.tsx/header'
import FormInputView from './formView'
import OutputView from './responseView'

const HomeView = () => {
  return (
    <Container>
      <Header title="Validation" />
      <Container>
        <Row>
          <Col md={12} xs={12}>
            <FormInputView />
          </Col>
          <Col md={12} xs={12}>
            <OutputView />
          </Col>
        </Row>
      </Container>
    </Container>
  )
}

export default HomeView
