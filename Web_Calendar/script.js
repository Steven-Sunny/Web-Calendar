let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

// Only run this code on index.html (main calendar page)
if (window.location.pathname.endsWith("index.html")) {
  const calendarBody = document.getElementById("calendarBody");
  const monthYear = document.getElementById("monthYear");
  const currentDate = new Date();
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  function updateMonthYearDisplay() {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    monthYear.textContent = `${monthNames[month]} ${year}`;
  }

  function renderCalendar() {
    calendarBody.innerHTML = "";
    updateMonthYearDisplay();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    let row = document.createElement("tr");

    // Fill in days from the previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const cell = document.createElement("td");
      const day = daysInPreviousMonth - i;
      cell.textContent = day;
      cell.classList.add("prev-next-month");

      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${prevMonth + 1}-${day}`;

      cell.addEventListener("click", () => {
        month = prevMonth;
        year = prevYear;
        renderCalendar();
        window.location.href = `booking.html?date=${dateStr}`;
      });
      row.appendChild(cell);
    }

    // Fill in days for the current month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const cell = document.createElement("td");
      cell.textContent = day;
      const dateStr = `${year}-${month + 1}-${day}`;

      if (bookings[dateStr]) {
        cell.classList.add("booked");
        cell.title = `${bookings[dateStr].reason} at ${bookings[dateStr].time}`;
      }

      cell.addEventListener("click", () => {
        window.location.href = `booking.html?date=${dateStr}`;
      });
      row.appendChild(cell);

      if (row.children.length === 7) {
        calendarBody.appendChild(row);
        row = document.createElement("tr");
      }
    }

    // Fill in days from the next month
    let nextDay = 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    while (row.children.length < 7) {
      const cell = document.createElement("td");
      cell.textContent = nextDay;
      cell.classList.add("prev-next-month");

      const dateStr = `${nextYear}-${nextMonth + 1}-${nextDay}`;
      cell.addEventListener("click", () => {
        month = nextMonth;
        year = nextYear;
        renderCalendar();
        window.location.href = `booking.html?date=${dateStr}`;
      });
      row.appendChild(cell);
      nextDay++;
    }

    calendarBody.appendChild(row);
  }

  document.getElementById("prevMonth").addEventListener("click", () => {
    month = (month - 1 + 12) % 12;
    if (month === 11) year--;
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    month = (month + 1) % 12;
    if (month === 0) year++;
    renderCalendar();
  });

  renderCalendar();
}

// Only run this code on booking.html
if (window.location.pathname.endsWith("booking.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const dateStr = urlParams.get("date");

  // Display the selected date at the top of the page
  if (dateStr) {
    document.getElementById("bookingDate").textContent = `Booking for: ${formatDate(dateStr)}`;
  }

  document.getElementById("bookingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const reason = document.getElementById("reason").value;
    const time = document.getElementById("timeSlot").value;

    bookings[dateStr] = { reason, time };
    localStorage.setItem("bookings", JSON.stringify(bookings));
    window.location.href = "index.html"; // Redirect back to the calendar
  });
}

// Utility function to format date as "Month Day, Year"
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
