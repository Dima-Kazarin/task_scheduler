import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import apiRequest from "../jwtAxios"

const get_users = async () => {
    const response = await apiRequest('http://127.0.0.1:8000/account/', 'GET')
    const data = response.data
    return data
}

const TaskCreate = () => {
    const [performers, setPerformers] = useState([])
    const navigate = useNavigate()

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

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        time_end: '',
        performer: '',
        status: 1
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!formData.name || !formData.description || !formData.time_end || !formData.performer || !formData.status) {
            alert("Please fill in all fields");
            return;
        }

        try {
            await apiRequest('http://127.0.0.1:8000/task/', 'POST', formData)
            setFormData({
                name: '',
                description: '',
                time_end: '',
                performer: '',
                status: 1
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
            <div>
                <h1 style={{ borderBottom: '0.5px solid' }}><a href='/'>Task Scheduler</a></h1>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
                <h1>Create new task</h1>

                <input placeholder="Task name" type="text" name="name" value={formData.name} onChange={handleChange} /> <br />

                <input placeholder="Description" type="text" name="description" value={formData.description} onChange={handleChange} /> <br />

                <input placeholder="Еime end" type="datetime-local" name="time_end" value={formData.time_end} onChange={handleChange} /> <br />

                <select name="performer" value={formData.performer} onChange={handleChange}>
                    <option value="">Select performer</option>
                    {performers.map((performer, index) => (
                        <option key={index} value={performer.id}>{performer.username}</option>
                    ))}
                </select>
                <button type="submit" id='button_create'>Create</button>
            </form>
        </>
    )
}
export default TaskCreate