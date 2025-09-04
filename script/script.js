console.log("hi");

const createElements = (arr) => {
  //  console.log(arr);
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join("");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("wordContainer").classList.add("hidden");
  } else {
    document.getElementById("wordContainer").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then((res) => res.json()) //promise json data
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lessonBtn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

//function loadLevelWord
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lessonBtn${id}`);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

//load word detail

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;

  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("detailsContainer");
  detailsBox.innerHTML = `
          <div class="">
            <h2 class="text-2xl font-bold">
              ${word.word}(<i class="fa-solid fa-microphone"></i>: ${
    word.pronunciation
  })
            </h2>
          </div>
          <div class="">
            <h2 class="font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>

          <div class="">
            <h2 class="font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>

          <div class="">
            <h2 class="font-bold">Synonyms</h2>
            <div class="">${createElements(word.synonyms)}</div>
          </div>

  `;
  document.getElementById("word_modal").showModal();
};

//function display levelWord
const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("wordContainer");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    //alert("No Words found");
    wordContainer.innerHTML = `
       <div
        class="font-bangla text-center bg-gray-100 col-span-full rounded-xl py-10 space-y-6"
      >
      <img class="mx-auto" src="./assets/alert-error.png">
        <p class="text-xl font-medium text-gray-400">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    console.log(word);
    const card = document.createElement("div");
    card.innerHTML = `
     <div
        class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4"
      >
        <h2 class="font-bold text-2xl">${
          word.word ? word.word : "শব্দ পাওয়া যায়নি।"
        }</h2>
        <p class="font-semibold">Meaning/Pronunciation</p>
        <div class="text-2xl font-medium font-bangla">${
          word.meaning ? word.meaning : "Meaning পাওয়া যায়নি।"
        }/${
      word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি।"
    }</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button onclick="pronounceWord('${
            word.word
          }')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `;

    wordContainer.append(card);
  });
  manageSpinner(false);
};

// function displayLesson
const displayLesson = (lessons) => {
  //console.log(lesson);
  //1. get the container and empty
  const levelContainer = document.getElementById("levelContainer");
  levelContainer.innerHTML = "";
  //2. get into every lesson
  for (let lesson of lessons) {
    //3. create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
                    <button id="lessonBtn${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lessonBtn"><i class="fa-solid fa-book-open-reader"> </i>Lesson -${lesson.level_no}
                  </button>
    `;
    //4. append into container
    levelContainer.append(btnDiv);
  }
};

loadLessons();

document.getElementById("btnSearch").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("inputSearch");
  const searchValue = input.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});
