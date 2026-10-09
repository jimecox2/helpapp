// config/site.js — public addresses only (they reach the browser), so never add a token, key or password.
//
// One image for every server: each value is read at run time from the server's .env.local
// (see .env.example). The server reads process.env; the root layout hands the same values to the
// browser as window.__TB_CLOUD__ before any app code runs. Unset = Timebars Ltd.'s own addresses.
// Same names as tbwww's config/site.js.

const isServer = typeof window === 'undefined'

const runtime = isServer
  ? {
      apiUrl: process.env.CLOUD_API_URL,
      apiUrlGql: process.env.CLOUD_API_URL_GQL,
      frontendUrl: process.env.CLOUD_FRONTEND_URL || process.env.NEXTAUTH_URL,
      wwwUrl: process.env.CLOUD_WWW_URL,
      runUrlAb: process.env.RUN_URL_AB,
      runUrlTb: process.env.RUN_URL_TB,
      runUrlCb: process.env.RUN_URL_CB,
    }
  : window.__TB_CLOUD__ || {}

const pick = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

// Strapi REST API, e.g. https://be2.timebars.com/api
export const API_URL = pick(runtime.apiUrl, 'https://be2.timebars.com/api')

// Strapi's own address without /api (uploaded images). Defaults to API_URL with /api taken off.
export const API_URL_GQL = pick(runtime.apiUrlGql, API_URL.replace(/\/api$/, ''))

// This app's own public address, e.g. https://cloud.timebars.com
export const FRONTEND_URL = pick(runtime.frontendUrl, 'https://cloud.timebars.com')

// The marketing / accounts site: register, profile, orders and password reset live there.
export const WWW_URL = pick(runtime.wwwUrl, 'https://www.timebars.com')

// The three apps
export const RUN_URL_AB = pick(runtime.runUrlAb, 'https://ab.timebars.com')
export const RUN_URL_TB = pick(runtime.runUrlTb, 'https://tb.timebars.com')
export const RUN_URL_CB = pick(runtime.runUrlCb, 'https://cb.timebars.com')

// What the root layout sends to the browser (server only).
export const BROWSER_CONFIG = {
  apiUrl: API_URL,
  apiUrlGql: API_URL_GQL,
  frontendUrl: FRONTEND_URL,
  wwwUrl: WWW_URL,
  runUrlAb: RUN_URL_AB,
  runUrlTb: RUN_URL_TB,
  runUrlCb: RUN_URL_CB,
}
