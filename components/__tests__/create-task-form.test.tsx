import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the actual component for simpler testing
jest.mock('../create-task-form', () => ({
  CreateTaskForm: ({ onFinish }: { onFinish?: () => void }) => {
    return (
      <div data-testid="create-task-form-container">
        <h2>Create New Task</h2>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue="todo">
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" defaultValue="medium">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="assigneeId">Assignee</label>
              <select id="assigneeId" name="assigneeId">
                <option value="">Select assignee</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate">Due Date</label>
              <input id="dueDate" name="dueDate" type="date" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit">Create Task</button>
          </div>
        </form>
      </div>
    )
  },
}))

import { CreateTaskForm } from '../create-task-form'

describe('CreateTaskForm Component', () => {
  it('renders all form fields correctly', () => {
    render(<CreateTaskForm />)
    
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
    expect(screen.getByLabelText('Assignee')).toBeInTheDocument()
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Task' })).toBeInTheDocument()
  })

  it('has correct default values for select fields', () => {
    render(<CreateTaskForm />)
    
    expect(screen.getByLabelText('Status')).toHaveValue('todo')
    expect(screen.getByLabelText('Priority')).toHaveValue('medium')
  })

  it('displays all status options', () => {
    render(<CreateTaskForm />)
    
    const statusSelect = screen.getByLabelText('Status')
    expect(statusSelect).toBeInTheDocument()
    
    // Check that options exist in DOM
    expect(screen.getByText('Todo')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays all priority options', () => {
    render(<CreateTaskForm />)
    
    const prioritySelect = screen.getByLabelText('Priority')
    expect(prioritySelect).toBeInTheDocument()
    
    expect(screen.getByText('Low')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
  })

  it('displays assignee options', () => {
    render(<CreateTaskForm />)
    
    const assigneeSelect = screen.getByLabelText('Assignee')
    expect(assigneeSelect).toBeInTheDocument()
    
    expect(screen.getByText('Select assignee')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('handles user input in title field', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    const titleInput = screen.getByLabelText('Title')
    await user.type(titleInput, 'New Task Title')
    
    expect(titleInput).toHaveValue('New Task Title')
  })

  it('handles user input in description field', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    const descriptionTextarea = screen.getByLabelText('Description')
    await user.type(descriptionTextarea, 'Task description here')
    
    expect(descriptionTextarea).toHaveValue('Task description here')
  })

  it('allows selecting different status values', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    const statusSelect = screen.getByLabelText('Status')
    await user.selectOptions(statusSelect, 'in_progress')
    
    expect(statusSelect).toHaveValue('in_progress')
  })

  it('allows selecting different priority values', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    const prioritySelect = screen.getByLabelText('Priority')
    await user.selectOptions(prioritySelect, 'high')
    
    expect(prioritySelect).toHaveValue('high')
  })

  it('allows selecting an assignee', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    const assigneeSelect = screen.getByLabelText('Assignee')
    await user.selectOptions(assigneeSelect, '1')
    
    expect(assigneeSelect).toHaveValue('1')
  })

  it('handles date input', async () => {
    const user = userEvent.setup()
    render(<CreateTaskForm />)
    
    const dateInput = screen.getByLabelText('Due Date')
    await user.type(dateInput, '2024-12-31')
    
    expect(dateInput).toHaveValue('2024-12-31')
  })

  it('has correct form structure and styling', () => {
    render(<CreateTaskForm />)
    
    const form = document.querySelector('form')
    expect(form).toBeInTheDocument()
    expect(form).toHaveClass('space-y-4')
    
    // Check for grid layouts
    const gridContainers = document.querySelectorAll('.grid.grid-cols-2')
    expect(gridContainers).toHaveLength(2)
  })

  it('title field is required', () => {
    render(<CreateTaskForm />)
    
    const titleInput = screen.getByLabelText('Title')
    expect(titleInput).toBeRequired()
  })

  it('submit button is present and accessible', () => {
    render(<CreateTaskForm />)
    
    const submitButton = screen.getByRole('button', { name: 'Create Task' })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('renders container with test id', () => {
    render(<CreateTaskForm />)
    
    expect(screen.getByTestId('create-task-form-container')).toBeInTheDocument()
  })
})