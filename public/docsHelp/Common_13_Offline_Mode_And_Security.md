# Offline Mode and Security

Timebars Ltd. apps keep your project data in your browser's own database (IndexedDB), so planning,
dragging bars, editing risks and running reports never need a server round trip. **Offline mode**
adds the last piece: the app itself can load and reload with no network.

## Where offline mode is available

- Offline mode is available on the offline addresses: `agile.timebars.com` (Agilebars),
  `pmrm.timebars.com` (Timebars) and `ppm.timebars.com` (Costbars), plus their staging addresses
  `agiles`, `pmrms` and `ppms.timebars.com`.
- The standard addresses do not use offline mode. There, keep the app open while offline and use the
  **Refresh** button in the top menu rather than reloading the browser page.

## How it works

Offline mode uses a standard browser feature called a *service worker*. On your first online visit
it stores a copy of the app's own files (code, styles, icons, images) in the browser. When the
network is unavailable, the browser loads the app from that copy.

- When you are online the app always checks for the newest version first, so updates reach you on
  your next online visit.
- Your project data is not affected: it stays in the browser database whether offline mode is used
  or not.

## What is and is not stored

| Stored by offline mode | Never stored by offline mode |
|---|---|
| The app's code, styles, fonts, icons and images | Your login details or tokens |
| Help documents you have opened | Anything from other servers (cloud publishing, OpenProject, sign-in) |
| | Your project data (that lives in the browser database, as always) |

Offline mode does not use push notifications or background sync, and does not run when the app
is closed.

## Security notes for IT and security reviewers

- Only the app's own address is involved; requests to any other server go straight to the network.
- The app loads nothing from third-party servers (no CDNs, no external fonts).
- Offline mode is switched on per deployment. An organisation hosting the app itself can leave it
  off entirely; standard deployments never enable it.
- Every release uses a new cache and removes the previous one.
- **To remove offline mode from a browser:** open the site, then DevTools → Application →
  Storage → **Clear site data** (note: this also clears the project data held in that browser, so
  make a backup first — see the Data Synchronization, Backup and Recovery guide).

## Moving between addresses

Each address has its own browser database. To move your work to another address, use
**spreadsheet sync** or **Start → Data Actions → Make Backup**, then load it on the new address.
