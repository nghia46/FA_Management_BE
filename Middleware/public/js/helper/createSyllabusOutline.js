import { downloadMaterial, uploadMaterial } from "../Services/learningMaterial.service.js";
function init(userId) {
  $("#content-2").html(generateSyllabusDays());
  $(document).on("click", ".file-material-download-link", (e) => {
    e.preventDefault();
    let fileHash = e.currentTarget.getAttribute("data-file-hash");
    let fileName = e.currentTarget.getAttribute("data-file-name");
    let downloadModel = {
      "fileHash": fileHash,
      "fileName": fileName
    };
    downloadMaterial(downloadModel)
      .then(response => {
        let blob = new Blob([response], { type: "application/octet-stream" });
        let url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error(err);
      });
  });
  $(document).on("click", ".add-material-btn", (e) => {
    e.preventDefault();
    e.currentTarget.nextElementSibling.showModal();
    e.currentTarget.nextElementSibling.classList.add("show-dialog");
  });
  $("#syllabus-add-day-btn").click(function (e) {
    e.preventDefault();
    let currentElement = e.currentTarget.closest("li#syllabus-add-day");
    e.currentTarget.closest("ul#syllabus-day-list").insertBefore(generateSyllabusDay(), currentElement);
    updateDayNumber();
  });
  $(document).on("click", ".create-new-unit-button", (e) => {
    e.preventDefault();
    let thisEntry = e.currentTarget.closest('li');
    let thisList = e.currentTarget.closest('ul.syllabus-unit-list');
    thisList.insertBefore(generateDayUnit(), thisEntry);
    updateUnitNumber();
  });
  $(document).on("click", ".add-content-btn", (e) => {
    e.preventDefault();
    let currentUnit = e.currentTarget.closest('li.syllabus-unit');
    let currentList = e.currentTarget.closest("ul.syllabus-content-list");
    let currentElement = e.currentTarget.closest("li.add-content-btn-entry");
    let dialogPromise = new Promise(function (resolve, reject) {
      $("#add-content-dialog")[0].showModal();
      $("#add-content-form")[0].reset();
      $("#add-content-form").on("submit", function (event) {
        $("#add-content-form").off("submit");
        event.preventDefault();
        let arr = $(this).serializeArray();
        $("#add-content-dialog")[0].close();
        resolve(arr);
      });
      $(".close-add-lesson-dialog-button").on("click", function (e) {
        $(".close-add-lesson-dialog-button").off("click");
        e.preventDefault();
        $("#add-content-dialog")[0].close();
        reject("Dialog is closed");
      });
    });
    dialogPromise
      .then(function (arr) {
        let content = {};
        arr.forEach(nameValue => {
          if (nameValue.name === "deliveryMethod") {
            content[nameValue.name] = "1";
          } else {
            content[nameValue.name] = nameValue.value;
          }
        });
        if (content.deliveryMethod === undefined) {
          content.deliveryMethod = "0";
        }
        currentList.insertBefore(generateUnitContent(content), currentElement);
        updateUnitTrainingTime(currentUnit);
      })
      .catch(function (e) {
        console.error(e);
      });
  });
  $(document).on("click", ".show-material-dialog-btn", (e) => {
    e.preventDefault();
    let currentDay = $(e.currentTarget).closest("li.syllabus-day").find("button.syllabus-day-header").text();
    let currentUnitNumber = $(e.currentTarget).closest("li.syllabus-unit").find(".syllabus-unit-number").text();
    let currentUnitTitle = $(e.currentTarget).closest("li.syllabus-unit").find(".syllabus-unit-title-input").val();
    let dialog = $(e.currentTarget).next("dialog");
    dialog.find(".material-dialog-unit-header").text(`${currentUnitNumber} : ${currentUnitTitle}`);
    dialog.find(".material-dialog-day-header").text(`${currentDay}`);
    dialog[0].showModal();
  });
  $(document).on("click", ".close-add-material-dialog-btn", (e) => {
    e.preventDefault();
    e.currentTarget.closest(".syllabus-material-dialog").close();
  });
  $(document).on("click", ".syllabus-remove-day-btn", function (e) {
    e.preventDefault();
    e.currentTarget.closest(".syllabus-day").remove();
    updateDayNumber();
    updateUnitNumber();
  });
  $(document).on("click", ".open-upload-material-dialog-btn", function (e) {
    e.preventDefault();
    let currentList = e.currentTarget.closest(".syllabus-material-list");
    let currentEntry = e.currentTarget.closest(".add-new-material-list-entry");
    $("#upload-material-form")[0].reset();
    $("#upload-type-file").addClass("d-none");
    $("#upload-material-file").prop("disabled", true);
    $("#upload-type-link").removeClass("d-none");
    $("#link-material-url").prop("disabled", false);
    $("#upload-material-dialog")[0].showModal();
    let materialPromise = new Promise((resolve, reject) => {
      $("#upload-material-form").on("submit", (e) => {
        e.preventDefault();
        $("#upload-material-form").off("submit");
        let formdata = new FormData(e.currentTarget);
        if (formdata.get("$type") === "Url") {
          let material = {
            title: formdata.get("materialTitle"),
            owner: userId,
            createdDate: new Date().toLocaleDateString("sv"),
            content: {
              $type: "Url",
              url: formdata.get("materialUrl")
            }
          };
          $("#upload-material-dialog")[0].close();
          resolve(material);
        } else if (formdata.get("$type") === "File") {
          let title = formdata.get("materialTitle");
          let fileObj = formdata.get("materialFile");
          formdata = new FormData();
          formdata.set("file", fileObj);
          uploadMaterial(formdata)
            .then(res => {
              let material = {
                title: title,
                owner: userId,
                createdDate: new Date().toLocaleDateString("sv"),
                content: {
                  $type: "File",
                  fileName: fileObj.name,
                  fileHash: res
                }
              };
              $("#upload-material-dialog")[0].close();
              resolve(material);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject();
        }
      });
      $(".close-upload-material-dialog").on("click",(event) => {
        $(".close-upload-material-dialog").off("click");
        $("#upload-material-dialog")[0].close();
        reject("Dialog is closed");
      });
    });
    materialPromise
      .then(res => {
        currentList.insertBefore(generateContentMaterial(res), currentEntry);
      })
      .catch(err => {
        console.error(err);
      });
  });
  $(document).on("click", ".delete-content-button", (e) => {
    let clickedBtn = e.currentTarget;
    let currentUnit = clickedBtn.closest("li.syllabus-unit");
    clickedBtn.closest("li.syllabus-content").remove();
    updateUnitTrainingTime(currentUnit);
  });
  $(document).on("click", ".remove-syllabus-unit-button", (e) => {
    e.currentTarget.closest("li.syllabus-unit").remove();
    updateUnitNumber();
  });
  $(document).on("change", "input.syllabus-unit-title-input", (e) => {
    let currentUnit = e.currentTarget.closest("li.syllabus-unit");
    let newTitle = e.currentTarget.value;
    $(currentUnit).attr("data-unit-title", newTitle);
  });
  $(document).on("click",".delete-material-btn", (e) => {
    e.currentTarget.closest("li.content-material").remove();
  });
};
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
const deliveryMethodEnum = {
  0: "Offline",
  1: "Online"
};
function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function generateContentMaterial(material) {
  let dataPart = `data-material-content-type="${material.content.$type}"
                    data-material-title="${material.title}"
                    data-material-owner="${material.owner}"
                    data-material-created-date="${material.createdDate}"
    `;
  let urlDataParts = dataPart + `
                      data-material-content-url="${material.content.url}"`;

  let fileDataParts = dataPart + `
                        data-material-content-filehash="${material.content.fileHash}"
                        data-material-content-filename="${material.content.fileName}"`;

  let urlAnchor = `<a class="flex-grow-1" target="_blank" href="${material.content.url}">${material.title}</a>`;
  let fileAnchor = `<a class="flex-grow-1 file-material-download-link" data-file-hash="${material.content.fileHash}" data-file-name="${material.content.fileName}" href="">${material.title}</a>`;

  let contentMaterial = `<li class="content-material" ${material.content.$type === "Url" ? urlDataParts : fileDataParts}>
                            <div class="material-link d-flex align-items-center">
                            ${material.content.$type === "Url" ? urlAnchor : fileAnchor}
                            <span class="flex-shrink-1">by ${material.owner} on ${material.createdDate}</span>
                                <span class="material-edit-delete flex-shrink-1 text-nowrap">
                                    <button class="btn delete-material-btn">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3508_2403)"><path d="M14.12 10.47L12 12.59L9.87 10.47L8.46 11.88L10.59 14L8.47 16.12L9.88 17.53L12 15.41L14.12 17.53L15.53 16.12L13.41 14L15.53 11.88L14.12 10.47ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5ZM6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9Z" fill="#2D3748"/></g><defs><clipPath id="clip0_3508_2403"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
                                    </button>
                                </span>
                            </div>
                        </li>`;
  let parser = new DOMParser();
  let doc = parser.parseFromString(contentMaterial, "text/html");
  return doc.body.firstChild;
}
function generateUnitContent(content) {
  let unitContent = `<li data-content-name="${content.name}" 
                           data-content-output-standard="${content.outputStandard}"
                           data-content-training-time="${content.trainingTime}" 
                           data-content-delivery-method="${content.deliveryMethod}"
                           data-content-delivery-type="${content.deliveryType}"
                           class="syllabus-content d-flex flex-row my-1 p-1 overflow-y-scroll " style="border-radius: 10px; background-color: lightgray;">
      <span class="flex-grow-1 my-auto ms-2 fw-medium">${content.name}</span>
      <span class="flex-shrink-1 mx-2 btn btn-dark fw-medium">${content.outputStandard}</span>
      <span class="flex-shrink-1 mx-2 btn fw-medium text-nowrap">${content.trainingTime + " min(s)"}</span>
      <span class="flex-shrink-1 mx-2 btn fw-medium">${deliveryMethodEnum[content.deliveryMethod]}</span>
      <span class="flex-shrink-1">
        <button class="btn" disabled style="border: 0px">
          ${deliveryTypeEnum[content.deliveryType]}
        </button>
      </span>
      <span class="flex-shrink-1">
          <button class="show-material-dialog-btn btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM17.5 12.12V15.5H14.5V10.5H15.88L17.5 12.12ZM13 9V17H19V11.5L16.5 9H13Z" fill="#2D3748" /></svg>
          </button>
  
          <dialog class="syllabus-material-dialog p-0" style="width: 50%; border-radius:20px">
              <table class="table m-0">
                  <thead class="table-dark">
                      <th class="text-center">
                          <div class="d-flex flex-row align-items-center">
                            <span class="flex-grow-1 material-dialog-day-header"></span>
                            <button class="btn close-add-material-dialog-btn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_46_6114)"><path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.59 7L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7Z" fill="white" /></g><defs><clipPath id="clip0_46_6114"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
                            </button>
                          </div>
                      </th>
                  </thead>
                  <tbody>
                    <tr>
                        <td>
                            <div class="material-unit-name">
                                <h5 class="material-dialog-unit-header"></h5>
                                <h6 class="ms-2">${content.name}</h6>
                            </div>
                            <ul class="syllabus-material-list" method="dialog" style="list-style-type: none;">
  
  
                                <li class="add-new-material-list-entry col-12 text-center">
                                    <button class="btn btn-primary open-upload-material-dialog-btn">Upload new</button>
                                </li>
                            </ul>
                        </td>
                      </tr>
                  </tbody>
                </table>
            </dialog>
      </span>
      <span class="flex-shrink-1">
        <button class="delete-content-button btn btn-outline-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_252_18665)"><path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#E74A3B"></path></g><defs><clipPath id="clip0_252_18665"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
        </button>
      </span>
  </li>`;
  let parser = new DOMParser();
  let doc = parser.parseFromString(unitContent, 'text/html')
  return doc.body.firstChild;
}
function generateDayUnit() {
  let guid = generateGUID();
  let dayUnit = `
    <li data-unit-title="" data-unit-training-time="" class="syllabus-unit mt-0 m-3" style="border-bottom:1px solid;">
      <div class="d-flex flex-row align-items-center">
        <div class="syllabus-unit-number fw-bold fs-5 text-nowrap me-2"></div>
        <input type="text" class="syllabus-unit-title-input fw-bold fs-5 form-control form-control-sm" value="" placeholder="Unit name"></input>
        <button class="btn btn-outline-danger remove-syllabus-unit-button" flex-shrink-1>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_252_18665)"><path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#E74A3B" /></g><defs><clipPath id="clip0_252_18665"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
        </button>
        <button class="btn" data-bs-toggle="collapse" data-bs-target="#${"unit-" + guid}" aria-expanded="false" aria-controls="${"unit-" + guid}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_252_20185)"><path d="M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 15L8 11H16L12 15Z" fill="#2D3748" /></g><defs><clipPath id="clip0_252_20185"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
        </button>
      </div>
      <p class="unit-training-time ps-3 m-0">0 hour</p>
      <div class="collapse show" id="${"unit-" + guid}">
        <ul class="syllabus-content-list" style="list-style-type: none;">


          <li class="add-content-btn-entry d-flex flex-row my-1 p-1">
            <button class="add-content-btn btn-secondary btn" style="width: 100%;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_252_18699)"><path d="M13 7H11V11H7V13H11V17H13V13H17V11H13V7ZM12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#DFDEDE" /></g><defs><clipPath id="clip0_252_18699"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
              Add content
            </button>
          </li>
        </ul>
      </div>
    </li>`;
  let parser = new DOMParser();
  let doc = parser.parseFromString(dayUnit, 'text/html')
  return doc.body.firstChild;
}
function generateSyllabusDay() {
  let guid = generateGUID();
  let syllabusDay = `
    <li class="mx-2 mb-1 syllabus-day">
      <div class="input-group input-group-lg">
          <button class="syllabus-day-header btn btn-dark flex-grow-1 text-start" type="button"
              data-bs-toggle="collapse" data-bs-target="#${"day-" + guid}"
              aria-expanded="false" aria-controls="${"day-" + guid}" id="headingOne">
          </button>
          <button class="btn btn-outline-danger syllabus-remove-day-btn"> 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_252_18665)"><path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#E74A3B" /></g><defs><clipPath id="clip0_252_18665"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
          </button>
      </div>
      <div class="collapse show" id="${"day-" + guid}" style="border:1px solid gray;border-radius:5px; box-shadow: 5px 5px 5px;">
        <ul class="syllabus-unit-list my-3 ps-0" style="list-style-type: none;">
  
          <li class="create-new-unit-entry p-2 mt-0 mx-3">
            <button class="btn btn-secondary create-new-unit-button">Add unit</button>
          </li>
        </ul>
      </div>
    </li>`;
  let parser = new DOMParser();
  let doc = parser.parseFromString(syllabusDay, 'text/html')
  return doc.body.firstChild;

}
function generateSyllabusDays() {
  var syl = `<ul id="syllabus-day-list" class="overflow-y-scroll py-2 px-0 m-2" style="max-height:50vh;list-style-type: none; border:solid gray;border-width:10px 1px;border-radius:10px ">
    <li id="syllabus-add-day" class="mb-1 mx-2">
          <button id="syllabus-add-day-btn" class="btn btn-dark text-nowrap ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_252_18706)"><path d="M13 7H11V11H7V13H11V17H13V13H17V11H13V7ZM12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#DFDEDE" /></g><defs><clipPath id="clip0_252_18706"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
              Add day
          </button>
      </li>
  </ul>`;
  return syl;
}
function updateUnitNumber() {
  $(".syllabus-unit").each((index, value) => {
    $(value).find(".syllabus-unit-number").text("Unit " + (index + 1));
  });
}
function updateDayNumber() {
  $(".syllabus-day").each((index, value) => {
    $(value).find(".syllabus-day-header").text("Day " + (index + 1));
  });
}
function updateUnitTrainingTime(currentUnitLi) {
  let trainingTime = 0;
  $(currentUnitLi).find(".syllabus-content").each((index, value) => {
    trainingTime += parseInt($(value).attr("data-content-training-time"));
  });
  $(currentUnitLi).find("p.unit-training-time").text(`${(trainingTime / 60).toFixed(1) + " hour(s)."}`);
  $(currentUnitLi).attr("data-unit-training-time", trainingTime);
}
function getSyllabusOutlineData() {
  $(".syllabus-unit").each((index, value) => {
    $(value).attr("data-unit-number", (index + 1));
  });
  let days = [];
  $("#syllabus-day-list").children(".syllabus-day").each((dIdx, dEl) => {
    let day = {};
    day.dayNumber = dIdx + 1;
    day.units = [];
    let unitList = $(dEl).find(".syllabus-unit-list")[0];
    $(unitList).children(".syllabus-unit").each((uIdx, uEl) => {
      let unit = {};
      unit.unitNumber = parseInt($(uEl).attr("data-unit-number"));
      unit.unitTitle = $(uEl).attr("data-unit-title");
      unit.contents = [];
      let contentList = $(uEl).find(".syllabus-content-list")[0];
      $(contentList).children(".syllabus-content").each((cIdx, cEl) => {
        let content = {};
        content.name = $(cEl).attr("data-content-name");
        content.outputStandard =$(cEl).attr("data-content-output-standard");
        content.trainingTime = parseInt($(cEl).attr("data-content-training-time"));
        content.deliveryMethod = parseInt(parseInt($(cEl).attr("data-content-delivery-method")));
        content.deliveryType = parseInt($(cEl).attr("data-content-delivery-type"));
        content.materials = [];
        let materialList = $(cEl).find(".syllabus-material-list")[0];
        $(materialList).children(".content-material").each((mIdx, mEl) => {
          let material = {};
          let materialType = $(mEl).attr("data-material-content-type");
          material.title = $(mEl).attr("data-material-title");
          material.owner = $(mEl).attr("data-material-owner");
          material.createdDate = $(mEl).attr("data-material-created-date");
          material.content = {};
          material.content.$type = materialType;
          if (materialType === "Url") {
            material.content.url = $(mEl).attr("data-material-content-url");
          } else if (materialType === "File") {
            material.content.fileName = $(mEl).attr("data-material-content-filename");
            material.content.fileHash = $(mEl).attr("data-material-content-filehash");
          }
          content.materials.push(material);
        });
        unit.contents.push(content);
      });

      day.units.push(unit);
    });
    days.push(day);
  });
  return days;
}
function loadSyllabusOutline(outline) {
  $("#containersy").html(generateSyllabusDays());
  outline.forEach(day => {
    let htmlDay = generateSyllabusDay();
    day.units.forEach(unit => {
      let htmlUnit = generateDayUnit(unit.unitTitle);
      $(htmlUnit).find("input.syllabus-unit-title-input").val(unit.unitTitle);
      unit.contents.forEach(content => {
        let parsedContent = {
          name: content.name,
          outputStandard: content.outputStandard,
          trainingTime: content.trainingTime,
          deliveryMethod: content.deliveryMethod,
          deliveryType: content.deliveryType,
        }
        let htmlContent = generateUnitContent(parsedContent);
        content.materials.forEach(material => {
          let htmlmaterial = generateContentMaterial(material);
          $(htmlContent).find("ul.syllabus-material-list")[0].insertBefore(htmlmaterial, $(htmlContent).find("ul.syllabus-material-list .add-new-material-list-entry")[0]);
        });
        $(htmlUnit).find("ul.syllabus-content-list")[0].insertBefore(htmlContent, $(htmlContent).find("ul.syllabus-content-list li.add-content-btn-entry")[0]);
      });
      $(htmlDay).find("ul.syllabus-unit-list")[0].insertBefore(htmlUnit, $(htmlDay).find("ul.syllabus-unit-list li.create-new-unit-entry")[0]);
      updateUnitTrainingTime(htmlUnit); 
    });
    $("#syllabus-day-list")[0].insertBefore(htmlDay, $("#syllabus-add-day")[0])
  });
  updateDayNumber();
  updateUnitNumber();
}
function checkSyllabusDays(days) {
  let check = true;
  days.forEach(day => {
    let dayTrainingTime = 0;
    day.units.forEach(unit => {
      let unitTrainingTime = 0;
      unit.contents.forEach(content => {
        unitTrainingTime += content.trainingTime;
      });
      dayTrainingTime += unitTrainingTime;
    });
    if (dayTrainingTime > 8 * 60) {
      check=false;
    }
  });
  return check;
}
export { init, getSyllabusOutlineData, loadSyllabusOutline, checkSyllabusDays }