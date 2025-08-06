import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/task";
import { LogOut, Plus, Calendar, Clock, CheckCircle, Circle, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import emptyTasksImg from "@/assets/empty-tasks.png";

const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("open");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<{
    title: string;
    description: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
  }>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!taskForm.title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Task title is required"
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
      priority: taskForm.priority,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTasks([...tasks, newTask]);
    setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" });
    setIsAddDialogOpen(false);
    toast({
      title: "Success",
      description: "Task added successfully"
    });
  };

  const handleEditTask = () => {
    if (!editingTask || !taskForm.title.trim()) return;

    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id 
        ? {
            ...task,
            title: taskForm.title,
            description: taskForm.description,
            dueDate: taskForm.dueDate ? new Date(taskForm.dueDate) : undefined,
            priority: taskForm.priority,
            updatedAt: new Date()
          }
        : task
    );

    setTasks(updatedTasks);
    setEditingTask(null);
    setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" });
    toast({
      title: "Success",
      description: "Task updated successfully"
    });
  };

  const toggleTaskStatus = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: (task.status === "open" ? "completed" : "open") as "open" | "completed",
            updatedAt: new Date()
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Success",
      description: "Task deleted successfully"
    });
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? format(task.dueDate, "yyyy-MM-dd") : "",
      priority: task.priority as "medium" | "low" | "high"
    });
  };

  const filteredTasks = tasks.filter(task => task.status === activeTab);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const EmptyState = ({ type }: { type: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <img src={emptyTasksImg} alt="No tasks" className="w-48 h-48 mb-6 opacity-80" />
      <h3 className="text-xl font-semibold mb-2">
        {type === "open" ? "No tasks yet" : "No completed tasks"}
      </h3>
      <p className="text-muted-foreground mb-6">
        {type === "open" 
          ? "Add your first task to get started!" 
          : "Complete some tasks to see them here"}
      </p>
      {type === "open" && (
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-warning hover:bg-warning/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Task
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="open">Open Tasks ({tasks.filter(t => t.status === "open").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({tasks.filter(t => t.status === "completed").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-4">
            {filteredTasks.length === 0 ? (
              <EmptyState type="open" />
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button onClick={() => toggleTaskStatus(task.id)}>
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                          </button>
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-muted-foreground mb-2 ml-8">{task.description}</p>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-2 ml-8 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Due: {format(task.dueDate, "PPP")}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredTasks.length === 0 ? (
              <EmptyState type="completed" />
            ) : (
              filteredTasks.map((task) => (
                <Card key={task.id} className="shadow-sm opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button onClick={() => toggleTaskStatus(task.id)}>
                            <CheckCircle className="w-5 h-5 text-success" />
                          </button>
                          <h3 className="font-semibold text-lg line-through text-muted-foreground">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-muted-foreground mb-2 ml-8 line-through">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 ml-8 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Completed: {format(task.updatedAt, "PPP")}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            size="lg"
            className="rounded-full w-14 h-14 shadow-glow bg-primary hover:bg-primary/90"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Add/Edit Task Dialog */}
        <Dialog open={isAddDialogOpen || !!editingTask} onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setEditingTask(null);
            setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" });
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Enter task description (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({ ...taskForm, priority: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={editingTask ? handleEditTask : handleAddTask}
                  className="flex-1 bg-warning hover:bg-warning/90"
                >
                  {editingTask ? "Update" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingTask(null);
                    setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskScreen;