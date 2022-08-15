const jobCreateForm = document.getElementById('jobPost')

jobCreateForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const title = document.querySelector('#title').value
    const category_id = document.querySelector('#category_id').value
    const type = document.querySelector('#type').value
    const timestamp_closed = document.querySelector('#timestamp_closed').value.replace("T", " ").concat(":00")
    const wage = document.querySelector('#wage').value
    const description_short = document.querySelector('#description_short').value
    const description_long = document.querySelector('#description_long').value
    const [file] = document.querySelector("#fileUpload").files

    const formdata = new FormData();
    formdata.append("jobImage", document.querySelector("#fileUpload").files[0]);

    const filePost = await fetch('/job/image', {
        method: 'POST',
        enctype: "multipart/form-data",
        body: formdata
    })

    const fileNameJson = await filePost.json()

    const jobCreate = await fetch('/jobs/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            category_id,
            type,
            wage,
            description_short,
            description_long,
            timestamp_closed,
            image: fileNameJson.fileName
        })
    })

    const data = await jobCreate.json()
    console.log(data)
    if (data.error) {
        alert(data.error)
    } else {
        jobCreateForm.innerHTML = ""
        document.querySelector("h1").innerHTML = "Job Posting was created"
    }
})

const test = () => {
    const [file] = document.querySelector("#fileUpload").files
    if (file) {
        document.querySelector("#uploaded_image").src = URL.createObjectURL(file)
    }
}

