const loginForm = document.getElementById('login')

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const emailValue = document.querySelector('#email').value
    const passwordValue = document.querySelector('#password').value

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
