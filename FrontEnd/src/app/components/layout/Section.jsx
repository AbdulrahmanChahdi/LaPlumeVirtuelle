export default function Section({ title, subtitle, children, as = "section", id }) {
  const Component = as
  
  return (
    <Component id={id} className="py-8 sm:py-12 md:py-14 lg:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-3">
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="text-center text-sm sm:text-base text-inkSoft mb-6 sm:mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </Component>
  )
}
