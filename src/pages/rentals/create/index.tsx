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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createRental } from 'apiSdk/rentals';
import { rentalValidationSchema } from 'validationSchema/rentals';
import { ToolInterface } from 'interfaces/tool';
import { UserInterface } from 'interfaces/user';
import { OutletInterface } from 'interfaces/outlet';
import { getTools } from 'apiSdk/tools';
import { getUsers } from 'apiSdk/users';
import { getOutlets } from 'apiSdk/outlets';
import { RentalInterface } from 'interfaces/rental';

function RentalCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RentalInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRental(values);
      resetForm();
      router.push('/rentals');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RentalInterface>({
    initialValues: {
      start_date: new Date(new Date().toDateString()),
      end_date: new Date(new Date().toDateString()),
      tool_id: (router.query.tool_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
      outlet_id: (router.query.outlet_id as string) ?? null,
    },
    validationSchema: rentalValidationSchema,
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
              label: 'Rentals',
              link: '/rentals',
            },
            {
              label: 'Create Rental',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Rental
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="start_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Start Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.start_date ? new Date(formik.values?.start_date) : null}
              onChange={(value: Date) => formik.setFieldValue('start_date', value)}
            />
          </FormControl>
          <FormControl id="end_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              End Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.end_date ? new Date(formik.values?.end_date) : null}
              onChange={(value: Date) => formik.setFieldValue('end_date', value)}
            />
          </FormControl>
          <AsyncSelect<ToolInterface>
            formik={formik}
            name={'tool_id'}
            label={'Select Tool'}
            placeholder={'Select Tool'}
            fetcher={getTools}
            labelField={'name'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<OutletInterface>
            formik={formik}
            name={'outlet_id'}
            label={'Select Outlet'}
            placeholder={'Select Outlet'}
            fetcher={getOutlets}
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
              onClick={() => router.push('/rentals')}
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
    entity: 'rental',
    operation: AccessOperationEnum.CREATE,
  }),
)(RentalCreatePage);
