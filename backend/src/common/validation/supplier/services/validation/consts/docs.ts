const baseUrl = 'https://docs.octo.travel/octo-api-core';

const supplier = `${baseUrl}/supplier`;
const products = `${baseUrl}/products`;
const product = `${baseUrl}/products#get-product`;
const availabilityCheck = `${baseUrl}/availability#availability-calendar`;
const availabilityCalendar = `${baseUrl}/availability#availability`;
const bookingReservation = `${baseUrl}/bookings#booking-reservation`;
const bookingReservationExtend = `${baseUrl}/bookings#extend-reservation`;
const bookingConfirmation = `${baseUrl}/bookings#booking-confirmation`;
const bookingCancellation = `${baseUrl}/bookings#booking-cancellation`;
const bookingUpdate = `${baseUrl}/bookings#booking-update`;
const bookingGet = `${baseUrl}/bookings#get-booking`;
const bookingList = `${baseUrl}/bookings#get-bookings`;

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
