import { Form, Formik } from 'formik'
import { Box, Button, Link } from '@chakra-ui/react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../util/toErrorMap';
import { useRouter } from 'next/router';
import { createUrqlClient } from '../util/createUrqlClient';

interface RegisterProps { }

const Register: NextPage<RegisterProps> = ({ }) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: "", username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ options: values })
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
                                name='email'
                                placeholder='email'
                                label="Email"
                                type="email"
                            />
                        </Box>

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
                            mb={4}
                        >
                            register
                        </Button>

                        <Box mb={4}>
                            <NextLink href="/login">
                                <Link>already have an account</Link>
                            </NextLink>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Register);