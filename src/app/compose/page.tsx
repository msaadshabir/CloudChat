import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import CreateTweet from '@/components/CreateTweet';

export const dynamic = 'force-dynamic';

export default function ComposePage() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-[260px]">
        <TopNav />

        <div className="flex-1 max-w-2xl mx-auto px-6 py-10 mt-6 w-full">
          {/* Header */}
          <div className="mb-6 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="vc-badge">Create</span>
            </div>
            <h2 className="text-xl font-semibold">Create Cloud</h2>
            <p className="text-white/60 text-sm">Share a new cloud with your network</p>
          </div>

          <CreateTweet />
        </div>
      </div>
    </div>
  );
}
