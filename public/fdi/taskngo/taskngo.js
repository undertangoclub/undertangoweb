import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Trash2,
  Archive,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingSubTask, setEditingSubTask] = useState(null);
  const [expandedArchivedTasks, setExpandedArchivedTasks] = useState({});

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedArchivedTasks = localStorage.getItem("archivedTasks");
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedArchivedTasks) setArchivedTasks(JSON.parse(storedArchivedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("archivedTasks", JSON.stringify(archivedTasks));
  }, [tasks, archivedTasks]);

  const addTask = () => {
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now().toString(),
        name: newTaskName,
        subTasks: [],
        archivedSubTasks: [],
      };
      setTasks([newTask, ...tasks]);
      setNewTaskName("");
    }
  };

  const archiveTask = (id) => {
    const taskToArchive = tasks.find((task) => task.id === id);
    if (taskToArchive) {
      setArchivedTasks([
        ...archivedTasks,
        {
          ...taskToArchive,
          archivedSubTasks: taskToArchive.archivedSubTasks || [],
        },
      ]);
      setTasks(tasks.filter((task) => task.id !== id));
      setOpenMenuId(null);
    }
  };

  const restoreTask = (id) => {
    const taskToRestore = archivedTasks.find((task) => task.id === id);
    if (taskToRestore) {
      setTasks([
        ...tasks,
        {
          ...taskToRestore,
          archivedSubTasks: taskToRestore.archivedSubTasks || [],
        },
      ]);
      setArchivedTasks(archivedTasks.filter((task) => task.id !== id));
    }
  };

  const deleteArchivedTask = (id) => {
    setArchivedTasks(archivedTasks.filter((task) => task.id !== id));
  };

  const addSubTask = (taskId, subTaskName) => {
    if (subTaskName.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subTasks: [
                  ...(task.subTasks || []),
                  {
                    id: Date.now().toString(),
                    name: subTaskName.trim(),
                    completed: false,
                  },
                ],
              }
            : task
        )
      );
    }
  };

  const editSubTask = (taskId, subTaskId, newName) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: (task.subTasks || []).map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, name: newName.trim() }
                  : subTask
              ),
            }
          : task
      )
    );
    setEditingSubTask(null);
  };

  const toggleSubTask = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: (task.subTasks || []).map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
            }
          : task
      )
    );
  };

  const archiveSubTask = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: (task.subTasks || []).filter(
                (subTask) => subTask.id !== subTaskId
              ),
              archivedSubTasks: [
                ...(task.archivedSubTasks || []),
                (task.subTasks || []).find(
                  (subTask) => subTask.id === subTaskId
                ),
              ].filter(Boolean),
            }
          : task
      )
    );
  };

  const restoreSubTask = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              archivedSubTasks: (task.archivedSubTasks || []).filter(
                (subTask) => subTask.id !== subTaskId
              ),
              subTasks: [
                ...(task.subTasks || []),
                (task.archivedSubTasks || []).find(
                  (subTask) => subTask.id === subTaskId
                ),
              ].filter(Boolean),
            }
          : task
      )
    );
  };

  const deleteArchivedSubTask = (taskId, subTaskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              archivedSubTasks: (task.archivedSubTasks || []).filter(
                (subTask) => subTask.id !== subTaskId
              ),
            }
          : task
      )
    );
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const toggleExpandArchivedTask = (taskId) => {
    setExpandedArchivedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);

    setTasks(newTasks);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestor de Tareas</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Nueva tarea"
          className="border p-2 mr-2 flex-grow"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Tarea
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="border p-4 rounded"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div
                            {...provided.dragHandleProps}
                            className="mr-2 cursor-move"
                          >
                            ☰
                          </div>
                          <h2 className="text-xl font-semibold">{task.name}</h2>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => toggleMenu(task.id)}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center focus:outline-none hover:bg-gray-300"
                            aria-label="Opciones de tarea"
                          >
                            ⋮
                          </button>
                          {openMenuId === task.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                              <button
                                onClick={() => archiveTask(task.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Archivar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mb-2">
                        <h3 className="font-medium">Sub-tareas:</h3>
                        {(task.subTasks || []).map((subTask) => (
                          <div key={subTask.id} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={subTask.completed}
                              onChange={() =>
                                toggleSubTask(task.id, subTask.id)
                              }
                              className="mr-2"
                            />
                            {editingSubTask === subTask.id ? (
                              <input
                                type="text"
                                value={subTask.name}
                                onChange={(e) =>
                                  editSubTask(
                                    task.id,
                                    subTask.id,
                                    e.target.value
                                  )
                                }
                                onBlur={() => setEditingSubTask(null)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    setEditingSubTask(null);
                                  }
                                }}
                                className="border p-1"
                                autoFocus
                              />
                            ) : (
                              <span
                                onClick={() => setEditingSubTask(subTask.id)}
                                className="cursor-pointer"
                              >
                                {subTask.name}
                              </span>
                            )}
                            <button
                              onClick={() =>
                                archiveSubTask(task.id, subTask.id)
                              }
                              className="ml-2 text-yellow-500 hover:text-yellow-700"
                              aria-label="Archivar sub-tarea"
                            >
                              <Archive size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {(task.archivedSubTasks || []).length > 0 && (
                        <div className="mb-2">
                          <button
                            onClick={() => toggleExpandArchivedTask(task.id)}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                          >
                            {expandedArchivedTasks[task.id] ? (
                              <ChevronUp size={16} className="mr-1" />
                            ) : (
                              <ChevronDown size={16} className="mr-1" />
                            )}
                            Sub-tareas archivadas (
                            {(task.archivedSubTasks || []).length})
                          </button>
                          {expandedArchivedTasks[task.id] && (
                            <div className="mt-2 pl-4 border-l-2 border-gray-200">
                              {(task.archivedSubTasks || []).map((subTask) => (
                                <div
                                  key={subTask.id}
                                  className="flex items-center mb-1"
                                >
                                  <span className="text-gray-500">
                                    {subTask.name}
                                  </span>
                                  <button
                                    onClick={() =>
                                      restoreSubTask(task.id, subTask.id)
                                    }
                                    className="ml-2 text-green-500 hover:text-green-700"
                                    aria-label="Restaurar sub-tarea"
                                  >
                                    <RefreshCw size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteArchivedSubTask(task.id, subTask.id)
                                    }
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    aria-label="Eliminar sub-tarea permanentemente"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Nueva sub-tarea"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addSubTask(task.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="border p-2 mr-2 flex-grow"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mt-8">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
        >
          {showArchived
            ? "Ocultar Tareas Archivadas"
            : "Mostrar Tareas Archivadas"}
        </button>
        {showArchived && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Tareas Archivadas</h2>
            {archivedTasks.map((task) => (
              <div key={task.id} className="border p-4 rounded bg-gray-100">
                <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
                <div className="flex">
                  <button
                    onClick={() => restoreTask(task.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={() => deleteArchivedTask(task.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Eliminar Permanentemente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
