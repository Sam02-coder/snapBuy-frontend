import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-6xl text-navy mb-3">404</p>
        <p className="text-ink-soft mb-6">This page doesn't exist.</p>
        <Link to="/">
          <Button variant="accent">Back to home</Button>
        </Link>
      </div>
    </div>
  )
}
