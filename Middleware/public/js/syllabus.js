import { createSyllabusByCsv, getAllSyllabus, deleteSyllabus } from "./Services/syllabus.service.js";
//For sort, search and filter
var _currentPage = 1;
var _startDate = "";
var _endDate = "";
$(document).ready(function () {
  $(document).on("click",".edit-syllabus-button",(e)=>{
    e.preventDefault();
    localStorage.setItem("syllabusId",$(e.currentTarget).attr("data-syllabus-id"));
    window.location.href = "updateSyllabus.html";
  });
  $("#open-import-dialog-button").click(function () {
    $("#add-syllabus-dialog")[0].showModal();
    $("#add-syllabus-dialog").addClass("show-dialog");
  });
  $("#import-syllabus-form").submit(function (e) {
    e.preventDefault();
    let formData = new FormData(this);
    formData.forEach((value, key) => {
      console.log(key + ":" + value);
    });
    createSyllabusByCsv(formData)
      .then((response) => {
        console.log(JSON.stringify(response));
      })
      .catch((error) => {
        console.log(error);
      });
  });
  $("#search-syllabus").submit(function (event) {
    event.preventDefault();
    getSyllabusData();
  })
  getSyllabusData();
  $(document).on("click", ".delete-syllabus-button", function (event) {
    let id = $(this).attr("data-syllabus-id");
    deleteSyllabus(id)
      .then(response => {
        getSyllabusData();
      })
      .catch(error => {
        console.log(error);
      })
  })
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
    getSyllabusData();
  });
  $("#pagination-page-size").change(function () {
    getSyllabusData();
  })
  $(function () {
    $('input[name="createDate"]').daterangepicker({
      opens: 'left'
    }, function (start, end, label) {
      _startDate = start.format('YYYY-MM-DD');
      _endDate = end.format('YYYY-MM-DD');
    });
  })
});

function getSyllabusData() {
  let sortField;
  let sortOrder;
  if ($("#table-syllabus-data .sortable.sortable-desc").length !== 0) {
    sortField = $("#table-syllabus-data .sortable.sortable-desc").attr(
      "data-col-name"
    );
    sortOrder = 0;
  } else {
    sortField = $("#table-syllabus-data .sortable.sortable-asc").attr(
      "data-col-name"
    );
    sortOrder = 1;
  }
  let dataPart = {
    page: _currentPage,
    pageSize: $("#pagination-page-size").val(),
    sortField: sortField,
    sortOrder: sortOrder,
    startDate: _startDate,
    endDate: _endDate,
    searchValue: $('input[name="searchValue"]').val()
  }
  getAllSyllabus(dataPart)
    .then(response => {
      let tableData = [];
      response.syllabus.forEach((value, index) => {
        let elementArr = [];
        elementArr.push(value.name);
        elementArr.push(value.code);
        elementArr.push(value.modifiedOn);
        elementArr.push(value.modifiedBy);
        elementArr.push(value.duration);
        elementArr.push(value.outputStandard);
        elementArr.push(value.status);
        elementArr.push(optionButtonBuilder(value));
        tableData.push(elementArr);
      })
      fillTableWithData("table-syllabus-data", tableData);
      let totalPages = Math.ceil(response.totalCount / response.pageSize);
      generatePageNumbers(_currentPage, totalPages)
    })
    .catch(error => {
      console.log(error);
    })
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
function optionButtonBuilder(syllabusInfo) {
  let btn = `
  <div class="dropdown dropstart"> 
    <button class="btn" type="button" id="${"syllabus-popup-menu-" + syllabusInfo.id}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <div class="svg">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> <path d="M13 15C14.1046 15 15 14.1046 15 13C15 11.8954 14.1046 11 13 11C11.8954 11 11 11.8954 11 13C11 14.1046 11.8954 15 13 15Z" fill="#2D3748" /> <path d="M20 15C21.1046 15 22 14.1046 22 13C22 11.8954 21.1046 11 20 11C18.8954 11 18 11.8954 18 13C18 14.1046 18.8954 15 20 15Z" fill="#2D3748" /> <path d="M6 15C7.10457 15 8 14.1046 8 13C8 11.8954 7.10457 11 6 11C4.89543 11 4 11.8954 4 13C4 14.1046 4.89543 15 6 15Z" fill="#2D3748" /> </svg> 
      </div> 
    </button> 
    <div class="dropdown-menu" aria-labelledby="${"syllabus-popup-menu-" + syllabusInfo.id}"> 
      <button class="dropdown-item ${"add-training-program-button"}" ${"data-syllabus-id"}="${syllabusInfo.id}" ${"disabled"}> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_45_1808)"><path d="M13 7H11V11H7V13H11V17H13V13H17V11H13V7ZM12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#285D9A"/></g><defs><clipPath id="clip0_45_1808"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>      
        ${"Add training program"} 
      </button> 
      <button class="dropdown-item ${"edit-syllabus-button"}" ${"data-syllabus-id"}="${syllabusInfo.id}"> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_45_1811)"><path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM5.92 19H5V18.08L14.06 9.02L14.98 9.94L5.92 19ZM20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3C17.4 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63Z" fill="#285D9A"/></g><defs><clipPath id="clip0_45_1811"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
        ${"Edit syllabus"} 
      </button> 
      <button class="dropdown-item ${"duplicate-syllabus-button"}" ${"data-syllabus-id"}="${syllabusInfo.id}"> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_45_1814)"><path d="M15.7895 3H5.68421C4.75789 3 4 3.77727 4 4.72727V16.8182H5.68421V4.72727H15.7895V3ZM18.3158 6.45455H9.05263C8.12632 6.45455 7.36842 7.23182 7.36842 8.18182V20.2727C7.36842 21.2227 8.12632 22 9.05263 22H18.3158C19.2421 22 20 21.2227 20 20.2727V8.18182C20 7.23182 19.2421 6.45455 18.3158 6.45455ZM18.3158 20.2727H9.05263V8.18182H18.3158V20.2727Z" fill="#285D9A"/></g><defs><clipPath id="clip0_45_1814"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>      
        ${"Duplicate syllabus"} 
      </button> 
      <button class="dropdown-item ${"delete-syllabus-button"}" ${"data-syllabus-id"}="${syllabusInfo.id}"> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_45_1817)"><path d="M14.12 10.47L12 12.59L9.87 10.47L8.46 11.88L10.59 14L8.47 16.12L9.88 17.53L12 15.41L14.12 17.53L15.53 16.12L13.41 14L15.53 11.88L14.12 10.47ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5ZM6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9Z" fill="#2C5282"/></g><defs><clipPath id="clip0_45_1817"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
        ${"Delete syllabus"} 
      </button> 
    </div> 
  </div>`;
  return btn;
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
        .attr("data-page-number", value)
        .prop("class", "btn pagination-link")
        .on("click", function () {
          let pageNo = $(this).attr("data-page-number");
          _currentPage = pageNo;
          getSyllabusData();
        });
      if (value == _currentPage) {
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
