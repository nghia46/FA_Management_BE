import {
  getAllUser,
  addUser,
  deleteUser,
  toggleUserStatus,
  changeUserRole,
  getUser,
  updateUser,
} from "./Services/userManagement.service.js";
import { getAllUserRole } from "./Services/userRole.service.js";
var _currentPage;
var _filterOption;
var _searchValue;
var _userRoleList;
var maleIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_184_16241)">
  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#2D3748"/>
  </g>
  <defs>
  <clipPath id="clip0_184_16241">
  <rect width="24" height="24" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;
var femaleIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_184_16245)">
  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#FF7568"/>
  </g>
  <defs>
  <clipPath id="clip0_184_16245">
  <rect width="24" height="24" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;
$(document).ready(function () {
  _currentPage = 1;
  getAllUserRole()
    .then((response) => {
      _userRoleList = response;
      getUserTypeInFilter();
      getUserTypeInAdd();
      getUserData();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.error,
      });
      console.log(error);
    });
  $("#navigation-user-management-collapse").collapse("show");
  $(".sortable").click(function () {
    if ($(this).hasClass("sortable-asc")) {
      $(this).removeClass("sortable-asc");
      $(this).addClass("sortable-desc");
    } else if ($(this).hasClass("sortable-desc")) {
      $(this).removeClass("sortable-desc");
      $(this).addClass("sortable-asc");
    } else {
      if ($(".sortable-asc").length !== 0)
        $(".sortable-asc").removeClass("sortable-asc");
      if ($(".sortable-desc").length !== 0)
        $(".sortable-desc").removeClass("sortable-desc");
      $(this).addClass("sortable-asc");
    }
    getUserData();
  });
  $("#pagination-page-size").change(function () {
    _currentPage = 1;
    getUserData();
  });
  $("#filter-form").submit(function (event) {
    event.preventDefault();
    var arr1 = $(this).serializeArray();
    var keyValues = {};
    $.each(arr1, function (index, item) {
      // Use the "name" as the key and "value" as the value
      var key = item.name;
      var value = item.value;
      if (key === "genderList") {
        value = value === "Male" ? true : false;
      }
      // Check if the key already exists, if so, create an array to store values
      if (keyValues.hasOwnProperty(key)) {
        keyValues[key].push(value);
      } else {
        if (key.endsWith("List")) {
          keyValues[key] = [];
          keyValues[key].push(value);
        } else {
          if (value !== "") {
            keyValues[key] = value;
          }
        }
      }
    });
    _filterOption = keyValues;
    getUserData();
    $("#filter-option-dialog")[0].close();
  });
  $("#reset-filter-option-dialog-button").click(function (event) {
    $("#filter-class-location").val(null).trigger("change");
  });
  $("#cancel-filter-option-dialog-button").click(function (event) {
    $("#filter-option-dialog").removeClass("show-dialog");
    setTimeout(() => {
      $("#filter-option-dialog")[0].close();
    }, 150);
  });
  $("#open-add-user-dialog-button").click(() => {
    $("#add-user-form")[0].reset();
    $("#add-user-form").attr("action", "add");
    $("#add-user-dialog")[0].showModal();
    $("#add-user-dialog").addClass("show-dialog");
  });
  $("#toggle-user-status").click(function () {
    $(this).prop("disabled", true);
    if ($("#user-status-label")[0].textContent === "Active") {
      $("#user-status-label")[0].textContent = "Inactive";
    } else {
      $("#user-status-label")[0].textContent = "Active";
    }
    setTimeout(() => {
      $(this).prop("disabled", false);
    }, 150);
  });
  $("#add-user-form").submit(function (event) {
    event.preventDefault();
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").text("");
    let arr1 = $(this).serializeArray();
    let keyValues = {};
    let isValid = true;
    $.each(arr1, function (index, item) {
      let key = item.name;
      let value = item.value;
      if (key === "name" && value.trim().length === 0) {
        $("#invalid-user-name").text("Invalid username");
        $("#input-user-name").addClass("is-invalid");
        isValid = false;
      }
      if (key === "email" && !value.trim().match(/^[a-z0-9]+@\w+\.\w+$/)) {
        $("#invalid-email-address").text("Invalid email address");
        $("#input-user-email-address").addClass("is-invalid");
        isValid = false;
      }
      if (key === "phone" && !value.trim().match(/[0-9]{10}/)) {
        $("#invalid-phone-number").text("Invalid phone number");
        $("#input-user-phone").addClass("is-invalid");
        isValid = false;
      }
      if (key === "dob" && value.trim().length === 0) {
        $("#invalid-date-of-birth").text("Invalid date of birth");
        $("#pick-date-of-birth").addClass("is-invalid");
        isValid = false;
      }
      if (value === "true") {
        value = true;
      }
      if (value === "false") {
        value = false;
      }
      keyValues[key] = value;
    });
    console.log(JSON.stringify(keyValues));
    if (isValid) {
      if ($("#add-user-form").attr("action") === "add") {
        addUser(keyValues)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Done",
              text: "The info has been added",
              confirmButtonText: "Exit",
              target: $("#add-user-dialog")[0],
            }).then((result) => {
              $("#add-user-dialog").removeClass("show-dialog");
              setTimeout(() => {
                $("#add-user-dialog")[0].close();
              }, 150);
              getUserData();
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.responseJSON.error,
              target: $("#add-user-dialog")[0],
            });
          });
      } else {
        let userID = $("#add-user-form").attr("data-user-id");
        updateUser(userID, keyValues)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Done",
              text: "The info has been updated",
              confirmButtonText: "Exit",
              target: $("#add-user-dialog")[0],
            }).then((result) => {
              $("#add-user-dialog").removeClass("show-dialog");
              setTimeout(() => {
                $("#add-user-dialog")[0].close();
              }, 150);
              getUserData();
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.responseJSON.error,
              target: $("#add-user-dialog")[0],
            });
            console.log(error);
          });
      }
    }
  });
  $("#input-user-name").click(function () {
    $(this).removeClass("is-invalid");
  });
  $("#input-user-email-address").click(function () {
    $(this).removeClass("is-invalid");
  });
  $("#input-user-phone").click(function () {
    $(this).removeClass("is-invalid");
  });
  $("#pick-date-of-birth").click(function () {
    $(this).removeClass("is-invalid");
  });
  $(".close-add-user-dialog-button").click(function (event) {
    event.preventDefault();
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").text("");
    $("#add-user-form")[0].reset();
    $("#add-user-dialog").removeClass("show-dialog");
    setTimeout(() => {
      $("#add-user-dialog")[0].close();
    }, 150);
  });
  $("#search-form").submit(function (event) {
    event.preventDefault();
    let arr = $(this).serializeArray();
    _searchValue = {};
    _searchValue[arr[0].name] = arr[0].value;
    console.log(_searchValue);
    getUserData();
  });
  $("#open-filter-dialog-button").click(() => {
    $("#filter-option-dialog")[0].showModal();
    $("#filter-option-dialog").addClass("show-dialog");
  });
  $(document).on("click", ".edit-user-button", function () {
    $(".dropdown-menu.show").removeClass("show");
    let userID = $(this).attr("data-user-id");
    $("#add-user-form").attr("action", "update");
    $("#add-user-form").attr("data-user-id", userID);
    $("#add-user-dialog")[0].showModal();
    $("#add-user-dialog").addClass("show-dialog");
    getUser(userID)
      .then((response) => {
        console.log(response);
        $("#select-user-type").val(response.roleId);
        $("#input-user-name").val(response.name);
        $("#input-user-email-address").val(response.email);
        $("#input-user-phone").val(response.phone);
        $("#pick-date-of-birth").val(response.dob);
        if (response.gender) {
          $("#gender-radio-male").prop("checked", true);
        } else {
          $("#gender-radio-female").prop("checked", true);
        }
        if (response.status) {
          $("#toggle-user-status").prop("checked", true);
        } else {
          $("#toggle-user-status").prop("checked", false);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong with update",
        });
        console.log(error);
      });
  });
  $(document).on("click", ".user-change-role-button", function () {
    $(".dropdown-menu.show").removeClass("show");
    let userID = $(this).attr("data-user-id");
    let role = $(this).attr("data-user-role");
    console.log(userID + " " + role);
    changeUserRole(userID, role)
      .then((response) => {
        getUserData();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.error,
        });
        console.log(error);
      });
  });
  $(document).on("click", ".de-activate-user-button", function () {
    $(".dropdown-menu.show").removeClass("show");
    let userID = $(this).attr("data-user-id");
    toggleUserStatus(userID)
      .then((response) => {
        getUserData();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.error,
        });
      });
  });
  $(document).on("click", ".delete-user-button", function () {
    $(".dropdown-menu.show").removeClass("show");
    let userID = $(this).attr("data-user-id");
    console.log(userID);
    deleteUser(userID)
      .then((response) => {
        getUserData();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.responseJSON.error,
        });
        console.log(error);
      });
  });
});
function getUserData() {
  let sortField;
  let sortOrder;
  if ($("#user-information-table .sortable.sortable-desc").length !== 0) {
    sortField = $("#user-information-table .sortable.sortable-desc").attr(
      "data-col-name"
    );
    sortOrder = 0;
  } else {
    sortField = $("#user-information-table .sortable.sortable-asc").attr(
      "data-col-name"
    );
    sortOrder = 1;
  }
  let dataPart = {
    page: _currentPage,
    pageSize: $("#pagination-page-size").val(),
    sortField: sortField,
    sortOrder: sortOrder,
  };

  let data = { ...dataPart, ..._filterOption, ..._searchValue };
  getAllUser(data)
    .then((response) => {
      let tableData = [];
      response.users.forEach((element) => {
        let elementArr = [];
        elementArr.push(element.id);
        elementArr.push(element.name);
        elementArr.push(element.email);
        elementArr.push(element.dob);
        elementArr.push(element.gender ? maleIcon : femaleIcon);
        let userRole;
        if (element.roleId === "admin") {
          userRole =
            '<button class="user-type-admin">' + element.userRole + "</button>";
        } else if (element.roleId === "superadmin") {
          userRole =
            '<button class="user-type-class-admin">' +
            element.roleId +
            "</button>";
        } else {
          userRole =
            '<button class="user-type-trainer">' + element.roleId + "</button>";
        }
        elementArr.push(userRole);
        elementArr.push(element.status ? "true" : "false");
        let btn = optionButtonBuilder(element);
        elementArr.push(btn);
        tableData.push(elementArr);
      });
      _currentPage = response.page;
      $("#pagination-page-size").val(response.pageSize);
      let totalPages = Math.ceil(response.totalCount / response.pageSize);
      fillTableWithData("user-information-table", tableData);
      generatePageNumbers(_currentPage, totalPages);
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.responseJSON.error,
      });
      console.log(error);
    });
}
function generatePageNumbers(currentPage, totalPages) {
  let pagesToShow = 5; // You can change this value to control the number of pages to show before and after the current page.
  let pageNumbers = [];

  if (totalPages <= pagesToShow) {
    // If there are fewer pages than the desired number to show, display all pages.
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Calculate the range of pages to display around the current page.
    let start = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let end = Math.min(totalPages, start + pagesToShow - 1);

    if (end === totalPages) {
      // Adjust the start if we are at the end of the range.
      start = Math.max(1, end - pagesToShow + 1);
    }

    if (start > 1) {
      // Add ellipsis at the beginning if necessary.
      pageNumbers.push(1);
      if (start > 2) {
        pageNumbers.push("...");
      }
    }

    // Add the page numbers within the range.
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < totalPages) {
      // Add ellipsis at the end if necessary.
      if (end < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
  }
  let paginationContainer = $("#pagination");
  paginationContainer.empty();
  $.each(pageNumbers, function (index, value) {
    let btn;
    if (value !== "...") {
      btn = $("<button></button>")
        .text(value)
        .prop("id", "page-number-" + value)
        .prop("class", "btn pagination-link")
        .on("click", function () {
          let pageNo = $(this).prop("id").split("-")[2];
          _currentPage = pageNo;
          getUserData();
        });
      if (value === _currentPage) {
        if ($(".active-page").length !== 0) {
          $(".active-page").removeClass("active-page");
        }
        btn.addClass("active-page");
      }
    } else {
      btn = $("<span>...</span>");
    }
    paginationContainer.append(btn);
  });
}
function getUserTypeInFilter() {
  $("#form-check-input-list-user-type").empty();
  _userRoleList.forEach((value) => {
    let newDiv = $("<div></div>");
    newDiv.addClass("form-check");
    newDiv.addClass("checkbox-lg");
    let newInput = $("<input>");
    newInput.addClass("form-check-input");
    newInput.prop("type", "checkbox");
    newInput.prop("value", value.id);
    newInput.prop("id", "check-user-type-" + value.name.toLowerCase());
    newInput.prop("name", "userTypeList");
    let newLabel = $("<label></label>");
    newLabel.addClass("form-check-label");
    newLabel.addClass("fs-5");
    newLabel.prop("for", "check-user-type-" + value.name.toLowerCase());
    newLabel.html(value.name);
    newDiv.append(newInput);
    newDiv.append(newLabel);
    $("#form-check-input-list-user-type").append(newDiv);
  });
}
function getUserTypeInAdd() {
  $("#select-user-type").empty();
  _userRoleList.forEach((value) => {
    let newOption = $("<option></option>");
    newOption.html(value.name);
    newOption.prop("value", value.id);
    $("#select-user-type").append(newOption);
  });
}
function fillTableWithData(tableID, data) {
  let tbody = $("#" + tableID + " tbody");
  tbody.empty();
  data.forEach((element) => {
    let tr = $("<tr></tr>");
    for (let i = 0; i < element.length; i++) {
      let td = $("<td></td>");
      td.html(element[i]);
      tr.append(td);
    }
    tbody.append(tr);
  });
}
function optionButtonBuilder(userInfo) {
  let btn = `
  <div class="dropdown dropstart"> 
    <button class="btn" type="button" id="user-popup-menu-${
      userInfo.id
    }" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
      <div class="svg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M13 15C14.1046 15 15 14.1046 15 13C15 11.8954 14.1046 11 13 11C11.8954 11 11 11.8954 11 13C11 14.1046 11.8954 15 13 15Z" fill="#2D3748" /> <path d="M20 15C21.1046 15 22 14.1046 22 13C22 11.8954 21.1046 11 20 11C18.8954 11 18 11.8954 18 13C18 14.1046 18.8954 15 20 15Z" fill="#2D3748" /> <path d="M6 15C7.10457 15 8 14.1046 8 13C8 11.8954 7.10457 11 6 11C4.89543 11 4 11.8954 4 13C4 14.1046 4.89543 15 6 15Z" fill="#2D3748" /> </svg> 
      </div> 
    </button> 
    <div class="dropdown-menu" aria-labelledby="user-popup-menu-${
      userInfo.id
    }"> 
      <button class="dropdown-item edit-user-button" data-user-id="${
        userInfo.id
      }"> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_46_6094)"> <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM5.92 19H5V18.08L14.06 9.02L14.98 9.94L5.92 19ZM20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3C17.4 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63Z" fill="#2D3748" /> </g> <defs> <clipPath id="clip0_46_6094"> <rect width="24" height="24" fill="white" /> </clipPath> </defs> </svg>
        ${"Edit user"} 
      </button> 
      <div class="dropdown dropstart"> 
        <button class="dropdown-item text-nowrap" type="button" id="user-popup-menu-change-role-${
          userInfo.id
        }" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_46_6098)"> <path d="M12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 15C14.7 15 17.8 16.29 18 17V18H6V17.01C6.2 16.29 9.3 15 12 15ZM12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z" fill="#2D3748" /> </g> <defs> <clipPath id="clip0_46_6098"> <rect width="24" height="24" fill="white" /> </clipPath> </defs> </svg>
          ${"Change role"}
          <svg class="ms-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_46_6100)"> <path d="M8 16.8379L9.0677 18L15 11.5L9.0617 5L8 6.16212L12.8766 11.5L8 16.8379Z" fill="#2D3748" /> </g> <defs> <clipPath id="clip0_46_6100"> <rect width="24" height="24" fill="white" transform="matrix(-1 0 0 -1 24 24)" /> </clipPath> </defs> </svg> 
        </button> 
        <div class="dropdown-menu" aria-labelledby="user-popup-menu-change-role-${
          userInfo.id
        }" id="user-popup-menu-change-role-sub-menu">`;
  _userRoleList.forEach((role) => {
    let isDisabled = role.id === userInfo.roleId ? "disabled" : "";
    btn += `
          <button class="dropdown-item user-change-role-button" data-user-role="${role.id}" data-user-id="${userInfo.id}" ${isDisabled}>
            ${role.name}
          </button>`;
  });
  btn += `
        </div> 
      </div> 
      <button class="dropdown-item de-activate-user-button" data-user-id="${
        userInfo.id
      }"> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_46_6102)"> <path d="M12 6.00001C15.79 6.00001 19.17 8.13001 20.82 11.5C20.23 12.72 19.4 13.77 18.41 14.62L19.82 16.03C21.21 14.8 22.31 13.26 23 11.5C21.27 7.11001 17 4.00001 12 4.00001C10.73 4.00001 9.51 4.20001 8.36 4.57001L10.01 6.22001C10.66 6.09001 11.32 6.00001 12 6.00001ZM10.93 7.14001L13 9.21001C13.57 9.46001 14.03 9.92001 14.28 10.49L16.35 12.56C16.43 12.22 16.49 11.86 16.49 11.49C16.5 9.01001 14.48 7.00001 12 7.00001C11.63 7.00001 11.28 7.05001 10.93 7.14001ZM2.01 3.87001L4.69 6.55001C3.06 7.83001 1.77 9.53001 1 11.5C2.73 15.89 7 19 12 19C13.52 19 14.98 18.71 16.32 18.18L19.74 21.6L21.15 20.19L3.42 2.45001L2.01 3.87001ZM9.51 11.37L12.12 13.98C12.08 13.99 12.04 14 12 14C10.62 14 9.5 12.88 9.5 11.5C9.5 11.45 9.51 11.42 9.51 11.37ZM6.11 7.97001L7.86 9.72001C7.63 10.27 7.5 10.87 7.5 11.5C7.5 13.98 9.52 16 12 16C12.63 16 13.23 15.87 13.77 15.64L14.75 16.62C13.87 16.86 12.95 17 12 17C8.21 17 4.83 14.87 3.18 11.5C3.88 10.07 4.9 8.89001 6.11 7.97001Z" fill="#2D3748" /> </g> <defs> <clipPath id="clip0_46_6102"> <rect width="24" height="24" fill="white" /> </clipPath> </defs> </svg>
        ${userInfo.status ? "De-activate user" : "Activate user"} 
      </button> 
      <button class="dropdown-item delete-user-button" data-user-id="${
        userInfo.id
      }"> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_184_16039)"> <path d="M14.12 10.47L12 12.59L9.87 10.47L8.46 11.88L10.59 14L8.47 16.12L9.88 17.53L12 15.41L14.12 17.53L15.53 16.12L13.41 14L15.53 11.88L14.12 10.47ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5ZM6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9Z" fill="#2D3748" /> </g> <defs> <clipPath id="clip0_184_16039"> <rect width="24" height="24" fill="white" /> </clipPath> </defs> </svg>
        ${"Delete user"} 
      </button> 
    </div> 
  </div>`;
  return btn;
}
