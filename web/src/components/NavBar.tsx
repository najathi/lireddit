import React from 'react'
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({ }) => {
    const router = useRouter();

    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery();
    let body = null;

    if (fetching) {
        // data is loading
        body = null
    } else if (!data?.me) {
        // user not logged in
        body = (
            <div>
                <NextLink href="/login" passHref>
                    <Link mr={6}>login</Link>
                </NextLink>
                <NextLink href="/register" passHref>
                    <Link>register</Link>
                </NextLink>
            </div>
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
                >
                    Logout
                </Button>
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