// Parse the date from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const dateStr = urlParams.get("date");
const selectedDate = document.getElementById("selectedDate");
const timeSlots = document.getElementById("timeSlots");

let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

// Display the selected date
selectedDate.textContent = `Time Slots for ${dateStr}`;

// Function to render time slots
function renderTimeSlots() {
    timeSlots.innerHTML = "";

    for (let hour = 0; hour < 12; hour++) {
        const timeSlot = document.createElement("li");
        const time = `${hour === 0 ? 12 : hour} AM`;

        const dateTimeStr = `${dateStr} ${time}`;
        timeSlot.textContent = time;

        if (bookings[dateTimeStr]) {
            timeSlot.classList.add("booked");
            timeSlot.textContent += " - Booked";
        } else {
            timeSlot.classList.add("available");
            timeSlot.addEventListener("click", () => bookTimeSlot(dateTimeStr));
        }

        timeSlots.appendChild(timeSlot);
    }
}

// Function to handle booking a time slot
function bookTimeSlot(dateTimeStr) {
    const reason = prompt("Enter a reason for booking:");
    if (reason) {
        bookings[dateTimeStr] = reason;
        localStorage.setItem("bookings", JSON.stringify(bookings));
        renderTimeSlots(); // Re-render to update booked status
    }
}

// Initialize time slots
renderTimeSlots();
