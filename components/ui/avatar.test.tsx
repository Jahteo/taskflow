import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback, AvatarName } from './avatar'

// Mock Radix UI Avatar components
jest.mock('@radix-ui/react-avatar', () => ({
  Root: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Image: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
  Fallback: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('renders correctly', () => {
      render(<Avatar data-testid="avatar" />)
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toBeInTheDocument()
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
    })
  })

  describe('AvatarFallback', () => {
    it('renders fallback content correctly', () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="fallback">AB</AvatarFallback>
        </Avatar>
      )
      
      const fallback = screen.getByTestId('fallback')
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