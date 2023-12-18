import {getSyllabus} from './Services/syllabus.service.js';
const deliveryIconMap = {
  assignmentLab: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_252_18771)">
    <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM9 4H11V9L10 8.25L9 9V4ZM18 20H6V4H7V13L10 10.75L13 13V4H18V20Z" fill="#2D3748"/>
  </g>
  <defs>
    <clipPath id="clip0_252_18771">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
  </svg>`,
  conceptLecture: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_252_18775)">
    <path d="M9 13C11.21 13 13 11.21 13 9C13 6.79 11.21 5 9 5C6.79 5 5 6.79 5 9C5 11.21 6.79 13 9 13ZM9 7C10.1 7 11 7.9 11 9C11 10.1 10.1 11 9 11C7.9 11 7 10.1 7 9C7 7.9 7.9 7 9 7ZM9 15C6.33 15 1 16.34 1 19V21H17V19C17 16.34 11.67 15 9 15ZM3 19C3.22 18.28 6.31 17 9 17C11.7 17 14.8 18.29 15 19H3ZM15.08 7.05C15.92 8.23 15.92 9.76 15.08 10.94L16.76 12.63C18.78 10.61 18.78 7.56 16.76 5.36L15.08 7.05ZM20.07 2L18.44 3.63C21.21 6.65 21.21 11.19 18.44 14.37L20.07 16C23.97 12.11 23.98 6.05 20.07 2Z" fill="#2D3748"/>
  </g>
  <defs>
    <clipPath id="clip0_252_18775">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
  </svg>`,
  guideReview: `<svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
  <g clip-path="url(#clip0_252_18779)">
    <path d="M17.25 22.9999H10.9729C9.93794 22.9999 8.9221 22.5687 8.20335 21.8212L1.20752 14.5283L3.19127 12.7745C3.78544 12.2474 4.65752 12.142 5.3571 12.5158L7.66669 13.7424V4.59035C7.66669 3.26785 8.74002 2.19452 10.0625 2.19452C10.2254 2.19452 10.3884 2.21369 10.5513 2.24244C10.6375 0.996605 11.6725 0.00952148 12.9375 0.00952148C13.7617 0.00952148 14.4804 0.421605 14.9117 1.0541C15.1896 0.939105 15.4963 0.881605 15.8125 0.881605C17.135 0.881605 18.2084 1.95494 18.2084 3.27744V3.54577C18.3617 3.51702 18.5246 3.49785 18.6875 3.49785C20.01 3.49785 21.0834 4.57119 21.0834 5.89369V19.1666C21.0834 21.2845 19.3679 22.9999 17.25 22.9999ZM3.96752 14.6433L9.58335 20.4891C9.94752 20.8629 10.4459 21.0833 10.9634 21.0833H17.25C18.3042 21.0833 19.1667 20.2208 19.1667 19.1666V5.89369C19.1667 5.62535 18.9559 5.41452 18.6875 5.41452C18.4192 5.41452 18.2084 5.62535 18.2084 5.89369V11.4999H16.2917V3.27744C16.2917 3.0091 16.0809 2.79827 15.8125 2.79827C15.5442 2.79827 15.3334 3.0091 15.3334 3.27744V11.4999H13.4167V2.40535C13.4167 2.13702 13.2059 1.92619 12.9375 1.92619C12.6692 1.92619 12.4584 2.13702 12.4584 2.40535V11.4999H10.5417V4.59035C10.5417 4.32202 10.3309 4.11119 10.0625 4.11119C9.79419 4.11119 9.58335 4.3316 9.58335 4.59035V16.9241L4.45627 14.212L3.96752 14.6433Z" fill="#2D3748"/>
  </g>
  <defs>
    <clipPath id="clip0_252_18779">
      <rect width="23" height="23" fill="white"/>
    </clipPath>
  </defs>
  </svg>`,
  testQuiz: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H18C19.1 18 20 17.1 20 16V2C20 0.9 19.1 0 18 0ZM18 16H2V2H18V16Z" fill="#2D3748"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.41 7.42L15.99 6L12.82 9.17L11.41 7.75L10 9.16L12.82 12L17.41 7.42Z" fill="#2D3748"/>
  <path d="M8 4H3V6H8V4Z" fill="#2D3748"/>
  <path d="M8 8H3V10H8V8Z" fill="#2D3748"/>
  <path d="M8 12H3V14H8V12Z" fill="#2D3748"/>
  </svg>`,
  exam: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_252_18787)">
    <path d="M12.45 16H14.54L9.42996 3H7.56996L2.45996 16H4.54996L5.66996 13H11.31L12.45 16ZM6.42996 11L8.49996 5.48L10.57 11H6.42996ZM21.59 11.59L13.5 19.68L9.82996 16L8.41996 17.41L13.51 22.5L23 13L21.59 11.59Z" fill="#2D3748"/>
  </g>
  <defs>
    <clipPath id="clip0_252_18787">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
  </svg>`,
  seminarWorkshop: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_252_18791)">
    <path d="M12 5C8.13 5 5 8.13 5 12H7C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12H19C19 8.13 15.87 5 12 5ZM13 14.29C13.88 13.9 14.5 13.03 14.5 12C14.5 10.62 13.38 9.5 12 9.5C10.62 9.5 9.5 10.62 9.5 12C9.5 13.02 10.12 13.9 11 14.29V17.59L7.59 21L9 22.41L12 19.41L15 22.41L16.41 21L13 17.59V14.29ZM12 1C5.93 1 1 5.93 1 12H3C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12H23C23 5.93 18.07 1 12 1Z" fill="#2D3748"/>
  </g>
  <defs>
    <clipPath id="clip0_252_18791">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
  </svg>`,
};
const deliveryTypeEnum = {
  0: deliveryIconMap.assignmentLab,
  1: deliveryIconMap.conceptLecture,
  2: deliveryIconMap.guideReview,
  3: deliveryIconMap.testQuiz,
  4: deliveryIconMap.exam,
  5: deliveryIconMap.seminarWorkshop,
};
const statusEnum = {
  0:"Inactive",
  1:"Active",
  2:"Draft"
};
const levelEnum = {
  0:"Low",
  1:"Medium",
  2:"High"
};
const deliveryMethodEnum = {
  0: "Offline",
  1: "Online"
};
function generateContentMaterial(day,unit,content,materials) {
  var contentMaterial = `<dialog class="add-material-dialog p-0 overflow-x-hidden" style="min-width:50%; border-radius:10px">
<table class="table m-0">
    <thead class="table-dark">
        <th class="text-center">
            <div class="d-flex flex-row align-items-center">
                <span class="flex-grow-1 fs-4">${"Day "+day.dayNumber}</span>
                <button class="btn close-material-dialog-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_46_6114)"><path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" fill="white" /></g><defs><clipPath id="clip0_46_6114"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
                </button>
            </div>
        </th>
    </thead>
    <tbody>
        <tr>
            <td>
                <div class="material-main">
                    <div class="material-unit-name">
                        <h5>${"Unit "+ unit.unitNumber + " : " + unit.unitTitle}</h5>
                        <h6 class="ms-2">${content.name}</h6>
                    </div>`;
                    materials.forEach(material => {
                      contentMaterial+=`<div class="material-list">
                      <div class="material-link m-3 row">
                          <a class="col" href="${material.$type==="Url" ? material.content.url : "Put file here" }">${material.title}</a>
                          <span class="col text-right">by ${material.owner} on ${material.createdDate}</span>
                      </div>
                      </div>`;
                      });
                contentMaterial+=`</div>
            </td>
        </tr>
    </tbody>
</table>
</dialog>`;
return contentMaterial;
}
function generateUnitContent(day,unit,content) {
  let unitContent = `<li class="d-flex flex-row my-1 p-1 overflow-x-scroll" style="border-radius: 10px; background-color: lightgray;">
    <span class="flex-grow-1 my-auto ms-2 fw-medium text-nowrap">${content.name}</span>
    <span class="flex-shrink-1 mx-1 pill-button fw-medium text-nowrap overflow-x-hidden">${content.outputStandard}</span>
    <span class="flex-grow-1 mx-1 pill-button fw-medium text-nowrap">${content.trainingTime + " minute(s)"}</span>
    <span class="flex-shrink-1 mx-1 pill-button fw-medium">${deliveryMethodEnum[content.deliveryMethod]}</span>
    <span class="flex-shrink-1">
      <button class="btn" disabled style="border: 0px">
        ${deliveryTypeEnum[content.deliveryType]}
      </button>
    </span>
    <span class="flex-shrink-1">
        <button class="add-material-btn btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM17.5 12.12V15.5H14.5V10.5H15.88L17.5 12.12ZM13 9V17H19V11.5L16.5 9H13Z" fill="#2D3748" /></svg>
        </button>`;
        unitContent += generateContentMaterial(day,unit,content,content.materials);
    unitContent += `</span>
</li>`;
  return unitContent;
}
function generateDayUnit(day,unit) {
  let dayUnit = `<li class="row mt-0 m-3" style="border-bottom:1px solid;">
    <div class="col-md-1 col-2 fw-bold fs-5 text-nowrap">${"Unit " + unit.unitNumber}</div>
    <div class="col-md-11 col-10 row me-0 pe-0">
        <div class="col-11">
            <div class="fw-bold fs-5">${unit.unitTitle}</div>
            ${(unit.trainingTime/60).toFixed(2) + " Hour(s)"}
        </div>
        <div class="col-1 me-0 pe-0 text-end">
            <button class="btn" data-bs-toggle="collapse" data-bs-target="#collapse-unit-${unit.unitNumber}" aria-expanded="false" aria-controls="collapse-unit-${unit.unitNumber}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_252_20185)"><path d="M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 15L8 11H16L12 15Z" fill="#2D3748" /></g><defs><clipPath id="clip0_252_20185"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
            </button>
        </div>
        <ul class="col-12 collapse show" id="collapse-unit-${unit.unitNumber}">`;
  unit.contents.forEach(content => {
    dayUnit += generateUnitContent(day,unit,content);
  });
  dayUnit += `
        </ul>
    </div>
</li>`;
  return dayUnit;
}
function generateSyllabusDay(day) {
  let syllabusDay = `<li class="mb-3 mx-2">
    <div class="input-group input-group-lg">
        <button class="btn btn-dark flex-grow-1 text-start" type="button"
            data-bs-toggle="collapse" data-bs-target="#day-${day.dayNumber}-content"
            aria-expanded="false" aria-controls="day-${day.dayNumber}-content" id="headingOne">
            ${"Day " + day.dayNumber}
        </button>
    </div>
    <div class="collapse show" id="day-${day.dayNumber}-content" style="border:1px solid gray;border-radius:5px; box-shadow: 5px 5px 5px;">
        <ul class="list-group list-group-flush my-3">`;
  day.units.forEach(unit => {
    console.log(unit);
    syllabusDay += generateDayUnit(day,unit);
  });
  syllabusDay += `
  </ul>
  </div>
</li>`;
  return syllabusDay;
}
function generateSyllabusDays(syllabus) {
  var syl = `<ul id="syllabus-days-box" class="p-0 m-2" style="list-style-type: none; border: 1px solid;border-radius:10px ">
  <li class="bg-black py-2 mb-3" style="border-radius: 10px 10px 0px 0px"></li>`;
  syllabus.days.forEach(day => {
    console.log(day);
    syl += generateSyllabusDay(day);
  });
  syl += `
    <li class="bg-black py-2" style="border-radius: 0px 0px 10px 10px"></li>
</ul>`;
  return syl;
}
$(document).ready(function () {
  $("#form-syllabus-id").on("submit", function (e) {
    e.preventDefault();
    let arr = $(this).serializeArray();
    getSyllabus(arr[0].value)
    .then(syllabus => {
      $("#containersy").html(generateSyllabusDays(syllabus));
  });
  });
  $(document).on("click", ".add-material-btn", (e) => {
    e.preventDefault();
    console.log(e);
    e.currentTarget.nextElementSibling.showModal();
    e.currentTarget.nextElementSibling.classList.add("show-dialog");
  })
  $(document).on("click", ".close-material-dialog-button", (e) => {
    e.currentTarget.closest(".syllabus-material-dialog").close();
  });
});