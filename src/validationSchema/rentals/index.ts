import * as yup from 'yup';

export const rentalValidationSchema = yup.object().shape({
  start_date: yup.date().required(),
  end_date: yup.date().nullable(),
  tool_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
  outlet_id: yup.string().nullable().required(),
});
