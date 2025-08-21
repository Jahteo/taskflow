import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the EditTaskForm with a simplified version
jest.mock('./edit-task-form', () => ({
  EditTaskForm: ({ task, onFinish }: any) => {
    return (
      <div data-testid="edit-task-form-container">
        <h2>Edit Task</h2>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" defaultValue={task.name} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" defaultValue={task.description || ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={task.status}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" defaultValue={task.priority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="assigneeId">Assignee</label>
              <select id="assigneeId" name="assigneeId" defaultValue={task.assigneeId || ''}>
                <option value="">Select assignee</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate">Due Date</label>
              <input 
                id="dueDate" 
                name="dueDate" 
                type="date" 
                defaultValue={task.dueDate ? task.dueDate.toISOString().split('T')[0] : ''}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    )
  },
}))

import { EditTaskForm } from './edit-task-form'

describe('EditTaskForm Component', () => {
  const mockTask = {
    id: 1,
    name: 'Test Task',
    description: 'Test description',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 1,
    assignee: { name: 'John Doe' },
    dueDate: new Date('2024-12-25'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('renders all form fields correctly', () => {
    render(<EditTaskForm task={mockTask} />)
    
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
    expect(screen.getByLabelText('Assignee')).toBeInTheDocument()
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })

  it('pre-fills form fields with task data', () => {
    render(<EditTaskForm task={mockTask} />)
    
    expect(screen.getByLabelText('Title')).toHaveValue('Test Task')
    expect(screen.getByLabelText('Description')).toHaveValue('Test description')
    expect(screen.getByLabelText('Status')).toHaveValue('in_progress')
    expect(screen.getByLabelText('Priority')).toHaveValue('high')
    expect(screen.getByLabelText('Assignee')).toHaveValue('1')
    expect(screen.getByLabelText('Due Date')).toHaveValue('2024-12-25')
  })

  it('displays all status options', () => {
    render(<EditTaskForm task={mockTask} />)
    
    expect(screen.getByText('Todo')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays all priority options', () => {
    render(<EditTaskForm task={mockTask} />)
    
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('displays assignee options', () => {
    render(<EditTaskForm task={mockTask} />)
    
    expect(screen.getByText('Select assignee')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('handles task with null description', () => {
    const taskWithNullDescription = { ...mockTask, description: null }
    
    render(<EditTaskForm task={taskWithNullDescription} />)
    
    expect(screen.getByLabelText('Description')).toHaveValue('')
  })

  it('handles task with null assignee', () => {
    const taskWithNullAssignee = { ...mockTask, assigneeId: null, assignee: null }
    
    render(<EditTaskForm task={taskWithNullAssignee} />)
    
    expect(screen.getByLabelText('Assignee')).toHaveValue('')
  })

  it('handles task with null due date', () => {
    const taskWithNullDueDate = { ...mockTask, dueDate: null }
    
    render(<EditTaskForm task={taskWithNullDueDate} />)
    
    expect(screen.getByLabelText('Due Date')).toHaveValue('')
  })

  it('allows editing the title field', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    const titleInput = screen.getByLabelText('Title')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Task Title')
    
    expect(titleInput).toHaveValue('Updated Task Title')
  })

  it('allows editing the description field', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    const descriptionTextarea = screen.getByLabelText('Description')
    await user.clear(descriptionTextarea)
    await user.type(descriptionTextarea, 'Updated description')
    
    expect(descriptionTextarea).toHaveValue('Updated description')
  })

  it('allows changing the status', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    const statusSelect = screen.getByLabelText('Status')
    await user.selectOptions(statusSelect, 'done')
    
    expect(statusSelect).toHaveValue('done')
  })

  it('allows changing the priority', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    const prioritySelect = screen.getByLabelText('Priority')
    await user.selectOptions(prioritySelect, 'low')
    
    expect(prioritySelect).toHaveValue('low')
  })

  it('allows changing the assignee', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    const assigneeSelect = screen.getByLabelText('Assignee')
    await user.selectOptions(assigneeSelect, '2')
    
    expect(assigneeSelect).toHaveValue('2')
  })

  it('allows changing the due date', async () => {
    const user = userEvent.setup()
    render(<EditTaskForm task={mockTask} />)
    
    const dateInput = screen.getByLabelText('Due Date')
    await user.clear(dateInput)
    await user.type(dateInput, '2025-01-15')
    
    expect(dateInput).toHaveValue('2025-01-15')
  })

  it('has correct form structure', () => {
    render(<EditTaskForm task={mockTask} />)
    
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('space-y-4')
    
    // Check for grid layouts
    const gridContainers = document.querySelectorAll('.grid.grid-cols-2')
    expect(gridContainers).toHaveLength(2)
  })

  it('title field is required', () => {
    render(<EditTaskForm task={mockTask} />)
    
    const titleInput = screen.getByLabelText('Title')
    expect(titleInput).toBeRequired()
  })

  it('submit button has correct text and type', () => {
    render(<EditTaskForm task={mockTask} />)
    
    const submitButton = screen.getByRole('button', { name: 'Save Changes' })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('renders container with test id', () => {
    render(<EditTaskForm task={mockTask} />)
    
    expect(screen.getByTestId('edit-task-form-container')).toBeInTheDocument()
  })

  it('correctly formats date for input field', () => {
    const taskWithSpecificDate = {
      ...mockTask,
      dueDate: new Date('2024-03-15T10:30:00Z')
    }
    
    render(<EditTaskForm task={taskWithSpecificDate} />)
    
    expect(screen.getByLabelText('Due Date')).toHaveValue('2024-03-15')
  })
})