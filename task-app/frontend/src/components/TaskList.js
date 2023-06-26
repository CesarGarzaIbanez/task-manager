import React, { useEffect, useState } from 'react'
import { FaTrash, FaPencil } from 'react-icons/fa6'
import { FaCheckSquare } from 'react-icons/fa'

export const TaskList = ({ setTasks, tasks, setSelectedTask }) => {

  const pendingTasks = tasks.filter(task => !task.completado);
  const completedTasks = tasks.filter(task => task.completado);

  // Obtener la lista de la base de datos
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.log(error));
  }, []);

  const handleDelete = (taskId) => {
    fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(result => {
        console.log('Tarea eliminada:', result);
        // Actualizar el estado de las tareas después de la eliminación
        setTasks(prevTasks => prevTasks.filter(task => task.uuid !== taskId));
      })
      .catch(error => {
        console.error('Error al eliminar la tarea:', error);
      });
  };

  const changeState = (task) => {
    task.completado = true;

    fetch(`http://127.0.0.1:5000/api/tasks/${task.uuid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Respuesta del servidor:', result);
        // Actualizar la lista de forma artificial sin cargar la bd
        setTasks(prevTasks => [...prevTasks.filter(task => task.uuid !== result.uuid), result]);
        setSelectedTask(null);
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });

    console.log(JSON.stringify(task));
    ;
  }

  return (
    <div className='list-container'>
      {pendingTasks.length != 0 && (
        <>
          <h2>Pendientes</h2>

          <ul>
            {pendingTasks.map(task => (
              <li key={task.uuid} className='list-item'>
                <div className='list-info'>
                  <h3>{task.nombre} </h3>
                  <p>{task.descripcion}</p>
                </div>

                <p className='due-date'>{task.fecha}</p>
                {/* Los que no tienen fecha requieren margen extra */}
                <div className={task.fecha !== '' ? ('list-side') : ('list-side margin-side')}>
                  <div className='list-buttons'>
                    <button onClick={() => { setSelectedTask(task) }}><FaPencil className='FaPencil' /></button>
                    <button onClick={() => handleDelete(task.uuid)}><FaTrash className='FaTrash' /></button>
                  </div>
                  <button onClick={() => changeState(task)} className={!task.completado ? 'FaCheckSquare' : 'FaCheckSquare red'}><FaCheckSquare /></button>

                </div>
              </li>
            ))}
          </ul>
        </>

      )}

      {completedTasks.length != 0 && (
        <>
          <h2>Completadas</h2>
          <ul>
            {completedTasks.map(task => (
              <li key={task.uuid} className='list-item'>
                <div className='list-info'>
                  <h3>{task.nombre} </h3>
                  <p>{task.descripcion}</p>
                </div>

                <p className='due-date'>{task.fecha}</p>
                {/* Los que no tienen fecha requieren margen extra */}
                <div className={task.fecha !== '' ? ('list-side') : ('list-side margin-side')}>
                  <div className='list-buttons'>
                    <button onClick={() => { setSelectedTask(task) }}><FaPencil className='FaPencil' /></button>
                    <button onClick={() => handleDelete(task.uuid)}><FaTrash className='FaTrash' /></button>
                  </div>
                  <button onClick={() => changeState(task)} className={!task.completado ? 'FaCheckSquare' : 'FaCheckSquare red'}><FaCheckSquare /></button>

                </div>
              </li>
            ))}
          </ul>
        </>
      )}

    </div>
  )
}
