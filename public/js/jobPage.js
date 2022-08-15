const postBidForm = document.getElementById('bidForm')
const cancelBtn = document.getElementById('cancel')

async function cancelAuction(id) {
    const text = "Are you sure you want to delete this auction?"
    if (confirm(text) === true) {
        await fetch('/job/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        })
    }
}


postBidForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    let job_id
    let bid

    const auction_type = document.querySelector('#auction_type').value
    if(auction_type === "1") {
        job_id = document.querySelector('#jobId').value
        bid = document.querySelector('#bid').value
    }
    else if (auction_type === "2"){
        bid = null
        job_id = document.querySelector('#jobId').value
    }
    else if (auction_type === "3"){
        job_id = document.querySelector('#jobId').value
        bid = document.querySelector('#bid').value
    }

    const placeBid = await fetch('/job/addBid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            job_id,
            bid
        })
    })

    const data = await placeBid.json()
    if(data.error)
    {
        console.log(data.error)
    }
    else{
        if(auction_type === "1") {
            postBidForm.innerHTML = "<input type=\"hidden\" id=\"auction_type\" value={{job.auction_type}}><h4>You are the current highest bidder</h4>"
            document.querySelector('#currentBid').innerHTML = data.currentBid + "£"
        }
        else if (auction_type === "2"){
            document.location.reload()
        }
        else if (auction_type === "3"){
            postBidForm.innerHTML = "<input type=\"hidden\" id=\"auction_type\" value={{job.auction_type}}><h4>You have successfully placed a bid of " + bid + "£</h4>"
        }
    }
})



// Set the date we're counting down to

fetch('/jobs/timestamp_closed/' + window.location.pathname.slice(6)).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            return "error"
        } else {
            // Update the countdown every 1 second
            const x = setInterval(function () {

                // Get today's date and time
                const now = new Date().getTime();


                // Find the distance between now and the count down date
                const distance = Date.parse(data.timestamp.timestamp_closed) - now;

                // Time calculations for days, hours, minutes and seconds
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the element with id="demo"
                document.getElementById("timer").innerHTML = days + "d " + hours + "h "
                    + minutes + "m " + seconds + "s ";

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(x);
                    document.getElementById("timer").innerHTML = "EXPIRED";
                }
            }, 1000);
        }
    })
})

