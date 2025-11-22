declare namespace React {
  type ReactNode = any;
  type ReactElement = any;
  type ComponentProps<T> = any;
  interface FC<P = any> {
    (props: P & { children?: ReactNode }): ReactNode;
  }
  type ComponentType<P = any> = FC<P>;
}

declare module 'react' {
  export = React;
}

declare namespace JSX {
  interface Element {}
  interface ElementClass { render?: any }
  interface ElementAttributesProperty { props?: any }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
