// /pubsets — pubsets.timebars.com lands here. Pubsets are managed in the Enterprise Dashboard.
import { redirect } from 'next/navigation'

export default function PubsetsPage() {
  redirect('/dashboard/pubsets')
}
