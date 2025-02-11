import { cn } from "@/lib/utils";

const Card = ({ className, children, ...props }) => (
  <div
    className={cn(
      "rounded-lg border bg-white text-secondary shadow-sm p-6",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children, ...props }) => (
  <div
    className={cn("flex items-center justify-between space-y-0", className)}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn(
      "text-sm font-medium leading-none tracking-tight text-muted",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn("mt-4 text-secondary", className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardContent };