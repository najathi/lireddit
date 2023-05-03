import React, { useState } from 'react'
import { NextPage } from 'next';
import { Box, Button, Flex, Link, Spacer } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import InputField from '../../components/InputField';
import Wrapper from '../../components/Wrapper';
import { createUrqlClient } from '../../util/createUrqlClient';
import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../util/toErrorMap';

interface ChangePasswordProps {
    token: string;
}

const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
    const router = useRouter();
    const [, changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState('');

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({ token: token, newPassword: values.newPassword });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors);
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)
                    } else if (response.data?.changePassword.user) {
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mb={4}>
                            <InputField
                                name='newPassword'
                                placeholder='new password'
                                label="New Password"
                                type='password'
                            />
                        </Box>
                        {tokenError &&
                            <Flex mb={4}>
                                <Box mr={6} color="red">{tokenError}</Box>
                                <NextLink href="/forgot-password">
                                    <Link>click here to get a new one</Link>
                                </NextLink>
                                <Spacer mb={4} />
                            </Flex>
                        }
                        <Button
                            colorScheme='teal'
                            type='submit'
                            isLoading={isSubmitting}
                        >
                            change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default withUrqlClient(createUrqlClient)(ChangePassword);