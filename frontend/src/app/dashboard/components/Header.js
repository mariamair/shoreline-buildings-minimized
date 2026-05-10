/**
 * Defines the header component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { auth } from '@/auth'
import { SignOutButton } from '@/components/authbuttons'
import Link from 'next/link'
import styles from './Header.module.css'

export default async function Header() {
  const session = await auth()

  return (
    <header className={styles.header}>
      <nav>
        <Link href="/dashboard">Sweden</Link>
        <Link href="/dashboard/regionMap">Region Map</Link>
        <Link href="/dashboard/protectedAreas">Protected Areas</Link>
      </nav>
      <div className={styles.user}>
        <span>User: {session.user.name}</span>
        <SignOutButton />
      </div>
    </header>
  )
}
