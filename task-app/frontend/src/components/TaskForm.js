import React, { useEffect, useState } from 'react';

export const TaskForm = ({ setTasks, selectedTask, setSelectedTask}) => {

    const defaultEntry = {
        nombre: '',
        descripcion: '',
        fecha: ''
    }
    const [entry, setEntry] = useState(selectedTask || defaultEntry);

    //   Escuchar por los cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const value = e.target;
        setEntry({
            ...entry,
            [value.name]: value.value
        });
    }

    useEffect(() => {
        setEntry(selectedTask || defaultEntry);
    }, [selectedTask]);

    //   Función que se ejecuta al enviar el formulario, subiendolo a la bd y reiniciando los valores del formulario
    const getEntry = (e) => {
        e.preventDefault();

        // Seleccion de metodo dependiendo de si se esta editando la tarea
        const url = selectedTask
            ? `http://127.0.0.1:5000/api/tasks/${selectedTask.uuid}`
            : 'http://127.0.0.1:5000/api/tasks';
        const method = selectedTask ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('Respuesta del servidor:', result);
                // Actualizar la lista de forma artificial sin cargar la bd
                setTasks(prevTasks => [...prevTasks.filter(task => task.uuid !== result.uuid), result]);
                setEntry(defaultEntry);
                setSelectedTask(null);
            })
            .catch((error) => {
                console.error('Error en la solicitud:', error);
            });


    };

    return (
        <div className='center form-container'>
            <form onSubmit={getEntry} className='task-form'>
                <div className='form-entry type-input'>
                    <label>Tarea:</label>
                    <input value={entry.nombre} required onChange={handleInputChange} name='nombre' type='text' placeholder='Tarea' />
                </div>

                <div className='form-entry type-textarea'>
                    <label>Descripcion:</label>
                    <textarea value={entry.descripcion} onChange={handleInputChange} name='descripcion'></textarea>
                </div>

                <div className='form-entry type-input'>
                    <label>Fecha:</label>
                    <input value={entry.fecha} onChange={handleInputChange} name='fecha' type='date' />
                </div>

                <div className='form-entry type-submit'>
                    <input type='submit' value='Actualizar' />
                </div>
            </form>
        </div>
    );
};
