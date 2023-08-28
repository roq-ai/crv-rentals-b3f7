import * as yup from 'yup';

export const toolValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().nullable(),
  availability: yup.boolean().required(),
  company_id: yup.string().nullable().required(),
});
