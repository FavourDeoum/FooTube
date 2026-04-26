import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--cream)' }}>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/personalized" />
    </div>
  );
}
