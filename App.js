let inputArea = document.getElementById("inputArea");
const operation = document.getElementById("category-list");
const searchBtn = document.getElementById("searchBtn");
const savedSol = document.getElementById("savedSol");
const main = document.querySelector(".main");
const solContainer = document.querySelector(".solContainer");
const problemBtn = document.getElementById("problemBtn");
const cardContainer = document.createElement("div");
const form = document.getElementById("myForm");


problemBtn.addEventListener("click", () => {
  solContainer.classList.add("hidden");
  main.classList.remove("hidden");
});

inputArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    console.log(e);
    e.preventDefault();
    encodeInput();
  }
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault()
  encodeInput();
});

function encodeInput() {
  if (inputArea.value === "") {
    console.log("empty string");
  } else {
    let expression = encodeURIComponent(inputArea.value);
    console.log(expression);
    getData(expression, operation.value);
  }
}

async function getData(exp, op) {
  const resp = await fetch(`https://newton.vercel.app/api/v2/${op}/${exp}`);
  const data = await resp.json();
  console.log(data);
  const main = document.querySelector(".main");
  const htmlCOntent = `
    <div class="main-three">
      <div class="problem">
        <p><span>${op}</span> : ${data.expression}</p>
      </div>  
      <div class="solution">
        <p>${data.result}</p>
      </div>
      <div class="delete-btn">
        <button id="deleteBtn"><i class="fa-solid fa-trash-can fa-2xl" style="color: #080808;"></i></button>
      </div> 
  `;

  main.innerHTML += htmlCOntent;
  saveData(data);
  let deleteBtn = document.getElementById("deleteBtn");
  callDeleteLocal();
}

function saveData(data) {
  const localData = window.localStorage.getItem("localData");

  if (!localData) {
    console.log(data);
    let arr = [];
    arr.push(data);
    window.localStorage.setItem("localData", JSON.stringify(arr));
  } else {
    let array = JSON.parse(localStorage.getItem("localData"));
    array.push(data);
    localStorage.setItem("localData", JSON.stringify(array));
  }
}

function callDeleteLocal(){

  deleteBtn.addEventListener("click", function () {
    console.log("deleteLocal function is called");
    let array = JSON.parse(localStorage.getItem("localData"));
    array.splice(-1, 1);
    window.localStorage.setItem("localData", JSON.stringify(array));

  });
}

document.addEventListener("click", function (event) {
  if (event.target.matches("#savedSol")) {
    savedSolution();
  }
});

document.addEventListener("click", function (event) {
  if (event.target.matches("#deleteCard")) {
    cardDelete(event.target.getAttribute("value"));
  }
});

const deleteCard = document.getElementById("deleteCard");

function cardDelete(event) {
  console.log(event);
  let array = JSON.parse(localStorage.getItem("localData"));
  array.splice(event, 1);
  window.localStorage.setItem("localData", JSON.stringify(array));

  savedSolution();
}

function savedSolution() {
  console.log("button clicked");
  main.classList.add("hidden");
  solContainer.classList.remove("hidden");
  cardContainer.innerHTML = "";
  cardContainer.classList.add("card-container");

  const storaaa = JSON.parse(window.localStorage.getItem("localData"));
  console.log(storaaa);
  if (storaaa == null || storaaa == "undefined") {
    console.log("No Data To Render");
    return;
  } else {
    storaaa.forEach((e, idx) => {
      const cardHtml = `
        <div class="card">
          <button id="deleteCard" value=${idx}>X</button>
          <p class="para p1">${e.operation}</p>
          <textarea id="textArea" disabled>${e.expression}</textarea>
          <p class="para p2">${e.result}</p>
        </div>
      `;
      cardContainer.innerHTML += cardHtml;
    });

    solContainer.appendChild(cardContainer);
  }
}
