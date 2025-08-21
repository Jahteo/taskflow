import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText('Default Badge')
    expect(badge).toBeInTheDocument()
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>)
    expect(screen.getByText('Default')).toBeInTheDocument()

    rerender(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText('Secondary')).toBeInTheDocument()

    rerender(<Badge variant="destructive">Destructive</Badge>)
    expect(screen.getByText('Destructive')).toBeInTheDocument()

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText('Outline')).toBeInTheDocument()
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
})