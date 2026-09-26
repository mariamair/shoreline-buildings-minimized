/**
 * Defines the header component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import Link from 'next/link'
import styles from './Header.module.css'

export default async function Header() {
  return (
    <header className={styles.header}>
      <nav>
        <Link href="/dashboard">Sweden</Link>
        <Link href="/dashboard/regionMap">Region Map</Link>
        <Link href="/dashboard/protectedAreas">Protected Areas</Link>
      </nav>
    </header>
  )
}
