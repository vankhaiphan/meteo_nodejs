function searchCity(e) {
    e.preventDefault();
    const city = document.getElementById("city").value;
    const request = "http://127.0.0.1:3000/?city=" + city;
    console.log(request);
    fetch(request)
    .then((res) => res.text())
    .then((rendered) => {
        document.getElementById('info').innerHTML = rendered;
    })
};
