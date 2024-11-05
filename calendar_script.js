let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const currentdate = document.querySelector(".month-year");

const icons = document.querySelectorAll(".move-months-years");

const submit = document.querySelector(".form-container");

const form = document.querySelector(".form-container");

const stored_array = localStorage.getItem("events");

let c_day, c_year, c_month;

//stores all events in an array with Event objects
let events = [];

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

if(stored_array){
    events = JSON.parse(stored_array);
}

//get the booked thing working(Done yay)
//get data input (Done YAY)
//work on repainting page
function Event(date, time, task) {
    this.date = date;
    this.time = time;
    this.task = task;
}

function pop_up(day, m, y) {
    const overlay = document.getElementById('popupOverlay');
    const dmy = document.getElementById('titleOfPopup');

    dmy.textContent = `Add tasks on ${day}-${months[m - 1]}-${y}`
    c_day = day;
    c_month = m;
    c_year = y;
    overlay.classList.toggle('show');
}

function is_booked(day) {
    return events.some(event => event.date === day);
}

function print_calendar_body() {
    const table_body = document.getElementById("calendarBody");
    //Clean up everything from last time
    table_body.innerHTML = '';
    //Creates Date objects for the first day and total days in a month
    const firstDate = new Date(year, month, 1);
    const firstDay = firstDate.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const previousMonthTotalDays = new Date(year, month, 0).getDate();

    let dayCounter = 1;
    let isToday = false;

    //Weeks
    for (let i = 0; i < 6; i++) {
        const tr = table_body.insertRow();
        //Days of the week
        for (let j = 0; j < 7; j++) {
            const td = tr.insertCell();
            let full_date;
            //If this is the first week, fill in the days of previous month
            if (i === 0 && j < firstDay) {

                td.setAttribute("class", "nonCurrentDays");
                if (month < 1) {
                    full_date = `${previousMonthTotalDays - (firstDay - j - 1)}-${12}-${year - 1}`;
                    td.setAttribute("id", full_date);
                    if(is_booked(full_date)){
                        td.classList.add("booked");
                    }
                } else {
                    full_date = `${previousMonthTotalDays - (firstDay - j - 1)}-${month}-${year}`;
                    td.setAttribute("id", full_date);
                    if(is_booked(full_date)){
                        td.classList.add("booked");
                    }
                }

                td.textContent = previousMonthTotalDays - (firstDay - j - 1);

                //console.log((previousMonthTotalDays - (firstDay - j - 1)), date.getDate(), month, new Date().getMonth(), year, new Date().getFullYear());
                if (!isToday && (previousMonthTotalDays - (firstDay - j - 1)) === date.getDate() && month - 1  === new Date().getMonth() && year === new Date().getFullYear()) {
                    td.setAttribute("class", "nonCurrentDays today");
                    isToday = true;
                }

                td.addEventListener('click', function () {
                    const day = td.textContent;
                    if (month < 1) {
                        pop_up(day, 12, year - 1);
                    } else {
                        pop_up(day, month, year);
                    }
                });

                //Fill in the days of the current month
            } else if (dayCounter <= totalDays) {
                full_date = `${dayCounter}-${month + 1}-${year}`;
                td.setAttribute("class", "currentDays");
                td.setAttribute("id", `${dayCounter}-${month + 1}-${year}`);
                if(is_booked(full_date)){
                    td.classList.add("booked");
                }
                td.textContent = dayCounter;
                if (!isToday && dayCounter === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    td.setAttribute("class", "currentDays today");
                    isToday = true;
                }

                td.addEventListener('click', function () {
                    const day = td.textContent;
                    pop_up(day, month + 1, year);
                });
                dayCounter++;

                //Fill in the days of next month
            } else {

                td.setAttribute("class", "nonCurrentDays");
                if (month + 2 > 12) {
                    full_date = `${dayCounter - totalDays}-${1}-${year + 1}`
                    td.setAttribute("id", full_date);
                    if(is_booked(full_date)){
                        td.classList.add("booked");
                    }
                } else {
                    full_date = `${dayCounter - totalDays}-${month + 2}-${year}`
                    td.setAttribute("id", full_date);
                    if(is_booked(full_date)){
                        td.classList.add("booked");
                    }
                }

                td.textContent = dayCounter - totalDays;

                if (!isToday && (dayCounter - totalDays) === date.getDate() && month + 1 === new Date().getMonth() && year === new Date().getFullYear()) {
                    td.setAttribute("class", "nonCurrentDays today");
                    isToday = true;
                }

                td.addEventListener('click', function () {
                    const day = td.textContent;
                    if (month + 2 > 12) {
                        pop_up(day, 1, year + 1);
                    } else {
                        pop_up(day, month + 2, year);
                    }
                });

                dayCounter++;
            }
        }
    }
    //rerunning animations is a pain, need to remove the animation link from CSS and plug it back in while a repaint happens
    currentdate.classList.remove("fadeIn");
    currentdate.offsetHeight;
    currentdate.textContent = `${months[month]} ${year}`;
    currentdate.classList.add("fadeIn");
}

print_calendar_body();

submit.addEventListener('submit', function (event) {
    event.preventDefault();
    const tdIDs = document.querySelectorAll("#calendarBody td");
    const task = form.elements["task"].value;
    const time = form.elements["time"].value;
    for (let i = 0; i < tdIDs.length; i++) {
        if (`${c_day}-${c_month}-${c_year}` === tdIDs[i].id) {
            tdIDs[i].classList.add("booked");

            test_event = new Event(`${c_day}-${c_month}-${c_year}`, time, task);
            if (!events.some(event => event.date === test_event.date && event.time === test_event.time && event.task === test_event.task)) {
                //console.log(events);
                events.push(test_event);
            } else {
                alert("You have already added this event.");
            }
            localStorage.setItem("events",JSON.stringify(events));
            form.reset();
        }
    }
    pop_up();
});

for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    icon.addEventListener("click", function () {
        if (icon.id === "calendar-prev") {
            month--;
        } else {
            month++;
        }
        if (month < 0 || month > 11) {
            //Get new date for a new year
            date = new Date(year, month, 1);
            year = date.getFullYear();
            month = date.getMonth();
        }
        else {
            date = new Date();
        }
        print_calendar_body();
    })
}