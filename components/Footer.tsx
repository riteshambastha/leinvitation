export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
        <p>
          <span
            className="font-semibold"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Le&#96; Invitation
          </span>
          {' '}— beautiful birthday invitations, free forever
        </p>
        <p>
          A product of{' '}
          <span className="font-medium text-gray-500">Rich Gravity Solutions LLC, NJ</span>
          {' '}· © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
