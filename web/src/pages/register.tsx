import React from 'react'
import { Form, Formik } from 'formik'
import { Box, Button } from '@chakra-ui/react';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../util/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../util/createUrqlClient';

interface RegisterProps { }

const Register: React.FC<RegisterProps> = ({ }) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values)
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors))
                    } else if (response.data?.register.user) {
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mb={4}>
                            <InputField
                                name='username'
                                placeholder='username'
                                label="Username"
                            />
                        </Box>

                        <Box mb={4}>
                            <InputField
                                name='password'
                                placeholder='password'
                                label="Password"
                                type='password'
                            />
                        </Box>

                        <Button
                            colorScheme='teal'
                            type='submit'
                            isLoading={isSubmitting}
                        >
                            register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Register);