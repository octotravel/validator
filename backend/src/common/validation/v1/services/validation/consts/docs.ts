const baseUrl = 'https://docs.octo.travel/docs/octo';

const supplier = 'https://docs.octo.travel/octo-core/suppliers';
const products = 'https://docs.octo.travel/octo-core/products';
const product = products;
const availabilityCheck = 'https://docs.octo.travel/octo-core/availability';
const availabilityCalendar = availabilityCheck;
const bookingReservation = `${baseUrl}/813abcef90135-booking-reservation`;
const bookingReservationExtend = `${baseUrl}/2c7924ab9128f-extend-reservation`;
const bookingConfirmation = `${baseUrl}/def664af6bc1d-booking-confirmation`;
const bookingCancellation = `${baseUrl}/b5becc223e888-booking-cancellation`;
const bookingUpdate = `${baseUrl}/dae75e39ffd99-booking-update`;
const bookingGet = `${baseUrl}/9e220ab76d815-get-booking`;
const bookingList = `${baseUrl}/b1362f049cb6b-list-bookings`;

const docs = {
  supplier,
  products,
  product,
  availabilityCheck,
  availabilityCalendar,
  bookingReservation,
  bookingReservationExtend,
  bookingConfirmation,
  bookingCancellation,
  bookingUpdate,
  bookingGet,
  bookingList,
};

export default docs;
