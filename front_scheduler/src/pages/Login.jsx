import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/token/',
                formData
            )
            const access_token = response.data.access
            const refresh_token = response.data.refresh
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            localStorage.setItem('isLogged', true)
            navigate('/')
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }
    return (
        <>
            <form className="form-container" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <input placeholder="username" type="text" name="username" value={formData.username} onChange={handleChange} /> <br />

                <input placeholder="password" type="password" name="password" value={formData.password} onChange={handleChange} /> <br />
                <button className='button-login' type="submit">Login</button>
                <button className='button-login' onClick={() => navigate('/register')}>Register</button>
            </form>
        </>
    )
}
export default Login