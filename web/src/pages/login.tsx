import { Form, Formik } from 'formik'
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../util/toErrorMap';
import { createUrqlClient } from '../util/createUrqlClient';
import NextLink from 'next/link';

interface LoginProps {

}

const Login: NextPage<LoginProps> = ({ }) => {
    const router = useRouter();
    const [, login] = useLoginMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors))
                    } else if (response.data?.login.user) {
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Box mb={4}>
                            <InputField
                                name='usernameOrEmail'
                                placeholder='username or email'
                                label="Username or Email"
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

                        <Flex mb={4}>
                            <NextLink href="/forgot-password">
                                <Link ml="auto">forgot password?</Link>
                            </NextLink>
                        </Flex>


                        <Button
                            colorScheme='teal'
                            type='submit'
                            isLoading={isSubmitting}
                            mb={4}
                        >
                            login
                        </Button>

                        <Box mb={4}>
                            <NextLink href="/register">
                                <Link>create an account</Link>
                            </NextLink>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(Login);