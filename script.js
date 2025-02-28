//Geting input elements

const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const emailID = document.getElementById("email");
const studentID = document.getElementById("StudentId");
const contactNO = document.getElementById("Contact");

//geting display section
const displaySt = document.querySelector(".registered-st");
const tableBody = document.querySelector(".student-table tbody");

//geting submit button
const button = document.querySelector(".Submit");

//Adding the information on to the display screen
button.addEventListener("click", addDetails);

function addDetails(event) {
  // prevents the page from refreshing
 event.preventDefault();

  //ensure all fields are filled
  if (
    fname.value === "" ||
    lname.value === "" ||
    emailID.value === "" ||
    contactNO.value === ""
  ) {
    alert("All fields are required!!");
    return;
  }

  

  //create student object
  let student = {
    firstName: fname.value,
    lastName: lname.value,
    email: emailID.value,
    id: studentID.value,
    contact: contactNO.value,
  };

  //Get exixting students from local storage
  let students = JSON.parse(localStorage.getItem("students")) || [];

  //Add new student to array
  students.push(student);

    // to check for duplicate Student IDs:
    if (students.some(student => student.id === studentID.value)) {
      alert("Student ID already exists!");
      return;
  }

  //Save updated students array to localstorage
  localStorage.setItem("students", JSON.stringify(students));


  //display student in table
  addStudentToTable(student);

  //clearing the input field after adding

  fname.value = "";
  lname.value = "";
  emailID.value = "";
  studentID.value = "";
  contactNO.value = "";
}

function addStudentToTable(student) {
  //create a table row
  const newRow = document.createElement("tr");

  //creating table data cells

  newRow.innerHTML = `
        <td>
        <button class="edit-btn" onclick="editRow(this)">Edit</button>
        <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
        
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.id}</td>
        <td>${student.contact}</td>
    `;

  //Append the new row to the table
  tableBody.appendChild(newRow);
}

//Function to display students from local storage
function loadStudents() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach((student) => addStudentToTable(student));
}

//adding functionality to the edit button after being clicked
function editRow(button) {
  //getting closest to the row
  let row = button.closest("tr");

  //not including the first td part coz its the edit button
  let cells = row.querySelectorAll("td:not(:first-child)");

  //using array method on the each cells to edit each one of them
  cells.forEach((cell) => {
    let currentValue = cell.innerText;
    cell.innerHTML = `<input type="text" value="${currentValue}" >`;
  });

  //displaying the save button after the edit button have been clicked

  button.innerText = "Save";
  button.classList.remove("edit-btn");
  button.classList.add("save-btn");
  button.setAttribute("onclick", "saveRow(this)");
}

// adding functionality to save button when clicked

function saveRow(button) {
  //getting closest to the row
  let row = button.closest("tr");
  let cells = row.querySelectorAll("td:not(:first-child)");

  //savind the data into local storage after editing

  let updatedStudent = {
    firstName: cells[0].querySelector("input").value.trim(),
    lastName: cells[1].querySelector("input").value.trim(),
    email: cells[2].querySelector("input").value.trim(),
    id: cells[3].querySelector("input").value.trim(),
    contact: cells[4].querySelector("input").value.trim()
};

    // Convert input fields back to normal text
    cells.forEach((cell, index) => {
      let inputField = cell.querySelector("input");
      if (inputField) {
        cell.innerText = inputField.value;
      }
    });



  //get students from local storage
  let students = JSON.parse(localStorage.getItem("students")) || [];

  //update the students in array
  students = students.map((student) =>
    student.id === updatedStudent.id ? updatedStudent : student
  );

  //save to local storage

  localStorage.setItem("students", JSON.stringify(students));

  //showing or adding edit btn back to Edit

  button.innerText = "Edit";
  button.classList.remove("save-btn");
  button.classList.add("edit-btn");
  button.setAttribute("onclick", "editRow(this)");
}

//function to delete a row

function deleteRow(button) {
  let row = button.closest("tr");
  let studentId = row.children[4].textContent; // Get student ID from the correct column
  
  row.remove();
  //removes the student row from the table

  // Get students from localStorage
  let students = JSON.parse(localStorage.getItem("students")) || [];

  // Filter out the deleted student
  students = students.filter((student) => student.id !== studentId);

  // Save updated list back to localStorage
  localStorage.setItem("students", JSON.stringify(students));
}

// Call loadStudents when the page loads and even after page referesh the data will stay there
document.addEventListener("DOMContentLoaded", loadStudents);