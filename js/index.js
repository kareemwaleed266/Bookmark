inputs = document.querySelectorAll("input");
var siteName = inputs[0];
var siteUrl = inputs[1];
var submitBtn = document.querySelector("form .btn");
var tableInfo = document.querySelector("#tableInfo");
var bookMarks;

if (localStorage.getItem("bookmarks") == null) {
  bookMarks = [];
} else {
  bookMarks = JSON.parse(localStorage.getItem("bookmarks"));
  display(bookMarks);
}

function addBookmark() {
  if (
    siteName.classList.contains("is-valid") &&
    siteUrl.classList.contains("is-valid")
  ) {
    var bookmark = {
      name: siteName.value,
      url: siteUrl.value,
    };

    for (var i = 0; i < bookMarks.length; i++) {
      if (bookMarks[i].name.toLowerCase() === bookmark.name.toLowerCase()) {
        siteName.nextElementSibling.classList.remove("d-none");
        siteName.classList.add("is-invalid");
        setTimeout(() => {
          clear();
        }, 1000);
        return;
      }
    }

    bookMarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookMarks));
    appendNewRow(bookMarks);
    clear();
  } else {
    showValidationAlert();
  }
}

function appendNewRow(bookmarks) {
  createTable(bookmarks.length - 1);
}

function createTable(index) {
  var row = document.createElement("tr");
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${bookMarks[index].name}</td>
    <td>
      <button id="visit" class="btn btn-success">
        <i class="fa-solid fa-eye pe-2"></i>Visit
      </button>
    </td>
    <td>
      <button id="delete" class="btn btn-danger">
        <i class="fa-solid fa-trash-can pe-2"></i>Delete
      </button>
    </td>`;

  var visitBtn = row.querySelector("#visit");
  visitBtn.addEventListener("click", function (e) {
    visit(index);
  });

  var deleteBtn = row.querySelector("#delete");
  deleteBtn.addEventListener("click", function (e) {
    deleteBookmark(index);
  });
  tableInfo.appendChild(row);
}

function display(arr) {
  for (var i = 0; i < arr.length; i++) {
    createTable(i);
  }
}

function deleteBookmark(index) {
  bookMarks.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookMarks));
  tableInfo.innerHTML = "";
  display(bookMarks);
}

function visit(index) {
  window.open(bookMarks[index].url, "_blank");
}

function validInput(element) {
  var regex = {
    name: /^[a-zA-z][\w ]{2,19}$/,
    // url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    url: /^(https:\/\/|www\.|http:\/\/)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/,
  };
  if (regex[element.id].test(element.value)) {
    element.classList.replace("is-invalid", "is-valid");
    element.classList.add("is-valid");
  } else {
    element.classList.replace("is-valid", "is-invalid");
    element.classList.add("is-invalid");
  }
}

function showValidationAlert() {
  var alertContainer = document.getElementById("customAlert");

  alertContainer.style.display = "flex";

  alertContainer
    .querySelector(".alert-btn")
    .addEventListener("click", function () {
      alertContainer.style.display = "none";
    });
}

function clear() {
  siteName.value = "";
  siteName.classList.remove("is-valid", "is-invalid");
  siteUrl.value = "";
  siteUrl.classList.remove("is-valid", "is-invalid");
  siteName.nextElementSibling.classList.add("d-none");
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
});

submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  addBookmark();
});

for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("input", function () {
    validInput(this);
  });
}
