import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toHaveClass('bg-background-dark', 'text-foreground-muted')

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toHaveClass('bg-background-dark', 'text-secondary')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toHaveClass('bg-background-dark', 'text-primary')

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toHaveClass('text-foreground')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    expect(screen.getByText('Custom')).toHaveClass('custom-class')
  })

  it('renders children correctly', () => {
    render(
      <Badge>
        <span>Child content</span>
      </Badge>
    )
    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('passes through HTML attributes', () => {
    render(<Badge data-testid="badge" title="Badge title">Test</Badge>)
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('title', 'Badge title')
  })

  it('has correct base styling', () => {
    render(<Badge>Styled Badge</Badge>)
    const badge = screen.getByText('Styled Badge')
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center', 
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold'
    )
  })
})