document.addEventListener("DOMContentLoaded", function () {
  const bookList = [];
  const renderEvent = "render-bookList";

  const submitForm = document.getElementById("form");

  //   submit
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addList();
  });

  //   nambah list
  function addList() {
    const judul = document.getElementById("inputJudul").value;
    const author = document.getElementById("inputAuthor").value;
    const tahun = document.getElementById("inputTahun").value;
    const tahunNumber = parseInt(tahun);
    // console.log(typeof tahunNumber);

    const generatedID = generateID();
    const listObject = generateListObject(
      generatedID,
      judul,
      author,
      tahunNumber,
      false
    );
    bookList.push(listObject);

    document.dispatchEvent(new Event(renderEvent));
  }

  // id unik
  function generateID() {
    return +new Date();
  }

  //   buat objet dari data list
  function generateListObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted,
    };
  }

  //   rak belum selesai dibaca
  //   buat element
  function makeList(listObject) {
    const textJudul = document.createElement("h3");
    textJudul.innerText = listObject.title;

    const textYear = document.createElement("p");
    textYear.innerText = listObject.year;

    const inner = document.createElement("div");
    inner.append(textJudul, textYear);

    const container = document.createElement("div");
    container.classList.add("inner-list");
    container.append(inner);

    if (listObject.isCompleted) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("undo-button");
      undoButton.innerText = "◀";

      undoButton.addEventListener("click", function () {
        undoTaskFromCompleted(listObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      const trashSpan = document.createElement("span");
      trashSpan.classList.add("trash-span");
      trashSpan.innerText = "🗑";

      trashButton.append(trashSpan);

      trashButton.addEventListener("click", function () {
        removeTaskFromCompleted(listObject.id);
      });

      const containerButton = document.createElement("div");
      containerButton.classList.add("container-button");
      containerButton.append(undoButton, trashButton);

      container.append(containerButton);
    } else {
      const checkButton = document.createElement("button");
      checkButton.classList.add("check-button");
      checkButton.innerText = "✔";

      checkButton.addEventListener("click", function () {
        addTaskToCompleted(listObject.id);
      });

      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-button");

      const trashSpan = document.createElement("span");
      trashSpan.classList.add("trash-span");
      trashSpan.innerText = "🗑";

      trashButton.append(trashSpan);

      trashButton.addEventListener("click", function () {
        removeTaskFromCompleted(listObject.id);
      });

      const containerButton = document.createElement("div");
      containerButton.classList.add("container-button");
      containerButton.append(checkButton, trashButton);

      container.append(containerButton);
    }

    saveData();
    return container;
  }

  //   function add
  function addTaskToCompleted(bookID) {
    const listTarget = findList(bookID);

    if (listTarget == null) return;

    listTarget.isCompleted = true;
    document.dispatchEvent(new Event(renderEvent));
    saveData();
  }

  //   funcion findList
  function findList(bookID) {
    for (const listItem of bookList) {
      if (listItem.id === bookID) {
        return listItem;
      }
    }
    return null;
  }

  //   function undo
  function undoTaskFromCompleted(bookID) {
    const listTarget = findList(bookID);

    if (listTarget == null) return;

    listTarget.isCompleted = false;
    document.dispatchEvent(new Event(renderEvent));
    saveData();
  }

  //   function remove
  function removeTaskFromCompleted(bookID) {
    const listTarget = findBookIndex(bookID);

    if (listTarget === -1) return;

    bookList.splice(listTarget, 1);
    document.dispatchEvent(new Event(renderEvent));
    saveData();
  }

  function findBookIndex(bookID) {
    for (const index in bookList) {
      if (bookList[index].id === bookID) {
        return index;
      }
    }

    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(bookList);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(savedEvent));
    }
  }

  const savedEvent = "saved-book";
  const STORAGE_KEY = "List_APP";

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }

    return true;
  }

  //   check render
  document.addEventListener(renderEvent, function () {
    console.log(bookList);

    const uncompletedBookList = document.getElementById("addList");
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completedList");
    completedBookList.innerHTML = "";

    for (const list of bookList) {
      const listElement = makeList(list);
      if (!list.isCompleted) {
        uncompletedBookList.append(listElement);
      } else {
        completedBookList.append(listElement);
      }
    }
  });

  //   saved data
  document.addEventListener(savedEvent, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        bookList.push(book);
      }
    }

    document.dispatchEvent(new Event(renderEvent));
  }

  if (isStorageExist()) {
    loadDataStorage();
  }
});
