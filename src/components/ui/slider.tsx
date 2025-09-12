import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    showValue?: boolean;
    label?: string;
    formatValue?: (value: number) => string;
  }
>(({ className, showValue = false, label, formatValue, ...props }, ref) => {
  const [localValue, setLocalValue] = React.useState<number[]>(
    props.defaultValue || props.value || [0]
  );

  const handleValueChange = (value: number[]) => {
    setLocalValue(value);
    props.onValueChange?.(value);
  };

  const displayValue = formatValue 
    ? formatValue(localValue[0]) 
    : `${localValue[0]}${props.max ? `/${props.max}` : ''}`;

  return (
    <div className="relative w-full space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-foreground/90 transition-colors">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-primary tabular-nums transition-all duration-200">
              {displayValue}
            </span>
          )}
        </div>
      )}
      
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center group",
          className
        )}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-secondary/70">
          <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out" />
        </SliderPrimitive.Track>
        
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-lg ring-offset-background transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing active:scale-105 hover:shadow-xl hover:shadow-primary/20">
          <span className="sr-only">Slider thumb</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
      
      {/* Optional tick marks */}
      {props.step && props.max && (
        <div className="relative w-full h-1 -mt-1">
          <div className="absolute inset-x-0 flex justify-between">
            {Array.from(
              { length: Math.floor(props.max / props.step) + 1 },
              (_, i) => i * props.step
            ).map((value) => (
              <div
                key={value}
                className="w-0.5 h-2 bg-border/50 transition-colors duration-300"
                style={{ 
                  opacity: value <= localValue[0] ? 0.8 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };