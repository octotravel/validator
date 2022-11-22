import * as yup from 'yup'
import { PostData } from '../types'

export const querySchema: yup.SchemaOf<PostData> = yup
  .object()
  .shape({
      type: yup.string().required('This field is required!'),
      endpoint: yup.string().required('This field is required!'),
      apiKey: yup.string().required('This field is required!'),
  })
  .required();