'use client';

import { useActionState } from 'react';
import { signInAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInAction, null);

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col items-center justify-center p-4 font-sans text-black">
      <Link href="/" className="mb-6 text-2xl font-bold">
        BookStore<span className="text-[#e77600]">.com</span>
      </Link>

      <div className="w-full max-w-sm bg-white p-6 rounded border border-gray-300 shadow-sm">
        <h1 className="text-2xl font-normal mb-4">Sign in</h1>

        {state?.error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 border border-red-200 rounded">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full p-2 border border-gray-400 rounded text-sm focus:border-[#e77600] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2 border border-gray-400 rounded text-sm focus:border-[#e77600] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black font-medium py-1.5 rounded text-xs border border-[#fcd200] shadow-sm mt-2"
          >
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-600">
          New to BookStore?{' '}
          <Link href="/sign-up" className="text-[#0066c0] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}