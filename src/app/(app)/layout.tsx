import { SelectedDateProvider } from '@/context/SelectedDateContext'
import { HabitsProvider } from '@/context/HabitsContext'
import Header from "@/components/layout/Header"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SelectedDateProvider>
        <HabitsProvider>
          <Header />
          <main>{children}</main>
        </HabitsProvider>
      </SelectedDateProvider>
    </>
  )
} 