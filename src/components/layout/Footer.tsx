export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-4">
      <nav className="flex justify-around items-center">
        <a href="/dashboard">Dashboard</a>
        <a href="/habits">Habits</a>
        <a href="/todos">Tasks</a>
        <a href="/workout">Workout</a>
        <a href="/journal">Journal</a>
      </nav>
    </footer>
  )
} 