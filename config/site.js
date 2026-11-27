// config/site.js — public addresses only (they reach the browser), so never add a token, key or password.
//
// One image for every server: each value is read at run time from the server's .env.local
// (see .env.example). The server reads process.env; the root layout hands the same values to the
// browser as window.__TB_CLOUD__ before any app code runs. Unset = Timebars Ltd.'s own addresses.
// Same names as tbwww's config/site.js.

import axios from 'axios'
import { installStrapiCompat } from '@/lib/strapiCompat'

const isServer = typeof window === 'undefined'

const runtime = isServer
  ? {
      apiUrl: process.env.CLOUD_API_URL,
      apiUrlGql: process.env.CLOUD_API_URL_GQL,
      frontendUrl: process.env.CLOUD_FRONTEND_URL || process.env.NEXTAUTH_URL,
      wwwUrl: process.env.CLOUD_WWW_URL,
      helpUrl: process.env.CLOUD_HELP_URL,
      runUrlAb: process.env.RUN_URL_AB,
      runUrlTb: process.env.RUN_URL_TB,
      runUrlCb: process.env.RUN_URL_CB,
      environment: process.env.TB_ENVIRONMENT,
      licensingMode: process.env.LICENSING_MODE,
    }
  : window.__TB_CLOUD__ || {}

const pick = (value, fallback) =>
  typeof value === 'string' && value.trim() ? value.trim().replace(/\/+$/, '') : fallback

// Strapi REST API, e.g. https://be2.timebars.com/api
export const API_URL = pick(runtime.apiUrl, 'https://be2.timebars.com/api')

// Strapi 4 and 5 both work: Strapi-Response-Format v4 header and numeric ids turned into documentIds (lib/strapiCompat.js)
installStrapiCompat(API_URL, axios)

// Strapi's own address without /api (uploaded images). Defaults to API_URL with /api taken off.
export const API_URL_GQL = pick(runtime.apiUrlGql, API_URL.replace(/\/api$/, ''))

// This app's own public address, e.g. https://cloud.timebars.com
export const FRONTEND_URL = pick(runtime.frontendUrl, 'https://cloud.timebars.com')

// The marketing / accounts site: register, profile, orders and password reset live there.
export const WWW_URL = pick(runtime.wwwUrl, 'https://www.timebars.com')

// The public help address: help.timebars.com in production, helps.timebars.com on staging. Absolute help
// links that leave this site (help-articles pushed to Strapi by /update-help) start with it.
export const HELP_URL = pick(runtime.helpUrl, 'https://help.timebars.com')

// The three apps
export const RUN_URL_AB = pick(runtime.runUrlAb, 'https://ab.timebars.com')
export const RUN_URL_TB = pick(runtime.runUrlTb, 'https://tb.timebars.com')
export const RUN_URL_CB = pick(runtime.runUrlCb, 'https://cb.timebars.com')

// Which environment this server is: the tbapps.conf section name (DEV, STAGING, PROD, TRAINING), written
// by tbown's apply as TB_ENVIRONMENT. Every one but PROD gets the dark red nav bar with its name. Unset = PROD.
export const TB_ENVIRONMENT = pick(runtime.environment, 'PROD').toUpperCase()
export const IS_PROD = TB_ENVIRONMENT === 'PROD'

// LICENSING_MODE (sales | self-managed, see lib/licence/selfManaged.js). Not a secret; the menu names the
// licences page after it: Account Groups on a self-managed server (Jim, 26 Nov 2026).
export const SELF_MANAGED = String(runtime.licensingMode || '').trim().toLowerCase() === 'self-managed'

// What the root layout sends to the browser (server only).
export const BROWSER_CONFIG = {
  apiUrl: API_URL,
  apiUrlGql: API_URL_GQL,
  frontendUrl: FRONTEND_URL,
  wwwUrl: WWW_URL,
  helpUrl: HELP_URL,
  runUrlAb: RUN_URL_AB,
  runUrlTb: RUN_URL_TB,
  runUrlCb: RUN_URL_CB,
  environment: TB_ENVIRONMENT,
  licensingMode: SELF_MANAGED ? 'self-managed' : 'sales',
}
