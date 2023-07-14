
let inputArea = document.getElementById("inputArea");
const operation = document.getElementById("category-list");
const searchBtn = document.getElementById("searchBtn");
const savedSol = document.getElementById("savedSol");
const main = document.querySelector(".main");
const solContainer = document.querySelector(".solContainer");
const problemBtn = document.getElementById("problemBtn");
const cardContainer = document.createElement("div");

savedSol.onclick = savedSolution;
function savedSolution() {
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
    storaaa.forEach((e) => {
      const cardHtml = `
        <div class="card">
          <p class="para p2">${e.operation}</p>
          <p class="para p2">${e.result}</p>
        </div>
      `;
      cardContainer.innerHTML += cardHtml;
    });

    solContainer.appendChild(cardContainer);
  }
}

/* <p class="para p1">${edata.expression}</p> */

problemBtn.addEventListener("click", () => {
  solContainer.classList.add("hidden");
  main.classList.remove("hidden");
});

inputArea.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.key === "Enter") {
    encodeInput();
  }
});

searchBtn.onclick = encodeInput;

function encodeInput() {
  if (inputArea.value == "") {
    console.log("empty string");
    // return;
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
  const main = document.querySelector(".main");
  main.innerHTML += htmlCOntent;

  savedSol.onclick = savedSolution;

  saveData(data);
  // inputArea.innerText += data.expression;
  // console.log(inputArea);
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
