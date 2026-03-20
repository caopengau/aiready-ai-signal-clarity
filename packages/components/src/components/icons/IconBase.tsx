/**
 * Props for the IconBase component.
 */
export interface IconBaseProps extends React.SVGProps<SVGSVGElement> {
  /** Additional CSS classes for styling. Defaults to w-6 h-6. */
  className?: string;
  /** The child elements (paths, circles, etc.) of the SVG. */
  children?: React.ReactNode;
  /** Viewbox of the icon. Defaults to "0 0 24 24". */
  viewBox?: string;
}

/**
 * Common stroke props for line-based icons.
 * Reduces duplication across icon components.
 */
export const STROKE_ICON_PROPS = {
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/**
 * Creates an icon component with common stroke props pre-applied.
 * Reduces semantic duplicate patterns in icon definitions.
 *
 * @param _name - Name of the icon (reserved for debugging/future use)
 * @param children - SVG child elements (paths, circles, etc.)
 * @param additionalProps - Additional props to pass to IconBase
 * @returns Icon component with standard stroke styling
 */
export function createStrokeIcon(
  _name: string,
  children: React.ReactNode,
  additionalProps?: Partial<IconBaseProps>
): React.ReactElement {
  return (
    <IconBase {...STROKE_ICON_PROPS} {...additionalProps}>
      {children}
    </IconBase>
  );
}

/**
 * A shared base component for all icons to reduce code duplication
 * and improve AI signal clarity.
 *
 * @param props - Icon properties and SVG attributes.
 * @returns A standardized SVG icon element.
 */
export const IconBase = ({
  className = 'w-6 h-6',
  children,
  viewBox = '0 0 24 24',
  ...props
}: IconBaseProps) => {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
