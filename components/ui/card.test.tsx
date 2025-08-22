import { render, screen } from '@testing-library/react'
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardHeading, 
  CardDescription, 
  CardContent 
} from './card'

// Mock next/font to avoid Google Fonts issues in tests
jest.mock('next/font/google', () => ({
  Poppins: () => ({ className: 'poppins-font' })
}))

describe('Card Components', () => {
  describe('Card', () => {
    it('renders correctly', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
    })

    it('forwards ref correctly', () => {
      const ref = jest.fn()
      render(<Card ref={ref}>Content</Card>)
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('CardHeader', () => {
    it('renders header content', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Header content')
    })
  })

  describe('CardHeading', () => {
    it('renders title text', () => {
      render(<CardHeading data-testid="title">Title text</CardHeading>)
      const title = screen.getByTestId('title')
      expect(title).toHaveTextContent('Title text')
    })
  })

  describe('CardDescription', () => {
    it('renders description text', () => {
      render(<CardDescription data-testid="desc">Description text</CardDescription>)
      const desc = screen.getByTestId('desc')
      expect(desc).toHaveTextContent('Description text')
    })
  })

  describe('CardContent', () => {
    it('renders content text', () => {
      render(<CardContent data-testid="content">Content text</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveTextContent('Content text')
    })

    it('renders children when visible is true (default)', () => {
      render(<CardContent data-testid="content">Content text</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveTextContent('Content text')
    })

    it('renders children when visible is explicitly true', () => {
      render(<CardContent data-testid="content" visible={true}>Content text</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).toHaveTextContent('Content text')
    })

    it('does not render children when visible is false', () => {
      render(<CardContent data-testid="content" visible={false}>Content text</CardContent>)
      const content = screen.getByTestId('content')
      expect(content).not.toHaveTextContent('Content text')
      expect(content).toBeEmptyDOMElement()
    })
  })

  describe('CardFooter', () => {
    it('renders footer content', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveTextContent('Footer content')
    })
  })

  describe('Card composition', () => {
    it('renders a complete card structure', () => {
      render(
        <Card data-testid="full-card">
          <CardHeader>
            <CardHeading>Test Title</CardHeading>
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