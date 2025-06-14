export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#8d91bc] to-[#ced0eb] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Hello <span className="text-[hsl(280,100%,70%)]">From</span> Localhost
        </h1>
      </div>
    </main>
  );
}
