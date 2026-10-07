// app/admin/layout.jsx
// Server Component layout — applies noindex to every page under /admin/

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
