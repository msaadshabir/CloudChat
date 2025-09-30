import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import ProfileImageUploader from '@/components/ProfileImageUploader';
import { ensureUsersBioColumn } from '@/lib/db/migrations';

export const dynamic = 'force-dynamic';

async function handleSubmit(formData: FormData) {
  'use server';
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const name = (formData.get('name') as string)?.trim();
  const bioRaw = (formData.get('bio') as string) ?? '';
  const bio = bioRaw.toString().trim();

  if (!name || name.length < 2 || name.length > 50) {
    redirect(`/onboarding?error=${encodeURIComponent('Enter a display name between 2 and 50 characters.')}`);
  }
  if (bio.length > 160) {
    redirect(`/onboarding?error=${encodeURIComponent('Bio must be at most 160 characters.')}`);
  }

  const db = await getDb();
  await db
    .insert(users)
    .values({ id: userId, name, ...(bio ? { bio } : {}) })
    .onConflictDoUpdate({ target: users.id, set: { name, bio } });

  redirect('/');
}

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  const cu = await currentUser();
  const sp = await searchParams;
  await ensureUsersBioColumn();

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[260px]">
        <TopNav />
        <div className="flex-1 max-w-2xl mx-auto px-6 py-10 mt-6 w-full">
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="vc-badge">Onboarding</span>
            </div>
            <h2 className="text-xl font-semibold">Finish setting up your profile</h2>
            <p className="text-white/60 text-sm">Your @handle is managed in Clerk. Choose a display name and optionally add a bio and profile picture.</p>
            {cu?.username && (
              <p className="text-white/40 text-xs mt-1">Current handle: @{cu.username}</p>
            )}
          </div>

          {/* Optional profile image uploader */}
          <div className="mb-4">
            <ProfileImageUploader />
          </div>

          <form action={handleSubmit} className="vercel-card p-6 rounded-[12px] w-full max-w-md space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="name">Display name</label>
              <input id="name" name="name" placeholder="Your name" className="vercel-input w-full px-3 py-2" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80" htmlFor="bio">Bio (optional)</label>
              <textarea id="bio" name="bio" placeholder="Say something about yourself" className="vercel-input w-full px-3 py-2 min-h-[100px]" maxLength={160} />
              <p className="text-white/50 text-xs">Up to 160 characters.</p>
            </div>

            {sp?.error && (
              <div className="text-red-400 text-sm">{sp.error}</div>
            )}

            <button type="submit" className="vercel-button w-full py-2">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
