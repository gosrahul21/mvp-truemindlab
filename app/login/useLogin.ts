import { signInWithGoogle } from "@/lib/supabase/oauth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const authErrors: Record<string, string> = {
    oauth: 'Google sign-in failed. Try again.',
    missing_code: 'Sign-in was interrupted. Try again.',
    bootstrap: 'Could not finish setting up your account. Please contact support.',
  };
  

const useLogin = ()=>{
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(false);
  
    useEffect(() => {
      const code = searchParams.get('error');
      if (code && authErrors[code]) {
        setError(authErrors[code]);
      }
    }, [searchParams]);
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      try {
        const response = await loginApi({email, password})
        const data = await response.json();
  
        if (!response.ok) {
          setError(typeof data.error === 'string' ? data.error : 'Invalid credentials. Please try again.');
          return;
        }
  
        router.push(redirectTo);
        router.refresh();
      } catch {
        setError('Invalid credentials. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleGoogleSignIn = async () => {
      setError('');
      setOauthLoading(true);
      try {
        await signInWithGoogle(redirectTo);
      } catch {
        setError('Could not start Google sign-in. Try again.');
        setOauthLoading(false);
      }
    };

    return {
        handleGoogleSignIn,
        handleLogin,
        error,
        loading,
        oauthLoading,
        setEmail,
        setPassword,
        email,
        password
    }
}

export default useLogin;