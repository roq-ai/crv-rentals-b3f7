import { Box, Button, Flex, IconButton, Link, Stack, Text } from '@chakra-ui/react';
import { clientConfig } from 'config';
import { OpenLinkIcon } from 'icons/open-link-icon';
import useAxiosFetch from 'lib/hooks/use-axios-fetch';
import { Dispatch, ReactNode, SetStateAction, useMemo } from 'react';
import { FiX } from 'react-icons/fi';

interface ConfigureCodeBannerProps {
  isBannerVisible: boolean;
  setIsBannerVisible: Dispatch<SetStateAction<boolean>>;
}

export default function ConfigureCodeBanner(props: ConfigureCodeBannerProps) {
  const { isBannerVisible, setIsBannerVisible } = props;
  const { data } = useAxiosFetch(clientConfig.roq.consoleServiceURL, {
    method: 'POST',
    data: { query: `{ environmentOnboardingUrls { editModelUrl localInstallationUrl } }` },
  });
  const { editModelUrl, localInstallationUrl } = useMemo(() => data?.data?.environmentOnboardingUrls ?? {}, [data]);

  return (
    <Box
      as="section"
      height="3rme"
      background="var(--chakra-colors-chakra-body-bg)"
      padding="0"
      display={isBannerVisible ? 'block' : 'none'}
      position="sticky"
      top="0"
      zIndex={2000}
    >
      <Stack
        bg="neutral.main"
        padding={{ base: '0.5rem 1.125rem', md: '0rem 1.125rem' }}
        direction="row"
        spacing={{ base: '3', md: '4' }}
        align="center"
        justify="space-between"
      >
        <Box></Box>
        <Flex
          justifyContent="center"
          alignItems="center"
          direction={{ base: 'column', md: 'row' }}
          flex="1"
          textAlign="center"
        >
          <Text color="neutral.content" fontSize="0.875rem" fontWeight={600}>
            In order to configure your application visit ROQ Console
          </Text>
          <Flex>
            {!editModelUrl && !localInstallationUrl ? (
              <ButtonLink href="https://console.roq.tech">Open console</ButtonLink>
            ) : (
              <>
                {editModelUrl && <ButtonLink href={editModelUrl}>Edit data model</ButtonLink>}
                {localInstallationUrl && <ButtonLink href={localInstallationUrl}>Start local installation</ButtonLink>}
              </>
            )}
          </Flex>
        </Flex>
        <IconButton
          icon={<FiX />}
          variant="tertiary"
          color="base.100"
          aria-label="Close banner"
          opacity="0.4000000059604645"
          onClick={() => {
            setIsBannerVisible(false);
          }}
        />
      </Stack>
    </Box>
  );
}

const ButtonLink: React.FC<{ href: string; children: ReactNode }> = ({ href, children }) => (
  <Link href={href} style={{ textDecoration: 'none' }} target="_blank">
    <Button
      borderRadius="0.375rem"
      background="primary.main"
      fontSize="0.75rem"
      fontWeight={600}
      ml="2"
      color="white"
      height="1.5rem"
      padding="0rem 0.5rem"
      justifyContent="center"
      _hover={{
        color: 'primary.main',
        background: 'primary.transparent',
      }}
    >
      {' '}
      {children}
      <OpenLinkIcon width="0.75rem" height="0.75rem" ml="1" />
    </Button>
  </Link>
);
