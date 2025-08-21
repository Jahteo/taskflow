# Page Components Style Guide

## Unique Patterns in TaskFlow

### Server Component Data Fetching Pattern
Page components are server components that fetch data directly:

```tsx
import { getCurrentUser } from "@/app/login/actions";
import { getAllTasks } from "./actions";

export default async function TasksPage() {
    const user = await getCurrentUser();
    const { tasks } = await getAllTasks();

    return <TasksPageClient tasks={tasks} />;
}
```

### Client Component Delegation Pattern
Pages delegate interactive functionality to client components:

```tsx
// Server component (page.tsx)
export default async function IndexPage() {
  const user = await getCurrentUser();
  const { tasks: allTasks } = await getAllTasks();
  
  // Process data server-side
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === 'done').length;
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Server-rendered content */}
      <DashboardCharts data={chartData} />
      <TaskOverview tasks={recentTasks} />
    </div>
  );
}
```

### Data Processing Pattern
Pages process raw data for components:

```tsx
// Status distribution calculation
const statusData = allTasks.reduce((acc, task) => {
  acc[task.status] = (acc[task.status] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

// Chart-friendly data transformation
const statusChartData = Object.entries(statusData).map(([status, count]) => ({
  name: status,
  value: count,
}));
```

### Kanban Data Structure Pattern
Board pages transform task data into kanban structure:

```tsx
// Transform tasks into kanban columns
const kanbanData: KanbanData = {
  todo: { id: "todo", title: "To Do", tasks: tasks.filter(t => t.status === "todo") },
  in_progress: { id: "in_progress", title: "In Progress", tasks: tasks.filter(t => t.status === "in_progress") },
  review: { id: "review", title: "Review", tasks: tasks.filter(t => t.status === "review") },
  done: { id: "done", title: "Done", tasks: tasks.filter(t => t.status === "done") }
};

return <KanbanBoard initialData={kanbanData} />;
```

### Error Handling in Pages
Pages handle server action errors gracefully:

```tsx
const { tasks, error } = await getAllTasks();

if (error) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="text-center py-10">
        <p className="text-muted-foreground">Failed to load tasks</p>
      </div>
    </div>
  );
}
```

### Metrics Calculation Pattern
Dashboard pages calculate metrics from raw data:

```tsx
const totalTasks = allTasks.length;
const completedTasks = allTasks.filter(task => task.status === 'done').length;
const openTasks = allTasks.filter(task => task.status !== 'done').length;
const teamMembers = new Set(allTasks.map(task => task.assignee?.name).filter(Boolean)).size;

// Percentage calculations
const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
```

### Conditional Rendering Pattern
Pages handle empty states and loading states:

```tsx
{tasks && tasks.length > 0 ? (
  <TasksPageClient tasks={tasks} />
) : (
  <div className="text-center py-10">
    <p className="text-muted-foreground">No tasks found</p>
  </div>
)}
```

### Layout Structure Pattern
Pages follow consistent layout structure:

```tsx
return (
  <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Metric cards */}
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Charts and overview */}
    </div>
  </div>
);
```

### Page Import Organization
Pages organize imports in this order:

```tsx
// 1. Server actions (current and auth)
import { getCurrentUser } from "@/app/login/actions";
import { getAllTasks } from "./actions";

// 2. Component imports
import { TaskOverview } from "@/components/task-overview";
import { DashboardCharts } from "@/components/dashboard-charts";

// 3. Type imports
import type { KanbanData } from "@/lib/types";
```