/**
 * Defines the home page.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Shoreline Buildings</h1>
      <p className={styles.text}>Interactive visualization of data about shoreline buildings in Sweden.</p>
      <p className={styles.text}><a href="/dashboard">Go to the dashboard.</a></p>
    </main>
  )
}
