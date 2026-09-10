export interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  due: string;
  completed: boolean;
}
