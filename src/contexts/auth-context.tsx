import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { createClient } from '../utils/supabase/client';
import { useToast } from '@chakra-ui/react';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
}

interface AuthContextInterface {
    user: User | null;
    updateUser: (
        firstName: string,
        lastName: string,
        profileImageUrl: string
    ) => Promise<void>;
}

interface Props {
    children: ReactNode;
}
const AuthContext = createContext<AuthContextInterface>({
    user: null,
    updateUser: () => Promise.resolve(),
});

export function AuthProvider({ children }: Props) {
    const supabase = createClient();
    const toast = useToast();

    const [user, setUser] = useState<User | null>(null);

    const getUser = useCallback(async () => {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) {
            console.error('Could not get auth user', error);
            toast({
                description: error.message,
                status: 'error',
                title: 'Could not get auth user',
            });
            return;
        }

        if (!user) {
            toast({
                description: 'user data not found',
                status: 'error',
                title: 'Could not get auth user',
            });
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id,first_name, last_name, profile_image_url')
            .eq('id', user!.id)
            .single();

        if (profileError) {
            console.error('Could not get profile', profileError);
            toast({
                description: profileError.message,
                status: 'error',
                title: 'Could not get profile',
            });
            return;
        }

        if (!profile) {
            toast({
                description: 'profile data not found',
                status: 'error',
                title: 'Could not get profile',
            });
            return;
        }

        console.log('Auth user', {
            firstName: profile.first_name!,
            id: profile.id,
            lastName: profile.last_name!,
            profileImageUrl: profile.profile_image_url!,
        });
        setUser({
            firstName: profile.first_name!,
            id: profile.id,
            lastName: profile.last_name!,
            profileImageUrl: profile.profile_image_url!,
        });
    }, [supabase, toast]);

    const updateUser = useCallback(
        async (
            firstName: string,
            lastName: string,
            profileImageUrl: string
        ) => {
            if (!firstName.trim()) {
                return;
            }

            const { error } = await supabase.from('profiles').update({
                first_name: firstName.trim(),
                last_name: lastName?.trim() || null,
                profile_image_url: profileImageUrl?.trim() || null,
            });
            if (error) {
                console.error('Could update profile', error);
                toast({
                    description: error.message,
                    status: 'error',
                    title: 'Could not update profile',
                });
                return;
            }
            await getUser();
        },
        [getUser, supabase, toast]
    );

    useEffect(() => {
        getUser();
    }, [getUser]);

    return (
        <AuthContext.Provider
            value={{
                updateUser,
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth should be used within AuthContext provider');
    }
    return context;
}
