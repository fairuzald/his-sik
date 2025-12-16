import * as React from "react";

import { type VariantProps } from "class-variance-authority";

import { cn } from "../../../lib/utils";
import { typographyVariants } from "./typography.variant";

type HTMLAttributesWithoutConflicts = Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof VariantProps<typeof typographyVariants>
>;

export interface TypographyProps
  extends
    HTMLAttributesWithoutConflicts,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  colorStyle?: VariantProps<typeof typographyVariants>["color"];
}

const Typography = React.memo(
  React.forwardRef<HTMLElement, TypographyProps>(
    (
      {
        className,
        level,
        weight,
        colorStyle,
        align,
        transform,
        as: Component = "span",
        ...props
      },
      ref
    ) => {
      const combinedClassName = React.useMemo(
        () =>
          cn(
            typographyVariants({
              level,
              weight,
              color: colorStyle,
              align,
              transform,
              className,
            })
          ),
        [level, weight, colorStyle, align, transform, className]
      );

      return <Component ref={ref} className={combinedClassName} {...props} />;
    }
  )
);

Typography.displayName = "Typography";

const H1 = (props: TypographyProps) => (
  <Typography as="h1" level="2xl" weight="bold" {...props} />
);
H1.displayName = "H1";

const H2 = (props: TypographyProps) => (
  <Typography as="h2" level="xl" weight="bold" {...props} />
);
H2.displayName = "H2";

const H3 = (props: TypographyProps) => (
  <Typography as="h3" level="lg" weight="bold" {...props} />
);
H3.displayName = "H3";

const H4 = (props: TypographyProps) => (
  <Typography as="h4" level="base" weight="bold" {...props} />
);
H4.displayName = "H4";

const H5 = (props: TypographyProps) => (
  <Typography as="h5" level="sm" weight="bold" {...props} />
);
H5.displayName = "H5";

const Lead = (props: TypographyProps) => (
  <Typography as="p" level="lg" {...props} />
);
Lead.displayName = "Lead";

const P = (props: TypographyProps) => (
  <Typography as="p" level="base" {...props} />
);
P.displayName = "P";

const Small = (props: TypographyProps) => (
  <Typography as="small" level="sm" {...props} />
);
Small.displayName = "Small";

const Muted = (props: TypographyProps) => (
  <Typography as="p" colorStyle="muted" level="sm" {...props} />
);
Muted.displayName = "Muted";

const Span = (props: TypographyProps) => (
  <Typography as="span" level="base" {...props} />
);
Span.displayName = "Span";

export {
  H1,
  H2,
  H3,
  H4,
  H5,
  Lead,
  Muted,
  P,
  Small,
  Span,
  Typography,
  typographyVariants,
};
