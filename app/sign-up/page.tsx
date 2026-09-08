import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col items-center justify-center py-12 px-4">
      {/* Branding Header */}
      <div className="mb-6 text-2xl font-bold">
        BookStore<span className="text-[#e77600]">.com</span>
      </div>

      {/* Clerk Sign Up Component */}
      <SignUp 
        routing="path" 
        path="/sign-up" 
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}