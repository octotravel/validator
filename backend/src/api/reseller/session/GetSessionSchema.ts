import { object, string } from 'yup';

export interface GetSessionSchema {
  id: string;
}

export const getSessionSchema = object({
  id: string().uuid().required(),
});
