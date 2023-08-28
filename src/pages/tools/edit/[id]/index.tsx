import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getToolById, updateToolById } from 'apiSdk/tools';
import { toolValidationSchema } from 'validationSchema/tools';
import { ToolInterface } from 'interfaces/tool';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';

function ToolEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<ToolInterface>(
    () => (id ? `/tools/${id}` : null),
    () => getToolById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ToolInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateToolById(id, values);
      mutate(updated);
      resetForm();
      router.push('/tools');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<ToolInterface>({
    initialValues: data,
    validationSchema: toolValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Tools',
              link: '/tools',
            },
            {
              label: 'Update Tool',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Tool
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={'Name'}
            props={{
              name: 'name',
              placeholder: 'Name',
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.description}
            label={'Description'}
            props={{
              name: 'description',
              placeholder: 'Description',
              value: formik.values?.description,
              onChange: formik.handleChange,
            }}
          />

          <FormControl
            id="availability"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.availability}
          >
            <FormLabel htmlFor="switch-availability">Availability</FormLabel>
            <Switch
              id="switch-availability"
              name="availability"
              onChange={formik.handleChange}
              value={formik.values?.availability ? 1 : 0}
            />
            {formik.errors?.availability && <FormErrorMessage>{formik.errors?.availability}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/tools')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'tool',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ToolEditPage);
