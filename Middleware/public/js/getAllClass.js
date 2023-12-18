import { getAllClass, createClass } from "./Services/class.service.js";
import { getAllLocation } from "./Services/location.service.js";

let _currentPage = 1;

function addElementToTable(element){
    const table = document.querySelector("#table > tbody");
        table.innerHTML += 
            `
            <tr>
            <td>${element.name}</td>
            <td>${element.code}</td>
            <td>${reformatDate(element.startDate)}</td>
            <td>${element.createBy}</td>
            <td>${new Date(element.endDate) - new Date(element.startDate)+" days"}</td>
            <td><span class="rounded-pill text-white p-1"
        style="background-color: #2D3748;">Fresher</span></td>
            <td>${element.location}</td>
            <!--<td>${element.fsu}</td>-->
            <td>
            <div class="dropdown">
            <a onclick="myFunction(this)" class="dropbtn">
            <div class="svg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none">
            <path
        d="M13 15C14.1046 15 15 14.1046 15 13C15 11.8954 14.1046 11 13 11C11.8954 11 11 11.8954 11 13C11 14.1046 11.8954 15 13 15Z"
        fill="#2D3748" />
            <path
        d="M20 15C21.1046 15 22 14.1046 22 13C22 11.8954 21.1046 11 20 11C18.8954 11 18 11.8954 18 13C18 14.1046 18.8954 15 20 15Z"
        fill="#2D3748" />
            <path
        d="M6 15C7.10457 15 8 14.1046 8 13C8 11.8954 7.10457 11 6 11C4.89543 11 4 11.8954 4 13C4 14.1046 4.89543 15 6 15Z"
        fill="#2D3748" />
            </svg>
            </div>
            </a>
            <div class="dropdown-content">
            <a href="class-detail.html?id=${element.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_45_1811)">
            <path
        d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM5.92 19H5V18.08L14.06 9.02L14.98 9.94L5.92 19ZM20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3C17.4 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63Z"
        fill="#285D9A" />
            </g>
            <defs>
            <clipPath id="clip0_45_1811">
            <rect width="24" height="24" fill="white" />
            </clipPath>
            </defs>
            </svg>
            Edit class</a>
            <a href="#duplicate" id=${element.id}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_45_1814)">
            <path
        d="M15.7895 3H5.68421C4.75789 3 4 3.77727 4 4.72727V16.8182H5.68421V4.72727H15.7895V3ZM18.3158 6.45455H9.05263C8.12632 6.45455 7.36842 7.23182 7.36842 8.18182V20.2727C7.36842 21.2227 8.12632 22 9.05263 22H18.3158C19.2421 22 20 21.2227 20 20.2727V8.18182C20 7.23182 19.2421 6.45455 18.3158 6.45455ZM18.3158 20.2727H9.05263V8.18182H18.3158V20.2727Z"
        fill="#285D9A" />
            </g>
            <defs>
            <clipPath id="clip0_45_1814">
            <rect width="24" height="24" fill="white" />
            </clipPath>
            </defs>
            </svg>
            Duplicate class</a>
            <a class="delete" href="#delete" id=${element.id}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_45_1817)">
            <path
        d="M14.12 10.47L12 12.59L9.87 10.47L8.46 11.88L10.59 14L8.47 16.12L9.88 17.53L12 15.41L14.12 17.53L15.53 16.12L13.41 14L15.53 11.88L14.12 10.47ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5ZM6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9Z"
        fill="#2C5282" />
            </g>
            <defs>
            <clipPath id="clip0_45_1817">
            <rect width="24" height="24" fill="white" />
            </clipPath>
            </defs>
            </svg>
            Delete class</a>
            </div>
            </div>
            </td>
            </tr>
            `
}   

$(document).ready(async function () {
    const data = await getAllClass();
    console.log(data);
    data.forEach(element => addElementToTable(element))
    
    renderPagination(3);
    
    
    const location = await getAllLocation();
    location.forEach((element, index) => {
        const filter = document.querySelector("#filter-class-location");
        filter.innerHTML += 
        `
        <option value="${index}">${element.name}</option>
        `
    })
    document.querySelectorAll(".delete").forEach((d) => {
        d.addEventListener("click", (event) => {
            event.preventDefault();
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteSyllabus(d.getAttribute("id"))
                        .catch((error) => {
                            console.error("Error during login:", error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Delete Failed',
                                text: 'Delete class failed!!!',
                                showCancelButton: false,
                                confirmButtonText: 'OK',
                                iconHtml: '<span class="custom-x-icon"></span>',
                                customClass: {
                                    popup: 'custom-swal-popup',
                                    title: 'custom-swal-title',
                                    confirmButton: 'custom-swal-button',
                                    icon: 'custom-swal-icon', // Custom CSS class for the "X" icon
                                },
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                            });
                        });
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                }
            })
            .catch((error) => {
                console.error("Error during login:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: 'Delete syllabus failed!!!',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                    iconHtml: '<span class="custom-x-icon"></span>',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        confirmButton: 'custom-swal-button',
                        icon: 'custom-swal-icon', // Custom CSS class for the "X" icon
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            });
        })
    })
});

let renderPagination = async (rowsPerPage)=>{
    const data = await getAllClass();
    let totalPages = Math.ceil(data.length / rowsPerPage);
    generatePageNumbers(1,totalPages);           
}

let pagin = document.querySelector("#pagination-page-size");
pagin.addEventListener("change", (event) => {
    renderPagination(event.target.value);
    document.getElementById("page-number-1").click();
});

$("#add-class-form").submit(function (event) {
    event.preventDefault();
    $(".is-invalid").removeClass("is-invalid")
    $(".invalid-feedback").text("");
    let arr1 = $(this).serializeArray();
    console.log(arr1);
    let keyValues = {}
    let isValid = true;
    $.each(arr1, function (index, item) {
        let key = item.name;
        let value = item.value;
        if (key === "name" && value.trim().length === 0) {
            $("#invalid-class-name").text("Invalid syllabus name");
            $("#input-class-name").addClass("is-invalid");
            isValid = false;
        }
        if (key === "code" && value.trim().length === 0) {
            $("#invalid-code").text("Invalid code");
            $("#input-code").addClass("is-invalid");
            isValid = false;
        }
        if (key === "createOn" && value.trim().length === 0) {
            console.log(value);
            $("#invalid-created-date").text("Invalid created date");
            $("#pick-created-date").addClass("is-invalid");
            isValid = false;
        }
        if (key === "createBy" && value.trim().length === 0) {
            $("#invalid-created-by").text("Invalid created by");
            $("#input-created-by").addClass("is-invalid");
            isValid = false
        }
        if (key === "duration" && value.trim().length === 0) {
            $("#invalid-duration").text("Invalid created by");
            $("#input-duration").addClass("is-invalid");
            isValid = false
        }
        keyValues[key] = value;
    });
    if (isValid) {
        createClass(keyValues)
            .then(() => {
                $(".close-add-class-dialog-button").click();
                Swal.fire({
                    title: "Add successfully",
                    icon: 'success',
                    text: "Class was added!!!",
                    type: "success"
                }).then(function() {
                    window.location.reload();
                });
            })
            .catch((error) => {
                console.error("Error during login:", error);
                $(".close-add-class-dialog-button").click();
                Swal.fire({
                    icon: 'error',
                    title: 'Add Failed',
                    text: error,
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                    iconHtml: '<span class="custom-x-icon"></span>',
                    customClass: {
                        popup: 'custom-swal-popup',
                        title: 'custom-swal-title',
                        confirmButton: 'custom-swal-button',
                        icon: 'custom-swal-icon', // Custom CSS class for the "X" icon
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            });
    }
});

function reformatDate(dateStr)
{
  var dArr = dateStr.split("-");  // ex input: "2010-01-18"
  return dArr[2]+ "/" +dArr[1]+ "/" +dArr[0]; //ex output: "18/01/10"
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
                .prop("class", "btn")
                .on("click",async function () {
                    let pageNo = $(this).prop("id").split("-")[2];
                    _currentPage = pageNo;
                    //highlight chosen pagin
                    generatePageNumbers(_currentPage, totalPages);
                    
                    //Get the table to delete row that shouldn't show
                    let rowsPerPage = document.querySelector("#pagination-page-size").value;
                    let table = document.querySelector("#table > tbody");
                    let rowCollection = table.querySelectorAll(":scope tr");
                    rowCollection.forEach(row => row.remove());
                    //Add all syllabus because the pagin delete it
                    await getAllClass().then((data) => {
                        data.forEach((element) => addElementToTable(element));
                        table.querySelectorAll(":scope tr").forEach((row, index) => {
                        //Ex: Choose page 2 & rowsPerPage 3 => Remove row <= 3 && row >= 7 
                            if(index <= (_currentPage - 1)*rowsPerPage-1 || index >= _currentPage * rowsPerPage){
                                row.remove();
                            }
                        });
                    })
                    
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
