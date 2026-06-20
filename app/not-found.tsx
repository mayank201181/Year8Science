import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="text-6xl">🔭</div>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">
        We couldn&apos;t find that page. Let&apos;s get you back to the lab.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
      >
        ← Back to topics
      </Link>
    </div>
  );
}
