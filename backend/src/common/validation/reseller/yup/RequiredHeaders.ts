import { CapabilityId } from '@octocloud/types';
import { $enum } from 'ts-enum-util';
import { string } from 'yup';

export const octoCapabilitiesValidator = string().test((capabilities, ctx) => {
  if (capabilities === undefined) {
    return ctx.createError({
      type: 'required',
      message: 'Octo-Capabilities header is required',
    });
  }

  if (capabilities === '') {
    return true;
  }

  let parsedCapabilities: string[];
  if (capabilities.includes(',')) {
    parsedCapabilities = capabilities
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  } else {
    parsedCapabilities = [capabilities.trim()];
  }

  const availableCapabilities = $enum(CapabilityId).getValues() as string[];

  for (const parsedCapability of parsedCapabilities) {
    if (!availableCapabilities.includes(parsedCapability)) {
      return ctx.createError({
        type: 'typeError',
        message: `Octo-Capabilities contains invalid value, all values must be one of the following: ${$enum(
          CapabilityId,
        )
          .getValues()
          .join(', ')}`,
      });
    }
  }

  return true;
});
