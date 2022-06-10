$(document).ready(function () {
    var state = {};
    const container = document.querySelector('.cardContainer');
    const currentContainer = document.querySelector('.current');
    var input = document.querySelector('.input');
    /*--------------------------------------------------------------------------------------------*/
    /*--------------------------------------AJAX1-------------------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/
    document.getElementById('form').onclick = async (e) => {
        e.preventDefault();
        //ajax body
        const url = '	https://weatherdbi.herokuapp.com/data/weather/Szeged';
        const option = {
            method: 'GET',
        };
        //request
        const responseSend = await fetch(url, option);
        const respons = await responseSend.json();
        state = respons
        //error handling
        if (!responseSend.ok) {
            alert(`${responseSend.status} miatt nem lehet betolteni a kert oldalt`)
            return
        } else {
            //state change
            document.getElementById('btn').classList.add('active')
            render(state);
            chart()
        }
    }
    /*--------------------------------------------------------------------------------------------*/
    /*--------------------------------------AJAX2-------------------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/
    document.getElementById('form2').onsubmit = async (e) => {
        e.preventDefault();
        var inputValue = e.target.elements.text.value
        const url = `	https://weatherdbi.herokuapp.com/data/weather/${encodeURI(inputValue)}`;
        
        const option = {
            method: 'GET',
        };
        
        const responseSend = await fetch(url, option);
        const respons = await responseSend.json();
        state = respons
        if (!responseSend.ok) {
            alert(`${responseSend.status} miatt nem lehet betolteni a kert oldalt`)
            return
        } else {
            render(state)
            chart();
            input.value = '';
        }
    }
    /*--------------------------------------------------------------------------------------------*/
    /*---------------------------------------INPUT------------------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/
    function search() {
        if (!input.value) {
            return 'Szeged'
        } else {
            return input.value;
        }
    }
    /*--------------------------------------------------------------------------------------------*/
    /*----------------------------------------CHART-----------------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/
    function chart() {
        var data = {
            labels: [],
            datasets: [{
                label: search().toUpperCase(),
                backgroundColor: 'rgba(235, 31, 58, 0.8)',
                borderColor: 'rgba(235, 31, 58, 0.8)',
                data: [],
            }]
        };
        var config = {
            type: 'bar',
            data: data,
            options: {}
        };


        state.next_days.forEach(item => {
            data.labels.push(item.day);
            data.datasets[0].data.push(item.max_temp.c);
        })

        if (typeof chart != "undefined") {
            chart.destroy();
        }
        $("#chartCtn").empty();
        $("#chartCtn").append('<canvas id="line-chart"></canvas>');
        var chart = new Chart(document.getElementById('line-chart'), config);
    }
    /*--------------------------------------------------------------------------------------------*/
    /*---------------------------------------RENDER-----------------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/
    function render(state) {
        //state
        let listHTML = '';
        let current = '';
        //Days
        state.next_days.forEach((element) => {

            listHTML += `   
                            <div class="Card m-1" style="width: 8rem;">
                                <img src="${element.iconURL}" class="Card-img-top">
                                <div class="Card-body">
                                    <h5 class="Card-title">${element.day}</h5>
                                    <p class="Card-text">${element.comment}</p>
                                    <p class="Card-text1">Max: ${element.max_temp.c}</p>
                                    <p class="Card-text2">Min: ${element.min_temp.c}</p>
                                </div>
                            </div>`
        });
        //state change
        container.innerHTML = listHTML;

        //Current
        current += `   
                    <div class="Card" style="width: 100%;">
                        <h3 class="p-3">${search().toUpperCase()}</h3>
                        <div class="d-flex flex-row justify-content-evenly">
                            <img src="${state.currentConditions.iconURL}" class="Card-img-top">
                            <h1 class="Card-title d-flex align-items-center m-0">${state.currentConditions.dayhour}</h5>
                            <p class="Card-text fs-2 d-flex align-items-center text-decoration-none m-0">${state.currentConditions.comment}</p>
                        </div>
                        <div class="Card-body p-3">
                            <div class="w-100">Humidity: 
                                <div class="progress-bar bg-info" role="progressbar" style="width: ${state.currentConditions.humidity}" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${state.currentConditions.humidity}</div>
                            </div>
                            <div class="w-100">Precip: 
                                <div class="progress-bar bg-info" role="progressbar" style="width: ${state.currentConditions.precip}" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${state.currentConditions.precip}</div>
                            </div>
                            <div class="w-100">Temp: 
                                <div class="progress-bar bg-info" role="progressbar" style="width: ${state.currentConditions.temp.c}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${state.currentConditions.temp.c}</div>
                            </div>
                            <div class="w-100">Wind: 
                                <div class="progress-bar bg-info" role="progressbar" style="width: ${state.currentConditions.wind.km}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${state.currentConditions.wind.km}</div>
                            </div>
                            
                        </div>
                    </div>`;
        
        currentContainer.innerHTML = current;
    }
})





