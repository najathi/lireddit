import { Button, Box } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { NextPage } from 'next';
import { useState } from 'react'
import InputField from '../components/InputField';
import Wrapper from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../util/createUrqlClient';

interface ForgotPasswordProps {

}

const ForgotPassword: NextPage<ForgotPasswordProps> = ({ }) => {
    const [complete, setComplete] = useState<boolean>(false);
    const [, forgetPassword] = useForgotPasswordMutation();

    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ email: "" }}
                onSubmit={async (values) => {
                    if (values.email.length === 0) return;

                    await forgetPassword(values);
                    setComplete(true);
                }}
            >
                {({ isSubmitting }) =>
                    complete ?
                        (
                            <Box>
                                If an account with that email exists, we sent you can email
                            </Box>
                        ) : (
                            <Form>
                                <Box mb={4}>
                                    <InputField
                                        name='email'
                                        placeholder='email'
                                        label="Email"
                                        type='email'
                                    />
                                </Box>

                                <Button
                                    colorScheme='teal'
                                    type='submit'
                                    isLoading={isSubmitting}
                                >
                                    forget password
                                </Button>
                            </Form>
                        )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);