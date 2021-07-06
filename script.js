const vaxSlots = document.querySelector(".vax-slots");
const pinInput = document.getElementById("pin-input");
const goBtn = document.querySelector(".go-btn");
const districtName = document.getElementById("district-name");
let pincode = "";

function getLocation(ip = "") {
  fetch(`http://ip-api.com/json/${ip}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      districtName.innerText = data.city;
      zipChanged(data.zip);
    });
}

function zipChanged(zip, date) {
  pincode = zip;
  fetch(`https://api.postalpincode.in/pincode/${zip}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (!data[0].PostOffice) {
        districtName.innerText = "No city found.";
        return false;
      }
      const city = data[0].PostOffice[0].District;
      districtName.innerText = city;
      setWeather(city);
    });
  pinInput.placeholder = zip;
  vaxSlots.innerHTML = "";
  getSlots(pincode, date);
}

function getSlots(zip, date = formatDate(new Date(), "special")) {
  fetch(
    `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${zip}&date=${date}`
  )
    .then(function (response) {
      return response.json();
    })
    .catch(() => {
      console.log("There is an error");
    })
    .then(({ sessions }) => {
      if (sessions.length === 0) {
        // document.getElementById("district-name").innerHTML =
        //   "Please try another pincode";
        vaxSlots.innerHTML =
          "<span class='no-vax'>No vaccination points nearby, try changing pincode.</span>";
      }
      for (const session of sessions) {
        vaxSlots.innerHTML += Slot(session);
      }
    });
}

goBtn.addEventListener("click", (e) => {
  const zip = pinInput.value;

  pinInput.value = "";

  if (!/^\d+$/.test(zip) || zip.length !== 6) {
    alert("Invalid zip input");
    return false;
  }

  zipChanged(zip);
});

pinInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") goBtn.click();
});

function Slot(session) {
  const fullAddress =
    session.district_name === session.state_name
      ? `${session.name}, ${session.state_name}, ${session.pincode}`
      : `${session.name}, ${session.district_name}, ${session.state_name}, ${session.pincode}`;

  let ageGroup = "";

  if (session.allow_all_age) ageGroup = "18 and above";
  else if (session.min_age_limit === 18 && session.max_age_limit === 44)
    ageGroup = "18-44 only";
  else if (session.min_age_limit === 45) ageGroup = "45 and above";

  return `
    <div class="slot">
  <div class="address">
    <span class="vill" id="address-vill">${session.block_name}</span>
    <span class="full-address" id="full-address"
      >${fullAddress}</span
    >
  </div>
    <div class="dose-avail">
    <span class="age-grp">${ageGroup}</span>

    <div class="doses">
      <div class="dose-1">
        <span>Dose 1</span>
        <span class="d1-count" id="d1-count">${session.available_capacity_dose1}</span>
      </div>
      <div class="dose-2">
        <span>Dose 2</span>
        <span class="d2-count" id="d2-count">${session.available_capacity_dose2}</span>
      </div>
    </div>
    <span class="vax-type">${session.vaccine}</span>
  </div>
  <a class="register-btn" href="https://selfregistration.cowin.gov.in/">Register</a>
    `;
}

function formatDate(date, order = "normal") {
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  if (order === "normal") return `${da} ${mo}, ${ye}`;
  if (order === "special") {
    mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
    return `${da}-${mo}-${ye}`;
  }
  if (order === "mindate-value") return;
}

function showDate() {
  let d = new Date();
  const formattedDate = formatDate(d);

  document.getElementById("today-date").innerText = formattedDate;
  document.getElementById("date-change-btn").valueAsDate = new Date();

  vaxDate = formatDate(new Date());

  document.getElementById("vax-day").innerText = `on ${vaxDate}`;
}

document.getElementById("date-change-btn").addEventListener("change", (e) => {
  const date = new Date(e.target.value);
  zipChanged(pincode, formatDate(date, "special"));

  let vaxDate = formatDate(new Date(date));
  document.getElementById("vax-day").innerText = `on ${vaxDate}`;
});

function setWeather(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid={YOU API KEY}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (!data.main) return false;
      const celcius = Math.floor(data.main.temp - 273.15);
      const condition = data.weather[0].main;
      document.getElementById("temp").innerText = `${celcius}°C`;
      document.getElementById("condition").innerText = condition;
      document.getElementById(
        "weather-img"
      ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    });
}

showDate();
getLocation();
