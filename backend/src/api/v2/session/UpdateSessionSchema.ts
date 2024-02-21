import { array, mixed, object, string } from 'yup';
import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';

export interface UpdateSessionSchema {
  id: string,
  name?: string;
  capabilities?: CapabilityId[];
}

export const updateSessionSchema = object({
  id: string().uuid().required(),
  name: string().optional(),
  capabilities: array()
    .of(mixed().oneOf([null, ...$enum(CapabilityId).getKeys()]))
    .optional(),
});
