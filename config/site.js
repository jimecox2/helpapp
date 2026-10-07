// config/site.js — public URLs only. Everything here is inlined into browser code (NEXT_PUBLIC_),
// so never add a token, key or password. Server secrets are read from process.env in server code.

export const API_URL = process.env.NEXT_PUBLIC_API_URL

export const API_URL_GQL = process.env.NEXT_PUBLIC_API_URL_GQL

// This app's own public address, e.g. https://cloud.timebars.com
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://cloud.timebars.com'

export const RUN_URL_AB = process.env.NEXT_PUBLIC_RUN_URL_AB

export const RUN_URL_TB = process.env.NEXT_PUBLIC_RUN_URL_TB

export const RUN_URL_CB = process.env.NEXT_PUBLIC_RUN_URL_CB

// The marketing / accounts site: register, profile, orders and password reset live there.
export const WWW_URL = process.env.NEXT_PUBLIC_WWW_URL || 'https://www.timebars.com'

export const GOOGLE_ANAL_ID = process.env.NEXT_PUBLIC_GOOGLE_ANAL_ID

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
