const container = document.querySelector(".container");
const res = document.querySelector(".status");
renderMarkup();

const button = document.querySelector("button");
const input = document.getElementById("fileInput");

button.addEventListener("click", onClick);
input.addEventListener("change", onChange);

let fileContent = ``;
const numberArray = [];

getArrayFromFile = (str = "") => {
  str
    .replace("\r", " ")
    .split("\n")
    .forEach((item) => {
      const number = parseInt(item);
      if (!isNaN(number)) {
        numberArray.push(number);
      }
    });
};

function getValues(arr) {
  if (!arr.length) {
    alert("оберіть файл з числами");
    return {};
  }
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  const sortedArr = [...arr].sort((a, b) => a - b);
  let mediana;
  const serArifm = Math.round(
    arr.reduce((acc, item) => (acc += item), 0) / arr.length
  );
  const idxOfMiddleOfArr = Math.floor(sortedArr.length / 2);
  if (sortedArr.length % 2) {
    mediana = sortedArr[idxOfMiddleOfArr];
  } else {
    mediana = Math.round(
      (sortedArr[idxOfMiddleOfArr] + sortedArr[idxOfMiddleOfArr - 1]) / 2
    );
  }

  const res = {
    max,
    min,
    mediana,
    serArifm,
    incSeq: getIncreasingSequence(numberArray, "UP").join(", "),
    decrSeq: getIncreasingSequence(numberArray, "DOWN").join(", "),
  };

  return res;
}

function renderMarkup({
  max,
  min,
  mediana,
  serArifm,
  incSeq,
  decrSeq,
  time,
} = {}) {
  const markup = `<h1> Завдання - знайти  у файлі чисел наступні чотири/шість значень:</h1>
      <p class="text">
        <ol class="list">
            <li class="item"><span>максимальне число в файлі </span><span class="result">${
              max ?? ""
            }</span></li>
            <li class="item"><span>мінімальне число в файлі</span> <span class="result">${
              min ?? ""
            }</span></li>
            <li class="item"><span>медіану </span><span class="result">${
              mediana ?? ""
            }</span></li>
            <li class="item"><span>середнє арифметичне значення</span> <span class="result">${
              serArifm ?? ""
            }</span></li>
            <li class="item"><span>найбільшу послідовність чисел, яка збільшується </span> <span class="result">${
              incSeq ?? ""
            }</span></li>
            <li class="item"><span>найбільшу
        послідовність чисел,яка зменьшується  </span><span class="result">${
          decrSeq ?? ""
        }</span></li>
        </ol>
             </p>
      <input type="file" id="fileInput"/>
      <button type="button" class="button">Визначити</button>`;
  container.innerHTML = markup;
  if (time) {
    container.innerHTML += `<p>Обробка зайняла <span class="result">${
      time ?? ""
    } секунд</span></p>`;
  }
}

function getIncreasingSequence(arr, direction = "UP") {
  let incrSequence = [];

  let maxLength = 0;
  let length = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    let currentSequence = [];
    currentSequence.push(arr[i]);
    if (direction === "UP")
      while (arr[i] < arr[i + 1]) {
        currentSequence.push(arr[i + 1]);
        length += 1;
        i += 1;
      }
    else {
      while (arr[i] > arr[i + 1]) {
        currentSequence.push(arr[i + 1]);
        length += 1;
        i += 1;
      }
    }

    if (maxLength > length) {
      length = 0;
    } else {
      maxLength = length;
      incrSequence = [...currentSequence];
      length = 0;
    }
  }

  return incrSequence;
}

async function onClick(event) {
  console.dir(button.textContent);

  button.textContent = "Дані обробляються...";
  console.dir(button.textContent);
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setTimeout(resolve, 0));
  const startTime = new Date();
  getArrayFromFile(fileContent);

  const result = getValues(numberArray);
  const endTime = new Date();
  console.log("Time taken:", endTime - startTime, "milliseconds");
  result.time = (endTime - startTime) / 1000;
  console.log("RES", result);

  renderMarkup(result);
  input.value = "";
}

function onChange(event) {
  const file = event.target.files[0]; // Получаем выбранный файл
  // Создаем объект FileReader
  const reader = new FileReader();
  reader.onloadstart = function (event) {
    button.disabled = true;
    button.textContent = "Файл завантажується";
  };
  // Обработчик события, вызываемый при завершении чтения файла
  reader.onload = function (event) {
    fileContent = event.target.result; // Получаем содержимое файла
    button.textContent = "Визначити";
    button.removeAttribute("disabled");
  };

  // Читаем файл как текст
  reader.readAsText(file);
}
