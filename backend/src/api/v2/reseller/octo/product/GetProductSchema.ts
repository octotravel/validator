import { object, string } from 'yup';
export interface GetProductSchema {
  productId: string;
}

export const getProductSchema = object({
  productId: string().uuid().required(),
});
