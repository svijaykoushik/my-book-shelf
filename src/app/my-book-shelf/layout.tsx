import Nav from '@/components/nav/Nav';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { Box } from '@chakra-ui/react';

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect('/auth/signin');
    }
    return (
        <>
            <Box m={0} p={0} bg={'gray.200'}>
                <Nav />
                {children}
            </Box>
        </>
    );
}
