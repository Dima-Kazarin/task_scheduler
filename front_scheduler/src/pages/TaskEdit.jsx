import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import apiRequest from "../jwtAxios"

const get_users = async () => {
    const response = await apiRequest('http://127.0.0.1:8000/account/', 'GET')
    const data = response.data
    return data
}

const get_status = async () => {
    const response = await apiRequest('http://127.0.0.1:8000/task_status/', 'GET')
    const data = response.data
    return data
}

const get_task_by_id = async (task_id) => {
    const response = await apiRequest(`http://127.0.0.1:8000/task/?by_id=${task_id}`, 'GET')
    const data = response.data
    return data[0]
}

const TaskEdit = () => {
    const navigate = useNavigate()
    const { taskId } = useParams()
    const [task, setTask] = useState([])
    const [performers, setPerformers] = useState([])
    const [statuses, setstatuses] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        time_end: '',
        performer: '',
        status: ''
    })

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await get_users()
                setPerformers(data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await get_status()
                setstatuses(data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchStatus()
    }, [])

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await get_task_by_id(taskId)
                setTask(data)
                setFormData({
                    name: data.name,
                    description: data.description,
                    time_end: data.time_end,
                    performer: data.performer,
                    status: data.status
                })
            } catch (error) {
                console.error(error);
            }
        }
        fetchTask()
    }, [taskId])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!formData.name || !formData.description || !formData.time_end || !formData.performer || !formData.status) {
            alert("Please fill in all fields");
            return;
        }

        try {
            await apiRequest(`http://127.0.0.1:8000/task/${taskId}/`, 'PUT', formData)
            setFormData({
                name: '',
                description: '',
                time_end: '',
                performer: '',
                status: ''
            });
            navigate('/')
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        if (value) {
            setFormData({ ...formData, [name]: value })
        }
    }

    return (
        <>
            <>
                <div>
                    <h1 style={{ borderBottom: '0.5px solid' }}><a href='/'>Task Scheduler</a></h1>
                </div>
                <form onSubmit={handleSubmit} className="form-container">
                    <h1>Edit task with id - {taskId}</h1>

                    <input placeholder="Task name" type="text" name="name" value={formData.name} onChange={handleChange} /> <br />

                    <input placeholder="Description" type="text" name="description" value={formData.description} onChange={handleChange} /> <br />

                    <input placeholder="Time end" type="datetime-local" name="time_end" value={formData.time_end} onChange={handleChange} /> <br />

                    <select name="performer" value={formData.performer} onChange={handleChange}>
                        <option value="">Select performer</option>
                        {performers.map((performer, index) => (
                            <option key={index} value={performer.id}>{performer.username}</option>
                        ))}
                    </select>

                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="">Select status</option>
                        {statuses.map((status, index) => (
                            <option key={index} value={status.id}>{status.name}</option>
                        ))}
                    </select>
                    <button type="submit" id='button_edit'>Edit</button>
                </form>
            </>
        </>
    )
}
export default TaskEdit