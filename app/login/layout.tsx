import type React from "react";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-archetype="martial" className="min-h-screen">
      {/* Shell: on lg+ it becomes a two-column flex (sidebar + main) */}
      <div className="min-h-screen lg:flex lg:items-stretch lg:flex-row-reverse">
        <main className="flex-1 min-h-screen min-w-0">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
