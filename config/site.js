// config/site.js — public addresses only (they reach the browser), so never add a token, key or password.
//
// One image for every server: each address can be set per server at run time in .env.local
// (CLOUD_API_URL, CLOUD_API_URL_GQL, CLOUD_WWW_URL, CLOUD_FRONTEND_URL or NEXTAUTH_URL). The server
// reads them from process.env; the root layout hands the same values to the browser as
// window.__TB_CLOUD__ before any app code runs (RuntimeConfigScript). Unset = the values built into
// the image from .env.production (Timebars Ltd.'s own addresses).

const isServer = typeof window === 'undefined'

const runtime = isServer
  ? {
      apiUrl: process.env.CLOUD_API_URL,
      apiUrlGql: process.env.CLOUD_API_URL_GQL,
      frontendUrl: process.env.CLOUD_FRONTEND_URL || process.env.NEXTAUTH_URL,
      wwwUrl: process.env.CLOUD_WWW_URL,
    }
  : window.__TB_CLOUD__ || {}

const pick = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

// Strapi REST API, e.g. https://be2.timebars.com/api
export const API_URL = pick(runtime.apiUrl, process.env.NEXT_PUBLIC_API_URL)

// Strapi's own address without /api (uploaded images), e.g. https://be2.timebars.com. When only
// CLOUD_API_URL is set, it is that address with /api taken off.
export const API_URL_GQL = pick(
  runtime.apiUrlGql || (runtime.apiUrl ? runtime.apiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '') : ''),
  process.env.NEXT_PUBLIC_API_URL_GQL,
)

// This app's own public address, e.g. https://cloud.timebars.com
export const FRONTEND_URL = pick(runtime.frontendUrl, process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://cloud.timebars.com')

export const RUN_URL_AB = process.env.NEXT_PUBLIC_RUN_URL_AB

export const RUN_URL_TB = process.env.NEXT_PUBLIC_RUN_URL_TB

export const RUN_URL_CB = process.env.NEXT_PUBLIC_RUN_URL_CB

// The marketing / accounts site: register, profile, orders and password reset live there.
export const WWW_URL = pick(runtime.wwwUrl, process.env.NEXT_PUBLIC_WWW_URL || 'https://www.timebars.com')

export const GOOGLE_ANAL_ID = process.env.NEXT_PUBLIC_GOOGLE_ANAL_ID

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

// What the root layout sends to the browser (server only).
export const BROWSER_CONFIG = { apiUrl: API_URL, apiUrlGql: API_URL_GQL, frontendUrl: FRONTEND_URL, wwwUrl: WWW_URL }
