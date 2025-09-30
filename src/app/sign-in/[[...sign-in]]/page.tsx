import { SignIn } from '@clerk/nextjs';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px]">
        <TopNav />
        <div className="flex-1 max-w-2xl mx-auto px-6 py-10 mt-6 w-full">
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="vc-badge">Authentication</span>
            </div>
            <h2 className="text-xl font-semibold">Sign in to CloudChat</h2>
            <p className="text-white/60 text-sm">Welcome back. Please authenticate to continue.</p>
          </div>

          <div className="vercel-card p-6 rounded-[12px] w-full max-w-md">
            <SignIn appearance={{ elements: { formButtonPrimary: 'vercel-button w-full' } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
