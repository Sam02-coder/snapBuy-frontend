export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-display text-white">ShopSphere</span>
        <span>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</span>
      </div>
    </footer>
  )
}
