import { render, screen } from '@testing-library/react'

// Mock complex dependencies
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: any) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }: any) => (
    <div data-testid="droppable">
      {children({ 
        provided: { innerRef: () => {}, droppableProps: {} }, 
        snapshot: { isDraggingOver: false } 
      })}
    </div>
  ),
  Draggable: ({ children }: any) => (
    <div data-testid="draggable">
      {children({ 
        provided: { innerRef: () => {}, draggableProps: {}, dragHandleProps: {} }, 
        snapshot: { isDragging: false } 
      })}
    </div>
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className} data-testid="card">{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className} data-testid="card-content">{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={className} data-testid="card-header">{children}</div>,
  CardTitle: ({ children, className }: any) => <h3 className={className} data-testid="card-title">{children}</h3>,
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: any) => <span data-testid="badge" data-variant={variant}>{children}</span>,
}))

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={className} data-testid="avatar">{children}</div>,
  AvatarFallback: ({ children }: any) => <div data-testid="avatar-fallback">{children}</div>,
  AvatarImage: ({ src, alt }: any) => <img src={src} alt={alt} data-testid="avatar-image" />,
  AvatarName: ({ name }: { name: string }) => <span data-testid="avatar-name">{name}</span>,
}))

jest.mock('@/app/(dashboard)/tasks/actions', () => ({
  updateTaskStatus: jest.fn(),
}))

jest.mock('@/lib/fonts', () => ({
  poppins: { className: 'poppins-font' },
}))

import { KanbanBoard } from './kanban-board'

describe('KanbanBoard Component', () => {
  const mockInitialData = {
    todo: {
      id: 'todo',
      title: 'To Do',
      tasks: [
        {
          id: 1,
          name: 'Task 1',
          description: 'Description 1',
          status: 'todo',
          priority: 'high',
          assignee: { name: 'John Doe' },
        },
        {
          id: 2,
          name: 'Task 2',
          description: 'Description 2',
          status: 'todo',
          priority: 'medium',
          assignee: null,
        },
      ],
    },
    in_progress: {
      id: 'in_progress',
      title: 'In Progress',
      tasks: [
        {
          id: 3,
          name: 'Task 3',
          description: 'Description 3',
          status: 'in_progress',
          priority: 'low',
          assignee: { name: 'Jane Smith' },
        },
      ],
    },
    done: {
      id: 'done',
      title: 'Done',
      tasks: [],
    },
  }

  it('renders the kanban board container', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument()
    expect(screen.getByTestId('kanban-board')).toHaveClass('flex', 'gap-6')
  })

  it('renders all columns', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    expect(screen.getByTestId('column-todo')).toBeInTheDocument()
    expect(screen.getByTestId('column-in_progress')).toBeInTheDocument()
    expect(screen.getByTestId('column-done')).toBeInTheDocument()
  })

  it('displays column titles correctly', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('displays task count badges for each column', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    const badges = screen.getAllByTestId('badge')
    const countBadges = badges.filter(badge => 
      badge.getAttribute('data-variant') === 'secondary' && 
      ['0', '1', '2'].includes(badge.textContent || '')
    )
    
    expect(countBadges).toHaveLength(3)
    expect(countBadges[0]).toHaveTextContent('2') // todo column
    expect(countBadges[1]).toHaveTextContent('1') // in_progress column
    expect(countBadges[2]).toHaveTextContent('0') // done column
  })

  it('renders tasks in their respective columns', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    expect(screen.getByTestId('task-1')).toBeInTheDocument()
    expect(screen.getByTestId('task-2')).toBeInTheDocument()
    expect(screen.getByTestId('task-3')).toBeInTheDocument()
  })

  it('displays task names correctly', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
    expect(screen.getByText('Task 3')).toBeInTheDocument()
  })

  it('displays task priorities with correct badge variants', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    const priorityBadges = screen.getAllByTestId('badge').filter(badge => 
      ['high', 'medium', 'low'].includes(badge.textContent || '')
    )
    
    expect(priorityBadges).toHaveLength(3)
    
    const highPriorityBadge = priorityBadges.find(badge => badge.textContent === 'high')
    expect(highPriorityBadge).toHaveAttribute('data-variant', 'destructive')
    
    const mediumPriorityBadge = priorityBadges.find(badge => badge.textContent === 'medium')
    expect(mediumPriorityBadge).toHaveAttribute('data-variant', 'default')
    
    const lowPriorityBadge = priorityBadges.find(badge => badge.textContent === 'low')
    expect(lowPriorityBadge).toHaveAttribute('data-variant', 'secondary')
  })

  it('displays assignee information correctly', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Unassigned')).toBeInTheDocument()
  })

  it('handles empty columns gracefully', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    // Done column should be empty but still render
    const doneColumn = screen.getByTestId('column-done')
    expect(doneColumn).toBeInTheDocument()
    
    // Should show 0 count
    const badges = screen.getAllByTestId('badge')
    const doneCountBadge = badges.find(badge => 
      badge.getAttribute('data-variant') === 'secondary' && 
      badge.textContent === '0'
    )
    expect(doneCountBadge).toBeInTheDocument()
  })

  it('renders column structure with correct classes', () => {
    render(<KanbanBoard initialData={mockInitialData} />)
    
    const todoColumn = screen.getByTestId('column-todo')
    expect(todoColumn).toHaveClass('w-80')
  })

  it('handles single task data correctly', () => {
    const singleTaskData = {
      todo: {
        id: 'todo',
        title: 'To Do',
        tasks: [
          {
            id: 1,
            name: 'Single Task',
            description: 'Single task description',
            status: 'todo',
            priority: 'medium',
            assignee: { name: 'Test User' },
          },
        ],
      },
    }
    
    render(<KanbanBoard initialData={singleTaskData} />)
    
    expect(screen.getByText('Single Task')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
  })
})