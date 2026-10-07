// lib/auth/roles.js
// Case-insensitive role checks for Strapi users.primary_role.
// Plain functions with no server imports, so client components can use them too.
// The app treats "Administrator" in any casing as an Administrator, so the site does the same.

const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : '')

export const isAdminRole = (role) => normalizeRole(role) === 'administrator'

export const isProjectManagerRole = (role) => normalizeRole(role) === 'project manager'

export const isExecutiveRole = (role) => normalizeRole(role) === 'executive'

// Administrator, Project Manager or Executive - may create and share dashboard sources
export const isManagerRole = (role) =>
  isAdminRole(role) || isProjectManagerRole(role) || isExecutiveRole(role)
