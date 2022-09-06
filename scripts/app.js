const cityForm = document.querySelector("form");
const details = document.querySelector(".details");
const card = document.querySelector(".card");
const time = document.querySelector("img.time");
const icon = document.querySelector(".icon img");
const body = document.querySelector("body");
const title = document.querySelector(".container h1");
const label = document.querySelector("label");
const ul = document.querySelector("ul");
const button = document.querySelector("button");
const search = document.querySelector("input");
const rain = document.querySelector(".rain");
const night = document.querySelector(".night");
const forecast = new Forecast();


const updateUI = (data) => {
  // destructure properties
  const { cityDets, weather } = data;

  const rainyCodeNight = [12, 15, 18, 29, 39, 40, 41, 42];
  const rainyCodeDay  =  [12, 13, 14, 15, 16, 17, 18, 29];

  const clearCodeNight = [11, 33, 34];

  function decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  if (button.innerHTML == decodeHTMLEntities("&deg;F")) {
    details.innerHTML = `
    <h5 class="my-3">${cityDets.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather.Temperature.Imperial.Value}</span> 
      <span>&deg;F</span>
    </div>
  `;
  } else {
    details.innerHTML = `
    <h5 class="my-3">${cityDets.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather.Temperature.Metric.Value}</span>
      <span>&deg;C</span>
    </div>
  `;
  }

  // update the day/night & icon images
  const iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
  icon.setAttribute("src", iconSrc);

  const timeSrc = weather.IsDayTime ? "img/day.svg" : "img/night.svg";
  time.setAttribute("src", timeSrc);

  // update body colors and animations
  const bodyColor = weather.IsDayTime ? "#E8F9FD" : "#222831";
  body.style.backgroundColor = bodyColor;

  if (
    // if day
    bodyColor == "#E8F9FD" &&
    title.classList.contains("text-muted")
  ) {
    title.classList.remove("text-muted");
    title.classList.add("text-black-50");
    label.classList.add("text-muted");
    body.style.animation = "bgColor_1 3s ease 0s 1 normal forwards";
  } else if (
    // if night
    bodyColor == "#222831" &&
    title.classList.contains("text-muted")
  ) {
    title.classList.remove("text-muted");
    title.classList.add("text-light");
    label.classList.add("text-light");
    body.style.animation = "bgColor_2 3s ease 0s 1 normal forwards";
  } else if (
    // if day
    bodyColor == "#E8F9FD" &&
    title.classList.contains("text-light")
  ) {
    title.classList.remove("text-light");
    title.classList.add("text-black-50");
    label.classList.remove("text-light");
    label.classList.add("text-muted");
    body.style.animation = "bgColor_Light_Dark 3s ease 0s 1 reverse forwards";
  } else if (
    // if night
    bodyColor == "#222831" &&
    title.classList.contains("text-black-50")
  ) {
    title.classList.remove("text-black-50");
    title.classList.add("text-light");
    label.classList.remove("text-muted");
    label.classList.add("text-light");
    body.style.animation = "bgColor_Light_Dark 3s ease 0s 1 normal forwards";
  }

  if (!weather.IsDayTime && rainyCodeNight.includes(weather.WeatherIcon)) {
    rain.classList.remove("d-none");
  } else if (weather.IsDayTime && rainyCodeDay.includes(weather.WeatherIcon)) {
    rain.classList.remove("d-none");
  } else if (!rain.classList.contains("d-none")) {
    rain.classList.add("d-none");
  }


  if (!weather.IsDayTime && clearCodeNight.includes(weather.WeatherIcon)) {
    night.classList.remove("d-none");
  } else if (!night.classList.contains("d-none")) {
    night.classList.add("d-none");
  }

  // remove the d-none class if present
  if (card.classList.contains("d-none")) {
    card.classList.remove("d-none");
  }
};

cityForm.addEventListener("submit", (e) => {
  // prevent default action
  e.preventDefault();

  // get city value
  const city = cityForm.city.value.trim();
  cityForm.reset();

  // update the ui with new city
  forecast.updateCity(city)
    .then((data) => {
      updateUI(data);
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  // set local storage
  localStorage.setItem("city", city);
});

ul.addEventListener("click", (e) => {
  button.innerHTML = e.target.getAttribute("value");
});

if (localStorage.getItem("city")) {
  forecast.updateCity(localStorage.getItem("city"))
    .then((data) => {
      updateUI(data);
    })
    .catch((err) => {
      console.log(err);
    });
}
