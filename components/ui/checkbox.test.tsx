import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './checkbox'

describe('Checkbox Component', () => {
  it('renders unchecked by default', () => {
    render(<Checkbox />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('can be checked and unchecked', async () => {
    const user = userEvent.setup()
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    
    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('handles controlled state', () => {
    const { rerender } = render(<Checkbox checked={false} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    
    rerender(<Checkbox checked={true} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('handles onCheckedChange callback', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<Checkbox onCheckedChange={handleChange} />)
    
    await user.click(screen.getByRole('checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('can be disabled', () => {
    render(<Checkbox disabled />)
    const checkbox = screen.getByRole('checkbox')
    
    expect(checkbox).toBeDisabled()
  })

  it('forwards ref correctly', () => {
    const ref = jest.fn()
    render(<Checkbox ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })

  it('shows check icon when checked', async () => {
    const user = userEvent.setup()
    render(<Checkbox />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    // The check icon should be present when checked
    const checkIcon = checkbox.querySelector('svg')
    expect(checkIcon).toBeInTheDocument()
  })

  it('supports indeterminate state', () => {
    render(<Checkbox checked="indeterminate" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
  })
})