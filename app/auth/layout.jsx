// app/auth/layout.jsx
// Server Component layout — applies noindex to every page under /auth/
// 'use client' pages in this section cannot export metadata themselves,
// so this layout is the correct place to set it.

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }) {
  return children;
}
