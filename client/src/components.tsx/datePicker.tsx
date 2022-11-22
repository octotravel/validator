import { FC } from 'react'
import { Col, Row } from 'react-bootstrap'

import { useFormContext } from 'react-hook-form'

type IFormInput = {
  group: string
  name?: string
}

const CustomDatePicker: FC<IFormInput> = ({ group, name }) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const errorTo = name === 'available' ? errors[group]?.available?.to : errors[group]?.unavailable?.to
  const errorFrom = name === 'available' ? errors[group]?.available?.from : errors[group]?.unavailable?.from

  const startDate = watch(`${group}.${name}.from`)


  return (
    <Row className="mb-2">
      <Col xs={12} sm={6} md={12} lg={6}>
        <div className="form-group">
          <span>
            <label className="form-label text-muted ">From</label>
          </span>
          <div className="input-icon mb-1">
            <input
              className={`form-control ${ errorFrom ? ' is-invalid' : ''}`}
              {...register(`${group}.${name}.from`)}
              type="date"
              autoComplete="off"
              name={`${group}.${name}.from`}
            />
          </div>
        </div>
        <small className={` ${errorFrom ? 'text-danger' : ''}`}>{`${errorFrom ? errorFrom?.message : ''}`}</small>
      </Col>

      <Col xs={12} sm={6} md={12} lg={6}>
        <div className="form-group">
          <span>
            <label className="form-label text-muted ">To</label>
          </span>
          <div className="input-icon mb-1">
            <input
              className={`form-control ${ errorTo ? ' is-invalid' : ''}`}
              {...register(`${group}.${name}.to`)}
              type="date"
              autoComplete="off"
              name={`${group}.${name}.to`}
              min={startDate}
            />
          </div>
        </div>
        <small className={` ${errorTo ? 'text-danger' : ''}`}>{`${errorTo ? errorTo?.message : ''}`}</small>
      </Col>
    </Row>
  )
}

export default CustomDatePicker
