import { useState } from "react";
import { Header } from "./components/Header";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";




function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  console.log(tasks);

  return (
    <div className="App">
      <div className="app-container">
        <Header />

        <div className={tasks.length > 0  ? ("main-container "):("main-container no-gap")}>
          <TaskForm setTasks={setTasks} selectedTask={selectedTask} setSelectedTask={setSelectedTask}/>
          <TaskList setTasks={setTasks} tasks={tasks} setSelectedTask={setSelectedTask} />
        </div>

      </div>
    </div>
  );
}

export default App;
