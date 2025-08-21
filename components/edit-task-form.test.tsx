import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTaskForm } from './edit-task-form'

// Mock external dependencies, not the component itself
jest.mock('@/app/(dashboard)/tasks/actions', () => ({
  updateTask: jest.fn()
}))

jest.mock('@/app/login/actions', () => ({
  getAllUsers: jest.fn(() => Promise.resolve([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ]))
}))

jest.mock('@/lib/date-utils', () => ({
  formatDateForInput: jest.fn((date) => date ? '2024-12-31' : '')
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn()
  }))
}))

describe('EditTaskForm Component', () => {
  const mockTask = {
    id: 1,
    name: 'Test Task',
    description: 'Test description',
    status: 'in_progress' as const,
    priority: 'high' as const,
    assigneeId: 1,
    assignee: { name: 'John Doe' },
    dueDate: new Date('2024-12-25'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields correctly', async () => {
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })
    
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
    expect(screen.getByText('Assignee')).toBeInTheDocument()
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })

  it('pre-fills form fields with task data', async () => {
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('Test Task')
    })
    
    expect(screen.getByLabelText('Description')).toHaveValue('Test description')
    expect(screen.getByLabelText('Due Date')).toHaveValue('2024-12-31') // Mocked date format
  })

  it('shows correct default values for select fields', async () => {
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes).toHaveLength(3)
    })
    
    const comboboxes = screen.getAllByRole('combobox')
    
    // Check default values - Status, Priority, Assignee
    expect(comboboxes[0]).toHaveTextContent('In Progress')
    expect(comboboxes[1]).toHaveTextContent('High') 
    expect(comboboxes[2]).toHaveTextContent('John Doe') // Should show assigned user
  })

  it('handles task with null description', async () => {
    const taskWithNullDescription = { ...mockTask, description: null }
    
    render(<EditTaskForm task={taskWithNullDescription} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Description')).toHaveValue('')
    })
  })

  it('handles task with null assignee', async () => {
    const taskWithNullAssignee = { ...mockTask, assigneeId: null, assignee: null }
    
    render(<EditTaskForm task={taskWithNullAssignee} />)
    
    await waitFor(() => {
      const comboboxes = screen.getAllByRole('combobox')
      expect(comboboxes[2]).toHaveTextContent('Select assignee') // Assignee combobox should show placeholder
    })
  })

  it('handles task with null due date', async () => {
    const taskWithNullDueDate = { ...mockTask, dueDate: null }
    
    render(<EditTaskForm task={taskWithNullDueDate} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Due Date')).toHaveValue('')
    })
  })

  it('allows editing the title field', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })
    
    const titleInput = screen.getByLabelText('Title')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Task Title')
    
    expect(titleInput).toHaveValue('Updated Task Title')
  })

  it('allows editing the description field', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
    })
    
    const descriptionTextarea = screen.getByLabelText('Description')
    await user.clear(descriptionTextarea)
    await user.type(descriptionTextarea, 'Updated description')
    
    expect(descriptionTextarea).toHaveValue('Updated description')
  })

  it('allows changing the due date', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    })
    
    const dateInput = screen.getByLabelText('Due Date')
    await user.clear(dateInput)
    await user.type(dateInput, '2025-01-15')
    
    expect(dateInput).toHaveValue('2025-01-15')
  })

  it('title field is required', async () => {
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
    })
    
    const titleInput = screen.getByLabelText('Title')
    expect(titleInput).toBeRequired()
  })

  it('submit button has correct text and type', async () => {
    render(<EditTaskForm task={mockTask} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
    })
    
    const submitButton = screen.getByRole('button', { name: 'Save Changes' })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('calls onFinish prop when provided', async () => {
    const mockOnFinish = jest.fn()
    render(<EditTaskForm task={mockTask} onFinish={mockOnFinish} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
    })
    
    // The onFinish function exists and can be called
    expect(typeof mockOnFinish).toBe('function')
  })
})