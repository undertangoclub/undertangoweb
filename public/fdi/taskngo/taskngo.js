const { useState, useEffect } = React;

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");

  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: newHabitName,
        days: [false, false, false, false, false, false, false],
        subTasks: [],
      };
      setHabits([...habits, newHabit]);
      setNewHabitName("");
    }
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const toggleDay = (habitId, dayIndex) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              days: habit.days.map((day, index) =>
                index === dayIndex ? !day : day
              ),
            }
          : habit
      )
    );
  };

  const addSubTask = (habitId, subTaskName) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              subTasks: [
                ...habit.subTasks,
                {
                  id: Date.now().toString(),
                  name: subTaskName,
                  completed: false,
                },
              ],
            }
          : habit
      )
    );
  };

  const toggleSubTask = (habitId, subTaskId) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              subTasks: habit.subTasks.map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
            }
          : habit
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestor de Hábitos</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Nuevo hábito"
          className="border p-2 mr-2 flex-grow"
        />
        <button
          onClick={addHabit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Hábito
        </button>
      </div>
      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{habit.name}</h2>
            <div className="flex space-x-2 mb-2">
              {["D", "L", "M", "X", "J", "V", "S"].map((day, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={habit.days[index]}
                    onChange={() => toggleDay(habit.id, index)}
                    className="mr-1"
                  />
                  {day}
                </label>
              ))}
            </div>
            <div className="mb-2">
              <h3 className="font-medium">Sub-tareas:</h3>
              {habit.subTasks.map((subTask) => (
                <div key={subTask.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subTask.completed}
                    onChange={() => toggleSubTask(habit.id, subTask.id)}
                    className="mr-2"
                  />
                  <span>{subTask.name}</span>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Nueva sub-tarea"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addSubTask(habit.id, e.target.value);
                    e.target.value = "";
                  }
                }}
                className="border p-2 mr-2 flex-grow"
              />
              <button
                onClick={() => deleteHabit(habit.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar Hábito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <HabitTracker />
  </React.StrictMode>,
  document.getElementById("root")
);
