import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/register/',
                formData
            )
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
                <h1>Register</h1>
                <input placeholder="username" type="text" name="username" value={formData.username} onChange={handleChange} /> <br />

                <input placeholder="email" type="text" name="email" value={formData.email} onChange={handleChange} /> <br />

                <input placeholder="password" type="password" name="password" value={formData.password} onChange={handleChange} /> <br />
                <button className="button-login" type="submit">Register</button>
            </form>
        </>
    )
}
export default Register