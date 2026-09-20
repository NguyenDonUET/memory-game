export function App() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-300 bg-blue-950 p-400">
      <h1 className="text-preset-2 font-bold text-white">memory</h1>
      <p className="text-preset-5 text-blue-300">Design tokens loaded — setup screen next.</p>
      <div className="flex gap-100">
        <span className="size-500 rounded-full bg-orange-400" aria-hidden />
        <span className="size-500 rounded-full bg-blue-800" aria-hidden />
        <span className="bg-blue-350 size-500 rounded-full" aria-hidden />
        <span className="size-500 rounded-full bg-blue-100" aria-hidden />
      </div>
    </main>
  );
}
