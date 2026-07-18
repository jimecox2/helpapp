import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// GET /api/customer-docs
//
// Scans /public/customers at request time and returns the folder/document
// tree grouped by customer. Each top-level folder under /public/customers
// is a customer; all files below it (including subfolders) are its docs.
// Adding a new customer folder or document requires no code changes.

// Re-scan the filesystem on every request — without this, Next.js statically
// prerenders the route at build time and new docs never appear.
export const dynamic = 'force-dynamic'

const CUSTOMERS_DIR = path.join(process.cwd(), 'public', 'customers')

async function collectDocs(dir, relBase = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const docs = []
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    const relPath = relBase ? `${relBase}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      docs.push(...await collectDocs(path.join(dir, entry.name), relPath))
    } else if (entry.isFile()) {
      docs.push({
        name:    entry.name,
        relPath,                                  // path within the customer folder
        ext:     path.extname(entry.name).toLowerCase(),
      })
    }
  }
  return docs
}

export async function GET() {
  try {
    const entries = await fs.readdir(CUSTOMERS_DIR, { withFileTypes: true })
    const customers = []

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue
      const docs = await collectDocs(path.join(CUSTOMERS_DIR, entry.name))
      docs.sort((a, b) => a.relPath.localeCompare(b.relPath))
      customers.push({
        name: entry.name,
        docs: docs.map(d => ({
          ...d,
          // public URL the client can fetch the raw document from
          path: `/customers/${entry.name}/${d.relPath}`,
        })),
      })
    }

    customers.sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ success: true, customers })
  } catch (error) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ success: true, customers: [] })
    }
    console.error('customer-docs scan failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read customer documents' },
      { status: 500 }
    )
  }
}
