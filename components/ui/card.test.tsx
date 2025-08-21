import { render, screen } from '@testing-library/react'
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from './card'

// Mock next/font to avoid Google Fonts issues in tests
jest.mock('next/font/google', () => ({
  Poppins: () => ({ className: 'poppins-font' })
}))

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default styles', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-lg', 'border', 'shadow-sm')
    })

    it('applies custom className', () => {
      render(<Card className="custom-card" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('custom-card')
    })

    it('forwards ref correctly', () => {
      const ref = jest.fn()
      render(<Card ref={ref}>Content</Card>)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('CardHeader', () => {
    it('renders with correct styles', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      const header = screen.getByTestId('header')
      
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('applies font class', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      expect(screen.getByTestId('header')).toHaveClass('poppins-font')
    })
  })

  describe('CardTitle', () => {
    it('renders with title styles', () => {
      render(<CardTitle data-testid="title">Title text</CardTitle>)
      const title = screen.getByTestId('title')
      
      expect(title).toHaveClass(
        'text-2xl',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      )
      expect(title).toHaveTextContent('Title text')
    })
  })

  describe('CardDescription', () => {
    it('renders with description styles', () => {
      render(<CardDescription data-testid="desc">Description text</CardDescription>)
      const desc = screen.getByTestId('desc')
      
      expect(desc).toHaveClass('text-sm', 'text-foreground-muted')
      expect(desc).toHaveTextContent('Description text')
    })
  })

  describe('CardContent', () => {
    it('renders with content styles', () => {
      render(<CardContent data-testid="content">Content text</CardContent>)
      const content = screen.getByTestId('content')
      
      expect(content).toHaveClass('p-6')
      expect(content).toHaveTextContent('Content text')
    })
  })

  describe('CardFooter', () => {
    it('renders with footer styles', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      const footer = screen.getByTestId('footer')
      
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
      expect(footer).toHaveTextContent('Footer content')
    })
  })

  describe('Card composition', () => {
    it('renders a complete card structure', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            Test content goes here
          </CardContent>
          <CardFooter>
            Test footer
          </CardFooter>
        </Card>
      )

      expect(screen.getByTestId('full-card')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test content goes here')).toBeInTheDocument()
      expect(screen.getByText('Test footer')).toBeInTheDocument()
    })
  })
})