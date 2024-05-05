import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiRequest from '../jwtAxios'



const get_tasks = async () => {
    const response = await apiRequest("http://127.0.0.1:8000/task/", 'GET')
    const data = response.data
    return data
}

const get_username_by_user_id = async (user_id) => {
    const response = await apiRequest(`http://127.0.0.1:8000/account/?user_id=${user_id}`, 'GET')
    const data = response.data
    return data[0]?.username
}

const Main = () => {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [performerNames, setPerformerNames] = useState({})
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_tasks()
                setTasks(data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchData()
    }, [refresh])


    useEffect(() => {
        const fetchPerformers = async () => {
            const names = {}
            for (const task of tasks) {
                if (!names[task.performer]) {
                    names[task.performer] = await get_username_by_user_id(task.performer);
                }
            }
            setPerformerNames(names)
        }
        fetchPerformers()
    }, [tasks])

    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleString();
    };

    const formatStatus = (status) => {
        let status_name = ""
        if (status === 1) {
            status_name = "pending"
        } else if (status === 2) {
            status_name = "in progress"
        } else if (status === 3) {
            status_name = "completed"
        }
        return status_name
    }

    const change_task_status = async (task_id) => {
        try {
            const response = await apiRequest(`http://127.0.0.1:8000/task/change_status/${task_id}/`, 'PUT');
            setRefresh(!refresh);
        } catch (error) {
            console.error("Error while changing task status:", error);
        }
    }
    
    

    const delete_task = async (task_id) => {
        await apiRequest(`http://127.0.0.1:8000/task/${task_id}/`, 'DELETE')
        setRefresh(!refresh)
    }
    const logout = () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.setItem("isLogged", false)
    }

    return (
        <>
            <div>
                <h1 style={{ borderBottom: '0.5px solid' }}><a href='/'>Task Scheduler 
                <button id='login'><a href="/login">Login</a></button></a></h1>
            </div>
            <div>
                <button><a href="/task">Add task</a></button>
                <button id='logout' onClick={logout}>Logout</button>
            </div>
            <div>
                {tasks.map((task, index) => (
                    <div id='task' key={index}>
                        <p>Task name: {task.name} </p>
                        <p>Task description: {task.description} </p>
                        <p>Time create: {formatTime(task.time_create)} </p>
                        <p>Time end: {formatTime(task.time_end)} </p>
                        <p>Performer: {performerNames[task.performer]} </p>
                        <p>Status: {formatStatus(task.status)}</p>
                        <button id='button_delete_task' onClick={() => delete_task(task.id)}>Delete</button>
                        <button id='button_change_status' onClick={() => change_task_status(task.id)}>{task.status === 2 ? 'Set complete' : "Set in progress"}</button>
                        <button id='button_edit_main' onClick={() => { navigate(`/task/${task.id}/`) }}>Edit</button>
                    </div>
                ))}
            </div>
        </>
    )
}
export default Main