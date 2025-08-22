import { render, screen } from '@testing-library/react'
import { TaskOverview } from './task-overview'

// Mock the UI components
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={className}>{children}</div>,
  AvatarName: ({ name }: { name: string }) => <span>{name}</span>,
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardDescription: ({ children }: any) => <div data-testid="card-description">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardHeading: ({ children }: any) => <h2 data-testid="card-title">{children}</h2>,
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => <span data-testid="badge" data-variant={variant}>{children}</span>,
}))

describe('TaskOverview Component', () => {
  const mockTasks = [
    {
      id: 1,
      name: 'Test Task 1',
      description: 'Test description 1',
      status: 'todo',
      priority: 'High',
      assignee: { name: 'John Doe' },
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      assigneeId: 1,
      creatorId: 1,
    },
    {
      id: 2,
      name: 'Test Task 2',
      description: 'Test description 2',
      status: 'in_progress',
      priority: 'Medium',
      assignee: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      assigneeId: null,
      creatorId: 1,
    },
    {
      id: 3,
      name: 'Test Task 3',
      description: 'Test description 3',
      status: 'done',
      priority: 'Low',
      assignee: { name: 'Jane Smith' },
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      assigneeId: 2,
      creatorId: 1,
    },
  ]

  it('renders the card structure correctly', () => {
    render(<TaskOverview tasks={mockTasks} />)
    
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByTestId('card-title')).toHaveTextContent('Recent Tasks')
    expect(screen.getByTestId('card-description')).toHaveTextContent('An overview of the most recently created tasks.')
    expect(screen.getByTestId('card-content')).toBeInTheDocument()
  })

  it('displays tasks when provided', () => {
    render(<TaskOverview tasks={mockTasks} />)
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    expect(screen.getByText('Test Task 3')).toBeInTheDocument()
  })

  it('displays assignee information correctly', () => {
    render(<TaskOverview tasks={mockTasks} />)
    
    expect(screen.getByText('Assigned to John Doe')).toBeInTheDocument()
    expect(screen.getByText('Assigned to Unassigned')).toBeInTheDocument()
    expect(screen.getByText('Assigned to Jane Smith')).toBeInTheDocument()
  })

  it('displays avatar names correctly', () => {
    render(<TaskOverview tasks={mockTasks} />)
    
    expect(screen.getAllByText('John Doe')).toHaveLength(1) // In avatar
    expect(screen.getAllByText('Unassigned')).toHaveLength(1) // In avatar
    expect(screen.getAllByText('Jane Smith')).toHaveLength(1) // In avatar
  })

  it('displays priority badges with correct variants', () => {
    render(<TaskOverview tasks={mockTasks} />)
    
    const badges = screen.getAllByTestId('badge')
    expect(badges).toHaveLength(3)
    
    // Check priority badge content and variants
    expect(badges[0]).toHaveTextContent('High')
    expect(badges[0]).toHaveAttribute('data-variant', 'destructive')
    
    expect(badges[1]).toHaveTextContent('Medium')
    expect(badges[1]).toHaveAttribute('data-variant', 'default')
    
    expect(badges[2]).toHaveTextContent('Low')
    expect(badges[2]).toHaveAttribute('data-variant', 'secondary')
  })

  it('handles tasks with default priority', () => {
    const taskWithDefaultPriority = [{
      ...mockTasks[0],
      priority: 'Medium', // Use proper case
    }]
    
    render(<TaskOverview tasks={taskWithDefaultPriority} />)
    
    // Get all badges and find the priority badge specifically
    const badges = screen.getAllByTestId('badge')
    const priorityBadge = badges.find(badge => badge.textContent === 'Medium')
    expect(priorityBadge).toHaveAttribute('data-variant', 'default') // Should be Medium
  })

  it('displays "No recent tasks" when tasks array is empty', () => {
    render(<TaskOverview tasks={[]} />)
    expect(screen.getByText('No recent tasks.')).toBeInTheDocument()
  })

  it('displays "No recent tasks" when tasks is null', () => {
    render(<TaskOverview tasks={null} />)
    expect(screen.getByText('No recent tasks.')).toBeInTheDocument()
  })

  it('handles tasks without assignee gracefully', () => {
    const taskWithoutAssignee = [{
      id: 1,
      name: 'Unassigned Task',
      description: 'Test description',
      status: 'todo',
      priority: 'Medium',
      assignee: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: null,
      assigneeId: null,
      creatorId: 1,
    }]
    
    render(<TaskOverview tasks={taskWithoutAssignee} />)
    
    expect(screen.getByText('Unassigned Task')).toBeInTheDocument()
    expect(screen.getByText('Assigned to Unassigned')).toBeInTheDocument()
    expect(screen.getByText('Unassigned')).toBeInTheDocument() // In avatar
  })

  it('renders correct structure for each task item', () => {
    render(<TaskOverview tasks={[mockTasks[0]]} />)
    
    // Find the parent container that has flex classes
    const taskElements = screen.getByTestId('card-content').querySelector('.space-y-4')
    expect(taskElements).toBeInTheDocument()
    
    // Check that the first child has the correct flex classes
    const firstTaskItem = taskElements?.firstElementChild
    expect(firstTaskItem).toHaveClass('flex', 'items-center')
    
    // Check that avatar has correct classes
    const avatar = screen.getByText('John Doe').closest('div')
    expect(avatar).toHaveClass('h-9', 'w-9')
  })
})