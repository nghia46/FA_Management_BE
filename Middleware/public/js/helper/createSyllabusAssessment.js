function init() {
    // Event handler for assessment scheme percent input changes
    $(document).on("change", "input.assessment-scheme-percent", function (e) {
        e.preventDefault();
        let parentList = $(e.currentTarget).closest("ul#assessment-scheme-list");
        let inputList = parentList.find("input.assessment-scheme-percent");
        let currentPercentage = parseInt($(e.currentTarget).val());
        let percentage = 0;
        inputList.each((index, value) => {
            percentage += $(value).val() == "" ? 0 : parseInt($(value).val());
        });
        if (percentage == 100) {
            $("#add-assessment-btn").attr("disabled", true).addClass("d-none");
        } else if (percentage < 100) {
            $("#add-assessment-btn[disabled].d-none").prop("disabled", false).removeClass("d-none");
        } else {
            alert("Percentage exceeded 100%");
            let newPercentage = 100 - percentage + currentPercentage;
            $(e.currentTarget).val(newPercentage > 0 ? newPercentage : "");
        }
    });
    // Event handler for scheme component percent input changes
    $(document).on("change", "input.scheme-component-percent", function (e) {
        e.preventDefault();
        let parentList = $(e.currentTarget).closest("ul.scheme-component-list");
        let inputList = parentList.find("input.assessment-component-percent");
        let currentPercentage = parseInt($(e.currentTarget).val());
        let percentage = 0;
        inputList.each((index, value) => {
            percentage += $(value).val() == "" ? 0 : parseInt($(value).val());
        });
        if (percentage == 100) {
            parentList.find(".add-new-component-btn").attr("disabled", true).addClass("d-none");
        } else if (percentage < 100) {
            parentList.find(".add-new-component-btn[disabled].d-none").prop("disabled", false).removeClass("d-none");
        } else {
            alert("Percentage exceeded 100%");
            let newPercentage = 100 - percentage + currentPercentage;
            $(e.currentTarget).val(newPercentage > 0 ? newPercentage : "");
            parentList.find(".add-new-component-btn").attr("disabled", true).addClass("d-none");
        }
    });
    // Event handler for adding assessment option form submission
    $("#add-assessment-btn").click(function (e) {
        e.preventDefault();
        insertAssessmentScheme();
    });
    // Event handler for adding component option form submission
    $(document).on("click", ".add-new-component-btn", function (e) {
        e.preventDefault();
        insertComponentEntry($(e.currentTarget).closest("li.add-new-component-entry")[0]);
    });
    // Event handler for removing assessment scheme
    $(document).on('click', ".remove-assessment-scheme-btn", function (e) {
        e.preventDefault();
        let parentList = $(e.currentTarget).closest("ul#assessment-scheme-list");
        $(e.currentTarget).closest('li.assessment-scheme').remove();
        let inputList = parentList.find("input.assessment-scheme-percent");
        let percentage = 0;
        inputList.each((index, value) => {
            percentage += parseInt($(value).val());
        });
        if (percentage < 100) {
            $("#add-assessment-btn[disabled].d-none").prop("disabled", false).removeClass("d-none");
        }
    });
    // Event handler for removing scheme component
    $(document).on('click', ".remove-scheme-component-btn", function (e) {
        e.preventDefault();
        let parentList = $(e.currentTarget).closest("ul.scheme-component-list");
        $(e.currentTarget).closest('li.scheme-component').remove();
        let inputList = parentList.find("input.assessment-component-percent");
        let percentage = 0;
        inputList.each((index, value) => {
            percentage += parseInt($(value).val());
        });
        if (percentage < 100) {
            parentList.find(".add-new-component-btn[disabled].d-none").prop("disabled", false).removeClass("d-none");
        }
    });
}
function insertAssessmentScheme() {
    let newEntry = `
  <li class="assessment-scheme ms-2 mb-1 p-1" style="border-radius:5px; background-color:lightgray">
          <div class="input-group flex-nowrap">
              <input type="text" class="assessment-scheme-category form-control fw-bolder" style="max-width:70%;min-width:100px;" 
                  placeholder="Enter assessment category" required>
              <input type="number" class="assessment-scheme-percent form-control fw-bolder" style="max-width:20%;min-width:100px;" 
                  placeholder="Percentage" required min="1" max="100" step="1">
              <span class="input-group-text assessment-scheme-percent-text">%</span>
              <button class="remove-assessment-scheme-btn btn btn-danger text-nowrap" style="width:fit-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_184_16086)"><path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#fff"/></g><defs><clipPath id="clip0_184_16086"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>                  
              </button> 
          </div>
      <ul class="scheme-component-list row" style="list-style-type: none;">
          
          <li class="add-new-component-entry mt-1 col-12 col-lg-4">
            <button class="add-new-component-btn btn btn-secondary btn-sm">New component</button>
          </li>
      </ul>
  </li>
`;
    let newDom = new DOMParser().parseFromString(newEntry, "text/html").body.firstChild;
    let parentList = $("ul#assessment-scheme-list");
    let lastEntry = $("li#add-new-assessment-entry")[0];
    parentList[0].insertBefore(newDom, lastEntry);
}
function insertComponentEntry(lastLiElement) {
    let newEntry = `
  <li class="scheme-component mt-1 col-12 col-xl-6">
      <div class="input-group input-group-sm flex-nowrap">
          <input type="text" class="assessment-component-name form-control" placeholder="Component"}" style="max-width:70%;min-width:100px" required>
          <input type="number" class="assessment-component-percent form-control scheme-component-percent" placeholder="Percentage" style="max-width:20%;min-width:100px" required min="1" max="100" step="1">
          <span class="input-group-text scheme-component-percent-text">%</span>
          <button class="remove-scheme-component-btn btn btn-outline-danger" style="width:fit-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_184_16086)"><path d="M7 11V13H17V11H7ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#f77"/></g><defs><clipPath id="clip0_184_16086"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
          </button>
      </div>
  </li>
`;
    let newDom = new DOMParser().parseFromString(newEntry, "text/html").body.firstChild;
    let parentList = $(lastLiElement).closest("ul.scheme-component-list")[0];
    parentList.insertBefore(newDom, lastLiElement);
}
function getAssessmentScheme() {
    let isValid = true;
    let assessmentSchemes = [];
    let schemePercent = 0;

    $("#assessment-scheme-list").children("li.assessment-scheme").each(function (index, value) {
        let assessmentScheme = {};
        let assessmentSchemeCategory = $(value).find("input.assessment-scheme-category").val();
        if (assessmentSchemeCategory == "") {
            $(value).find("input.assessment-scheme-category").addClass("is-invalid");
            isValid = false;
        }
        assessmentScheme.category = assessmentSchemeCategory;
        let currentSchemePercentInput = $(value).find("input.assessment-scheme-percent").val();
        if (currentSchemePercentInput == "") {
            $(value).find("input.assessment-scheme-percent").addClass("is-invalid");
            isValid = false;
        }
        let currentSchemePercent = parseInt(currentSchemePercentInput);
        schemePercent += currentSchemePercent;
        if (schemePercent > 100) {
            Toastify({
                text: "Total assessment schemes percentage is over 100%",
                duration: 5000,
                offset:{y:100},
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "red",
                }
              }).showToast();
            isValid = false;
        }
        assessmentScheme.percentage = currentSchemePercent;
        let components = [];
        let componentPercent = 0;
        let componentList = $(value).children("ul.scheme-component-list");
        componentList.children("li.scheme-component").each((index, value) => {
            let componentPercentInput = $(value).find("input.assessment-component-percent");
            if (componentPercentInput.val() == "") {
                componentPercentInput.addClass("is-invalid");
                isValid = false;
            }
            let currentComponentPercent = parseInt(componentPercentInput.val());
            componentPercent += currentComponentPercent;
            if (componentPercent > 100) {
                Toastify({
                    text: `Total component percentage of ${assessmentSchemeCategory} is over 100%`,
                    duration: 5000,
                    offset:{y:100},
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                      background: "red",
                    }
                  }).showToast();
                isValid = false;
            }
            let component = {};
            let componentNameInput = $(value).find("input.assessment-component-name");
            if (componentNameInput.val() == "") {
                componentNameInput.addClass("is-invalid");
                isValid = false;
            }
            component.componentName = componentNameInput.val();

            component.percentage = currentComponentPercent;
            components.push(component);
        });
        if (componentPercent < 100) {
            Toastify({
                text: `Total component percentage of ${assessmentSchemeCategory} is under 100%`,
                duration: 5000,
                offset:{y:100},
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "red",
                }
              }).showToast();
            isValid=false;
        }
        assessmentScheme.components = components;
        assessmentSchemes.push(assessmentScheme);
    });

    if (schemePercent < 100) {
        Toastify({
            text: `Total assessment schemes percentage is under 100%`,
            duration: 5000,
            offset:{y:100},
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "red",
            }
          }).showToast();
        isValid = false;
    }
    if (isValid) {
        return assessmentSchemes;
    } else {
        return false; //the assessment is invalid, need to alert
    }
}
function loadAssessmentSchemes(assessments) {
    assessments.forEach(assessment => {
        insertAssessmentScheme();
        let insertedAssessmentScheme = $("li#add-new-assessment-entry").prev("li.assessment-scheme");
        insertedAssessmentScheme.find("input.assessment-scheme-category").val(assessment.category);
        insertedAssessmentScheme.find("input.assessment-scheme-percent").val(assessment.percentage);
        assessment.components.forEach(component=>{
            insertComponentEntry(insertedAssessmentScheme.find("li.add-new-component-entry")[0]);
            let insertedComponent = insertedAssessmentScheme.find("li.add-new-component-entry").prev();
            insertedComponent.find("input.assessment-component-name").val(component.componentName);
            insertedComponent.find("input.assessment-component-percent").val(component.percentage);
        });
    });
}
export { init, getAssessmentScheme, loadAssessmentSchemes };