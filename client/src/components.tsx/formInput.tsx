import { FC } from 'react'
import { useFormContext } from 'react-hook-form'

type IFormInput = {
  name: string
  label: string
  required: boolean
}

const FormInput: FC<IFormInput> = ({ label, name, required }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="mb-3 mt-2">
      <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
      <input
        {...register(name)}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        autoComplete="off"
        name={name}
      />

      <div className="invalid-feedback">{`${errors[name] ? errors[name]?.message : ''}`}</div>
    </div>
  )
}

export default FormInput
