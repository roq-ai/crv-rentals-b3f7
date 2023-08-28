import * as yup from 'yup';

export const outletValidationSchema = yup.object().shape({
  name: yup.string().required(),
  address: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zip_code: yup.string().required(),
  company_id: yup.string().nullable().required(),
});
