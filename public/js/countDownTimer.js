// Set the date we're counting down to

fetch('/jobs/timestamp_closed/' + window.location.pathname.slice(6)).then((response) => {
    response.json().then((data) => {
        if (data.error) {
            return "error"
        } else {
            // Update the count down every 1 second
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

