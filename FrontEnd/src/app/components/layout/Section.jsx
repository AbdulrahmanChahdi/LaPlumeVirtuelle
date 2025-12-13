export default function Section({ title, subtitle, children }) {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-6">
        {title && (
          <h2 className="text-2xl font-bold text-center mb-3">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="text-center text-inkSoft mb-6">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
