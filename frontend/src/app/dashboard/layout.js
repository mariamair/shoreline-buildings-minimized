/**
 * Defines the dashboard layout.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { FilterProvider } from './context/FilterContext'
import Header from './components/Header'

export default async function DashboardLayout({ children }) {
  return (
    <div>
      <Header />
      <main>
        <FilterProvider>
          {children}
        </FilterProvider>
      </main>
    </div>
  )
}
