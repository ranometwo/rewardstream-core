import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  /** Show a small value bubble on the thumb */
  showValue?: boolean;
  /** Format the value for the bubble & aria-valuetext */
  formatValue?: (value: number) => string;
  /** Accessible label if no external label is provided */
  "aria-label"?: string;
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      showValue = false,
      formatValue = (v) => `${v}`,
      "aria-label": ariaLabel = "Value",
      defaultValue,
      value,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      ...props
    },
    ref
  ) => {
    // Track the first handle’s value for bubble + aria-valuetext
    const initial = (Array.isArray(value) ? value[0] : undefined)
      ?? (Array.isArray(defaultValue) ? defaultValue[0] : undefined)
      ?? min;

    const [current, setCurrent] = React.useState<number>(initial);

    const handleChange = React.useCallback(
      (vals: number[]) => {
        setCurrent(vals[0]);
        onValueChange?.(vals);
      },
      [onValueChange]
    );

    const valuetext = formatValue(current);

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        min={min}
        max={max}
        step={step}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleChange}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-valuetext={valuetext}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb
          className={cn(
            "relative block h-5 w-5 rounded-full border-2 border-primary bg-background",
            "ring-offset-background transition-colors focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          {showValue && (
            <span
              // bubble
              className={cn(
                "absolute -top-7 left-1/2 -translate-x-1/2 select-none rounded-md px-2 py-0.5",
                "text-xs font-medium bg-popover text-popover-foreground shadow-sm",
                "border border-border"
              )}
              role="presentation"
            >
              {valuetext}
            </span>
          )}
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };

