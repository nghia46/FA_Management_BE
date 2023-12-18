//Change tab
let tabs = document.querySelectorAll(".tab");
tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        document.getElementsByClassName("syllabus-detail")[0].classList.remove("col-9");
        document.getElementsByClassName("time-allocation")[0].classList.add("d-none");
        tabs.forEach(tab => tab.classList.remove("active"));
        tab.classList.toggle("active");
        let contents = document.querySelectorAll(".content");
        contents.forEach(content => {
            content.classList.add("d-none");
        })
        contents[index].classList.remove("d-none");
    })
})

$(document).ready(() => {
    var anchor = window.location.hash.substring(1);
    if(anchor == "general"){
        document.getElementsByClassName("tab")[0].click()
    }
    else if(anchor == "outline"){
        document.getElementsByClassName("tab")[1].click()
    } 
    else if(anchor == "others"){
        document.getElementsByClassName("tab")[2].click()
    }
    else{
        document.getElementsByClassName("tab")[0].click()
    }
})

//Collapse script
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function (e) {
        var content = document.getElementById(this.getAttribute("data-target"));
        //Get parent to update height if have one
        var parent = document.getElementById(this.getAttribute("data-parent"))

        if (content.style.height) {
            if (parent) parent.style.height = parent.scrollHeight - content.scrollHeight + "px";
            content.style.height = null;
        } else {
            content.style.height = content.scrollHeight + "px";
            //update parent height
            if (parent) parent.style.height = parent.scrollHeight + content.scrollHeight + "px";
        }
        e.stopPropagation();
    });
}

//Add chart when choose tab 2
const secondTab = document.getElementById("syllabus-tab-2");
secondTab.addEventListener("click", () => {
    const content = document.getElementsByClassName("syllabus-detail")[0];
    content.classList.add("col-9");
    const timeAllo = document.getElementsByClassName("time-allocation")[0];
    timeAllo.classList.remove("d-none");
})

//Create chart
const chartName = document.querySelectorAll(".chart-name");
const chartPercent = document.querySelectorAll(".chart-percent")
const data = [];
for (let i = 0; i < chartName.length; i++) {
    data.push({ label: chartName[i].textContent, data: chartPercent[i].textContent });
}
console.log(data.map(r => r.label));

new Chart(
    document.getElementById('chart'),
    {
        type: 'pie',
        data: {
            labels: data.map(row => row.label),
            datasets: [
                {
                    data: data.map(row => row.data),
                    backgroundColor: [
                        'rgb(244, 190, 55)',
                        'rgb(255, 159, 64)',
                        'rgb(13, 37, 53)',
                        'rgb(83, 136, 216)',
                        'rgb(32, 110, 229)'
                    ],
                }
            ],
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: false // Hide legend
            },
            scales: {
                y: {
                    display: false // Hide Y axis labels
                },
                x: {
                    display: false // Hide X axis labels
                }
            }
        }
    }
);
