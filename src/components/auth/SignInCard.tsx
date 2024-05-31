import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import { login } from '@/actions/auth-actions';
import { useFormState } from 'react-dom';

export default function SignInCard() {
    const [siginInState, signInAction] = useFormState(login, null);
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                </Stack>
                <form>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}
                    >
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Email address</FormLabel>
                                <Input type="email" id="email" name="email" />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                />
                            </FormControl>
                            <Stack spacing={10} pt={2}>
                                <Text align="center" color={'rgb(229, 62, 62)'}>
                                    {siginInState
                                        ? siginInState.error.message
                                        : ''}
                                </Text>
                            </Stack>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}
                                >
                                    <Checkbox>Remember me</Checkbox>
                                    <Link
                                        href="/auth/forgotpwd"
                                        color={'blue.400'}
                                    >
                                        Forgot password?
                                    </Link>
                                </Stack>
                                <Button
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}
                                    type="submit"
                                    formAction={signInAction}
                                >
                                    Sign in
                                </Button>
                            </Stack>
                            <Stack pt={6}>
                                <Text align={'center'}>
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/auth/signup"
                                        color={'blue.400'}
                                    >
                                        Sign up
                                    </Link>
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </form>
            </Stack>
        </Flex>
    );
}
