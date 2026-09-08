import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-6 text-2xl font-bold">
        BookStore<span className="text-[#e77600]">.com</span>
      </div>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}