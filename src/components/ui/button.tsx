import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Компонент для эффекта пульсации
const RippleEffect = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const nextId = React.useRef(0);

  // Создаем эффект пульсации при клике
  const createRipple = (event: React.MouseEvent<HTMLSpanElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Вычисляем позицию в % относительно кнопки
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    const id = nextId.current++;
    setRipples((prev) => [...prev, { x, y, id }]);
    
    // Удаляем эффект пульсации через 1 секунду
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 1000);
  };

  return (
    <span 
      ref={ref} 
      className={cn("absolute inset-0 overflow-hidden rounded-md", className)} 
      onClick={createRipple}
      {...props}
    >
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute bg-white/20 rounded-full pointer-events-none animate-ripple"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%) scale(0)',
          }}
        />
      ))}
    </span>
  );
});
RippleEffect.displayName = "RippleEffect";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

// Кнопка с эффектом пульсации
const RippleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), "relative overflow-hidden", className)}
        ref={ref}
        {...props}
      >
        {props.children}
        <RippleEffect />
      </Comp>
    )
  }
)
RippleButton.displayName = "RippleButton"

export { Button, RippleButton, buttonVariants }
