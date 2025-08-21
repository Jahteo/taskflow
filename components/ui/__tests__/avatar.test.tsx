import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback, AvatarName } from '../avatar'

// Mock Radix UI Avatar components
jest.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Image: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
  Fallback: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('renders with default styles', () => {
      render(<Avatar data-testid="avatar" />)
      const avatar = screen.getByTestId('avatar')
      
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveClass(
        'relative',
        'flex',
        'h-10',
        'w-10',
        'shrink-0',
        'overflow-hidden',
        'rounded-full'
      )
    })

    it('applies custom className', () => {
      render(<Avatar className="custom-avatar" data-testid="avatar" />)
      expect(screen.getByTestId('avatar')).toHaveClass('custom-avatar')
    })
  })

  describe('AvatarImage', () => {
    it('renders with correct attributes', () => {
      render(
        <Avatar>
          <AvatarImage src="/test-image.jpg" alt="Test avatar" />
        </Avatar>
      )
      
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', '/test-image.jpg')
      expect(image).toHaveAttribute('alt', 'Test avatar')
      expect(image).toHaveClass('aspect-square', 'h-full', 'w-full')
    })
  })

  describe('AvatarFallback', () => {
    it('renders with fallback styles', () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="fallback">AB</AvatarFallback>
        </Avatar>
      )
      
      const fallback = screen.getByTestId('fallback')
      expect(fallback).toHaveClass(
        'flex',
        'h-full',
        'w-full',
        'items-center',
        'justify-center',
        'rounded-full',
        'bg-background-light'
      )
      expect(fallback).toHaveTextContent('AB')
    })
  })

  describe('AvatarName', () => {
    it('generates initials from a single name', () => {
      render(<AvatarName name="John" />)
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('generates initials from first and last name', () => {
      render(<AvatarName name="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('generates initials from multiple names', () => {
      render(<AvatarName name="John Michael Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('handles names with extra spaces', () => {
      render(<AvatarName name="  John   Doe  " />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('handles empty name gracefully', () => {
      const { container } = render(<AvatarName name="" />)
      const nameElement = container.querySelector('span')
      expect(nameElement).toBeInTheDocument()
      expect(nameElement).toHaveTextContent('')
    })

    it('applies custom className', () => {
      render(<AvatarName name="John Doe" className="custom-name" />)
      const nameElement = screen.getByText('JD')
      expect(nameElement).toHaveClass('custom-name')
    })

    it('has correct base styling', () => {
      render(<AvatarName name="John Doe" />)
      const nameElement = screen.getByText('JD')
      expect(nameElement).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-full',
        'bg-background-light',
        'font-medium',
        'w-full',
        'h-full'
      )
    })

    it('converts initials to uppercase', () => {
      render(<AvatarName name="john doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })

  describe('Avatar composition', () => {
    it('renders complete avatar with image and fallback', () => {
      render(
        <Avatar>
          <AvatarImage src="/test.jpg" alt="Test" />
          <AvatarFallback>
            <AvatarName name="John Doe" />
          </AvatarFallback>
        </Avatar>
      )
      
      // Both should be in DOM (fallback shows if image fails to load)
      expect(screen.getByRole('img')).toBeInTheDocument()
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })
})