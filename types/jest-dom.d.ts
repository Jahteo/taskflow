import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveTextContent(text: string | RegExp): R
      toHaveValue(value: string | number | string[]): R
      toBeRequired(): R
      toHaveAttribute(attr: string, value?: string): R
      toBeChecked(): R
      toBeDisabled(): R
      toHaveClass(...classNames: string[]): R
      toHaveStyle(style: Record<string, any> | string): R
      toBeVisible(): R
      toBeInvalid(): R
      toBeValid(): R
      toHaveFocus(): R
      toBeEmptyDOMElement(): R
      toContainElement(element: HTMLElement | null): R
      toHaveLength(length: number): R
    }
  }
}

// For proper @testing-library/jest-dom types
/// <reference types="@testing-library/jest-dom" />