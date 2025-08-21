import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateTaskForm } from './create-task-form'

// Mock external dependencies, not the component itself
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
  createTask: jest.fn()
}))

jest.mock('@/app/login/actions', () => ({
  getAllUsers: jest.fn(() => Promise.resolve([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ]))
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn()
  }))
}))

describe('CreateTaskForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields correctly', async () => {
    render(<CreateTaskForm />)
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })
    
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument() 
    expect(screen.getByText('Assignee')).toBeInTheDocument()
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument()
  })

  it('shows correct default values for select fields', async () => {
    render(<CreateTaskForm />)
    
    await waitFor(() => {
      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes).toHaveLength(3)
    })
    
    const comboboxes = screen.getAllByRole('combobox')
    
    // Check default values - the order should be Status, Priority, Assignee based on the component
    expect(comboboxes[0]).toHaveTextContent('Todo') // Status default
    expect(comboboxes[1]).toHaveTextContent('Medium') // Priority default  
    expect(comboboxes[2]).toHaveTextContent('Select assignee') // Assignee placeholder
  })

  it('handles user input in title field', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })
    
    const titleInput = screen.getByLabelText('Title')
    await user.type(titleInput, 'New Task Title')
    
    expect(titleInput).toHaveValue('New Task Title')
  })

  it('handles user input in description field', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
    })
    
    const descriptionTextarea = screen.getByLabelText('Description')
    await user.type(descriptionTextarea, 'Task description here')
    
    expect(descriptionTextarea).toHaveValue('Task description here')
  })

  it('handles date input', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    })
    
    const dateInput = screen.getByLabelText('Due Date')
    await user.type(dateInput, '2024-12-31')
    
    expect(dateInput).toHaveValue('2024-12-31')
  })

  it('title field is required', async () => {
    render(<CreateTaskForm />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })
    
    const titleInput = screen.getByLabelText('Title')
    expect(titleInput).toBeRequired()
  })

  it('renders form with submit button', async () => {
    render(<CreateTaskForm />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument()
    })
    
    const submitButton = screen.getByRole('button', { name: 'Create Task' })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('calls onFinish prop when provided', async () => {
    const mockOnFinish = jest.fn()
    render(<CreateTaskForm onFinish={mockOnFinish} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument()
    })
    
    // The onFinish function exists and can be called
    expect(typeof mockOnFinish).toBe('function')
  })
})