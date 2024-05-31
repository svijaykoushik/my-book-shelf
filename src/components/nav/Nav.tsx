'use client';
import { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    useToast,
} from '@chakra-ui/react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';
// import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const NavLink = ({ children }: { children: ReactNode }) => (
    <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}
    >
        {children}
    </Link>
);

export default function Nav() {
    const toast = useToast();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const { user } = useAuth();
    const handleSignout = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        supabase.auth
            .signOut()
            .then(({ error }) => {
                if (error) {
                    toast({
                        description: error.message,
                        status: 'error',
                        title: 'Falied to sign out',
                    });
                    console.error('Failed to sign out', error);
                } else {
                    router.push('/auth/signin');
                }
            })
            .catch((err) => {
                toast({
                    description: err.message,
                    status: 'error',
                    title: 'Falied to sign out',
                });
                console.error('Failed to sign out', err);
            });
    };
    // const { colorMode, toggleColorMode } = useColorMode();
    // const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <Box
                bg={useColorModeValue('white.100', 'white.900')}
                px={4}
                boxShadow={'md'}
            >
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <Box>My Book Shelf</Box>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            {/* <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? (
                                    <MoonIcon />
                                ) : (
                                    <SunIcon />
                                )}
                            </Button> */}

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}
                                >
                                    <Avatar
                                        size={'sm'}
                                        src={
                                            user && user.profileImageUrl
                                                ? user.profileImageUrl
                                                : 'https://avatars.dicebear.com/api/male/username.svg'
                                        }
                                        border={'thin'}
                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'} boxShadow={'lg'}>
                                    <br />
                                    <Center>
                                        <Avatar
                                            size={'lg'}
                                            src={
                                                user && user.profileImageUrl
                                                    ? user.profileImageUrl
                                                    : 'https://avatars.dicebear.com/api/male/username.svg'
                                            }
                                        />
                                    </Center>
                                    <br />
                                    <Center>
                                        <p>
                                            {!!user &&
                                                user?.firstName
                                                    .concat(' ')
                                                    .concat(user?.lastName)}
                                        </p>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem>Your Servers</MenuItem>
                                    <MenuItem>Account Settings</MenuItem>
                                    <MenuItem onClick={handleSignout}>
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}
