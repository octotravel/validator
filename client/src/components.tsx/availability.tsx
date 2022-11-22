import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'
import CustomDatePicker from './datePicker'

type IProps = {
  group: string
  title: string
  name: string
}

const Availability: FC<IProps> = ({ group, title, name }) => {
  return (
    <Row spacing={4}>
      <Col xs={12}>
        <div className="mb-3">
          <label className="form-label">{title}</label>

          <CustomDatePicker group={group} name={name} />
        </div>
      </Col>
    </Row>
  )
}

export default Availability
