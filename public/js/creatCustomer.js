const loginForm = document.getElementById('login')
const registerForm = document.getElementById('register')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const emailValue = document.querySelector('#login_email').value
    const passwordValue = document.querySelector('#login_password').value

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue
        })
    }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                document.querySelector('#message-1').textContent = data.error
            } else {
                window.location.href = "/"
            }
        })
    })
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const emailValue = document.querySelector('#register_email').value
    const passwordValue = document.querySelector('#register_password').value
    const first_name = document.querySelector('#register_first_name').value
    const last_name = document.querySelector('#register_last_name').value

    fetch('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailValue,
            password: passwordValue,
            first_name: first_name,
            last_name: last_name
        })
    }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                document.querySelector('#message-1').textContent = data.error
            } else {
                window.location.href = "/"
            }
        })
    })
})
