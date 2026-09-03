import { BookingContact, ContactField } from '@octocloud/types';

const SAMPLE_VALUES_BY_FIELD: Partial<Record<ContactField, BookingContact>> = {
  [ContactField.FIRST_NAME]: { firstName: 'John' },
  [ContactField.LAST_NAME]: { lastName: 'Doe' },
  [ContactField.EMAIL_ADDRESS]: { emailAddress: 'johndoe@mail.com' },
  [ContactField.PHONE_NUMBER]: { phoneNumber: '+15555550100' },
  [ContactField.COUNTRY]: { country: 'US' },
  [ContactField.NOTES]: { notes: 'Test note' },
  [ContactField.LOCALES]: { locales: ['en'] },
  [ContactField.POSTAL_CODE]: { postalCode: '10001' },
};

export abstract class ContactHelper {
  public static build = (requiredContactFields: ContactField[] = []): BookingContact => {
    const baseline: BookingContact = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'johndoe@mail.com',
      fullName: 'John Doe',
      notes: 'Test note',
    };

    return requiredContactFields.reduce<BookingContact>(
      (contact, field) => ({ ...contact, ...SAMPLE_VALUES_BY_FIELD[field] }),
      baseline,
    );
  };
}
