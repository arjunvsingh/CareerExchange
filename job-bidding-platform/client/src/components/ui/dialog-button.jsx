import * as React from "react"

const DialogButton = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]}`

  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    />
  )
})
DialogButton.displayName = "DialogButton"

export { DialogButton } 