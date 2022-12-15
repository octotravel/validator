import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

type IFormSelectt = {
  name: string
  label: string
  required: boolean
  options: Array<string>
}

const FormSelect: FC<IFormSelectt> = ({ label, name, required, options }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="mb-3 mt-2">
      <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
      <select
        {...register(name)}
        className={`form-control form-select ${errors[name] ? 'is-invalid' : ''}`}
        autoComplete="off"
        name={name}>
          {options.map(option => {
            return (<option value={option} key={option}>{option}</option>)
          })}
        </select>

      <div className="invalid-feedback">{`${errors[name] ? errors[name]?.message : ''}`}</div>
    </div>
  )
}

export default FormSelect
