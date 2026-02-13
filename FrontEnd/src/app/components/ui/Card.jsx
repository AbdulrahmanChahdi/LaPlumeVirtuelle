export default function Card({ 
  children, 
  className = "",
  bgClass = "bg-paper",
  as = "div",
  role
}) {
  const Component = as
  
  return (
    <Component
      role={role}
      className={`
        ${bgClass}
        border border-borderSoft
        rounded-lg
        p-4 sm:p-6
        shadow-sm
        hover:shadow-md
        transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </Component>
  )
}
