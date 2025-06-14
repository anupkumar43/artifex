import Signout from "~/components/signout";
import ThumbnailCreator from "~/components/thumbnailCreater";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center text-white">
      <div className="flex w-full max-w-4xl flex-col items-center gap-12">
        {/* Main Content Section */}
        <div className="flex w-full flex-1 flex-col items-center">
          <ThumbnailCreator />
        </div>
      </div>
    </main>
  );
}
