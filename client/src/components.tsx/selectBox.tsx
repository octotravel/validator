import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

type ISelectBox = {
  label: string
  value: string
  group: string
  subGroup?: string
}

const SelectBox: FC<ISelectBox> = ({ label, subGroup, value, group }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const regGroup = subGroup ? `${group}.${subGroup}` : group
  const err = subGroup ? errors[group]?.deliveryMethods : errors[group]


  return (
    <label
      className={`mb-3 border ${
        err && err !== undefined ? 'border-danger' : 'border-grey'
      }  rounded form-selectgroup-item flex-fill `}
    >
      <div className="form-check mt-1 ">
        <div className=" form-check-label d-flex align-items-center ">
          <div className="me-2 px-2">
            <input
              className={` form-check-input  ${err && err !== undefined ? 'is-invalid' : ''}`}
              type="checkbox"
              id={label}
              value={value}
              {...register(regGroup)}
            />
          </div>
          <div className="form-selectgroup-label-content d-flex align-items-center">
            <div>
              <div className="font-weight-medium">{label}</div>
            </div>
          </div>
        </div>
      </div>
    </label>
  )
}

export default SelectBox
