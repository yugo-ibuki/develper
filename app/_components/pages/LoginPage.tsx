'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, signOut, user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const { error } = await (isSignUp ? signUp(email, password) : signIn(email, password));

    if (error) {
      setError(error.message);
    }
  };

  if (user) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Logged in as: {user.email}</p>
        <button
          onClick={() => signOut()}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded border p-2"
            required
          />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-blue-500"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}
