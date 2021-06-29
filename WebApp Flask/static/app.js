$("#showTwitterbtn").click(()=>{
    $("#TwitterSentimentAnalysis").show()
    $("#TextAnalysis").hide()
    $("#About").hide()
})

$("#showTextbtn").click(()=>{
    $("#TwitterSentimentAnalysis").hide()
    $("#TextAnalysis").show()
    $("#About").hide()
})
$("#showAboutbtn").click(()=>{
    $("#TwitterSentimentAnalysis").hide()
    $("#TextAnalysis").hide()
    $("#About").show()
})

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json();
}

$("#textInput").change(()=>{

    let text = $("#textInput").val()
    
    postData("http://127.0.0.1:5000/textanalysis", text)
    .then(data => {
        node = ""
        for(let d of data){
            let c = ""

            if (parseFloat(d.sentiment) > 0.6) c = "positiveText"
            else if (parseFloat(d.sentiment) < 0.4) c = "negativeText"
            else c = "neutralText"
            
            node += `<span class="${c}">${d.text}</span>`
        }
        $("#textOutput").html( node )
    })


})


function getTweets(){

    // show Loader
    
    document.querySelector("#TwitterTweets").innerHTML =  `<div class="ui active dimmer"> <div class="ui text loader">Loading</div> </div>`

    let name = $("#twitterName").val()

    fetch(`http://127.0.0.1:5000/gettweets/${name}`)
    .then(res => res.json())
    .then(data =>{

        
        if (data.status == "NotFound"){
            document.querySelector("#TwitterTweets").innerHTML = `<h1>Enter a valid twitter handle</h1>`
            return
        }
        
        let userInfo = data.shift()

        let node = `<div class="chartDiv"><canvas id="myChart" width="400" height="400"></canvas></div>`
        let pos = 0
        let neg = 0
        let neu = 0

        node += userCard(userInfo)

        for (let d of data){
            if (parseFloat(d.sentiment) > 0.6){ // positive
                node += generateTweet(d.text, name, "green")
                pos++
            } else if (parseFloat(d.sentiment) < 0.4){ // negative
                node += generateTweet(d.text, name, "red")
                neg++
            } else{ // neutral
                node += generateTweet(d.text, name, "blue")
                neu++
            }
        }
        document.querySelector("#TwitterTweets").innerHTML = node
        showChart([neg, neu, pos])

    })
}

function showChart(data){
    const colors = [
        'rgba(255, 99, 80, 0.4)',
        'rgba(50, 100, 255, 0.4)',
        'rgba(75, 255, 192, 0.4)',
    ]
    let ctx = document.getElementById('myChart').getContext('2d');
    let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Negative', 'Neutral', 'Positive'],
        datasets: [{
            label: 'Number of tweets',
            data: data,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
    });
}

function userCard(data){
    return ` <div class="ui segment twitterCard">
        <div class="twitterImage">
            <img src="${data.profile_image_url}" alt="${data.name}">
        </div>
        <div class="twitterInfo">
            <p class="twitterName">${data.name}</p>
            <p class="twitterUsername">@${data.username}</p>
            
            <b>${data.description}</b>
        </div>
    </div>
    `
}

function generateTweet(text, name, sentiment){
    return `
    <div class="ui ${sentiment} message">
        <div class="header">
            ${name}
        </div>
        <p class="blacktext">${text}</p>
    </div>`    
}

function changeToActive(id){
    $(id).addClass('active').siblings().removeClass('active');
}
