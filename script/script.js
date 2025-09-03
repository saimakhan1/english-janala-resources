console.log("hi");

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all") //promise of response
    .then((res) => res.json()) //promise json data
    .then((json) => displayLesson(json.data));
};

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
                    <button  class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open-reader"> </i>Lesson -${lesson.level_no}
                  </button>
    `;
    //4. append into container
    levelContainer.append(btnDiv);
  }
};

loadLessons();
