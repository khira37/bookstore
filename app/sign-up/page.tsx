'use client';

import { useActionState } from 'react';
import { signUpAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, null);

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col items-center justify-center p-4 font-sans text-black">
      <Link href="/" className="mb-6 text-2xl font-bold">
        BookStore<span className="text-[#e77600]">.com</span>
      </Link>

      <div className="w-full max-w-sm bg-white p-6 rounded border border-gray-300 shadow-sm">
        <h1 className="text-2xl font-normal mb-4">Create account</h1>

        {state?.error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 border border-red-200 rounded">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Your name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-2 border border-gray-400 rounded text-sm focus:border-[#e77600] outline-none"
            />
          </div>

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
              placeholder="At least 6 characters"
              required
              className="w-full p-2 border border-gray-400 rounded text-sm focus:border-[#e77600] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black font-medium py-1.5 rounded text-xs border border-[#fcd200] shadow-sm mt-2"
          >
            {isPending ? 'Creating account...' : 'Create your BookStore account'}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-[#0066c0] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}