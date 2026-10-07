// Turns an axios/Strapi error into a message a user can act on.
// "Request failed with status code 400" hides the reason; Strapi puts it in response.data.error.
export function strapiErrorMessage(e) {
  const err = e?.response?.data?.error
  if (!err) return e?.message || 'Something went wrong'
  const details = (err.details?.errors || [])
    .map(d => `${(d.path || []).join('.') || 'field'}: ${d.message}`)
    .join('; ')
  return `Strapi ${e.response.status}: ${err.message || err.name}${details ? ` (${details})` : ''}`
}
