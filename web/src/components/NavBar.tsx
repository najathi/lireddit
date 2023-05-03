import React from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../util/isServer';

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
    const router = useRouter();

    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer()
    });
    let body = null;

    if (fetching) {
        // data is loading
        body = null
    } else if (!data?.me) {
        // user not logged in
        body = (
            <Flex>
                <NextLink href="/login"><Text mr={6}>login</Text></NextLink>
                <NextLink href="/register"><Text>register</Text></NextLink>
            </Flex>
        )
    } else {
        // user is logged in
        body = (
            <Flex>
                <Box mr={6}>{data.me.username}</Box>
                <Button
                    color="black"
                    variant='link'
                    onClick={() => {
                        // @ts-ignore
                        logout();
                        router.push('/login');
                    }}
                    isLoading={logoutFetching}
                >Logout</Button>
            </Flex>
        )
    }

    return (
        <Flex bg="tan" p={4}>
            <Box ml="auto">
                {body}
            </Box>
        </Flex>
    );
}

export default NavBar;