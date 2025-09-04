const createElements = (arr) => {
  //  console.log(arr);
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join("");
};

const synonyms = ["hello", "hi", "hola"];
createElements(synonyms);
