import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthMode = 'login' | 'signup' | 'forgot_password';

export default function Auth() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, isAdmin, isModerator, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect when user is logged in and admin status is determined
  useEffect(() => {
    if (user && !authLoading) {
      if (isAdmin || isModerator) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, isModerator, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'forgot_password') {
        // Forgot Password Flow
        if (!email) {
          toast.error('Please enter your email');
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Check your email for the password reset link');
          setAuthMode('login');
        }

      } else {
        // Login / Signup Flow
        const validation = authSchema.safeParse({ email, password });
        if (!validation.success) {
          toast.error(validation.error.errors[0].message);
          setLoading(false);
          return;
        }

        if (authMode === 'login') {
          const { error } = await signIn(email, password);
          if (error) {
            if (error.message.includes('Invalid login credentials')) {
              toast.error('Invalid email or password');
            } else {
              toast.error(error.message);
            }
          } else {
            toast.success('Welcome back!');
          }
        } else {
          const { error } = await signUp(email, password);
          if (error) {
            if (error.message.includes('already registered')) {
              toast.error('This email is already registered. Please sign in instead.');
            } else {
              toast.error(error.message);
            }
          } else {
            toast.success('Account created! Please check your email to confirm your account.');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot_password': return 'Reset Password';
    }
  };

  const getDescription = () => {
    switch (authMode) {
      case 'login': return 'Sign in to access your account';
      case 'signup': return 'Sign up to get started';
      case 'forgot_password': return 'Enter your email to receive a reset link';
    }
  };

  return (
    <Layout>
      <section className="section-padding min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-display">
                  {getTitle()}
                </CardTitle>
                <CardDescription>
                  {getDescription()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {authMode !== 'forgot_password' && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium block">Password</label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            onClick={() => setAuthMode('forgot_password')}
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Please wait...' : (
                      authMode === 'login' ? 'Sign In' :
                        authMode === 'signup' ? 'Sign Up' : 'Send Link'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center space-y-2">
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-sm text-primary hover:underline"
                    >
                      Don't have an account? Sign up
                    </button>
                  )}
                  {authMode === 'signup' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-sm text-primary hover:underline"
                    >
                      Already have an account? Sign in
                    </button>
                  )}
                  {authMode === 'forgot_password' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-sm text-primary hover:underline"
                    >
                      Back to Sign In
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
