import { parseJwt, getToken } from "./Services/util.service.js";
import * as syllabusAssessment from "./helper/createSyllabusAssessment.js";
import * as syllabusOutline from "./helper/createSyllabusOutline.js";
import {updateSyllabus,getSyllabus} from "./Services/syllabus.service.js";
//pie chart
$(document).ready(function () {
  const userId = parseJwt(getToken()).Id;
  let syllabusId = localStorage.getItem('syllabusId');
  ClassicEditor
    .create(document.querySelector("#technical-requirement-textarea"), {})
    .then((editor) => { window.technicalReq = editor; })
    .catch((err) => { console.log(err); });
  ClassicEditor
    .create(document.querySelector("#course-objective-input"), {})
    .then((editor) => { window.courseObj = editor; })
    .catch((err) => { console.log(err); });
  ClassicEditor
    .create(document.querySelector("#training-delivery-principle"), {})
    .then((editor) => { window.trainingPri = editor; })
    .catch((err) => { console.log(err); });
  $(document).on("focus", "input.is-invalid", (e) => {
    $(e.currentTarget).removeClass("is-invalid");
  });

  $("#syllabus-save-button").click((e) => {
    e.preventDefault();
    let syllabus = getSyllabusData();
    if (syllabus===false) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Some syllabus information is incorrect. Please verify your data and try again!",
      });
    }
    let checkTrainingTimeEachDay = syllabusOutline.checkSyllabusDays(syllabus.days);
    if (checkTrainingTimeEachDay===false){
      Swal.fire({
        icon: "warning",
        title: "Training time exceeded 8 hours a day",
        text: "Do you want to save as draft and edit later?",
        showDenyButton: true,
        denyButtonText: "Cancel"
      }).then((result)=>{
        if (result.isConfirmed) {
          syllabus.status=2;
          console.log(syllabus);
          updateSyllabus(syllabusId,syllabus).then((result)=>{
            $(".progress-bar").eq(0).css("width", "100%");
            $(".progress-bar").eq(0).css("background-color", "blue");
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Your syllabus has been successfully saved.",
            }).then(()=>{
              window.location.href="syllabus.html";
              localStorage.removeItem('syllabusId');
            });
          }).catch((error)=>{console.log(error);})
        } else if (result.isDenied) {
        }
      });
    } else {
        syllabus.status=1;
        $(".progress-bar").eq(0).css("width", "100%");
        $(".progress-bar").eq(0).css("background-color", "blue");
        updateSyllabus(syllabusId, syllabus).then((result)=>{
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Your syllabus has been successfully saved.",
          }).then(()=>{
            window.location.href="syllabus.html";
            localStorage.removeItem('syllabusId');
          });
        });
      }
  });
  //chart
  Chart.register(ChartDataLabels)
  const durationChartCanvas = document.getElementById("chart");
  window.durationChart = new Chart(durationChartCanvas, {
    type: "pie",
    data: {
      labels: ["Assignment/Lab", "Concept/Lecture", "Guide/Review", "Test/Quiz", "Exam", "Seminar/Workshop"],
      datasets: [{
        data: [1, 0, 0, 0, 0, 0]
      }]
    },
    options: {
      aspectRatio: 2,
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: Chart.defaults.font.size
          }
        },
        datalabels: {
          formatter: (value, ctx) => {
            let sum = 0;
            let dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            let percentage = value == 0 ? "" : (value * 100 / sum).toFixed(1) + "%";
            return percentage;
          },
          color: "#fff"
        }
      }
    }
  });

  $(".tab").each(function (index) {
    $(this).on("click", function (e) {
      e.stopPropagation();
      $(".syllabus-detail").removeClass("col-9");
      $(".tab").removeClass("active");
      $(this).toggleClass("active");
      $(".content").addClass("d-none");
      $(".content").eq(index).removeClass("d-none");

      // Change progress bar
      switch (index) {
        // General
        case 0: {
          $(".previous-btn").eq(0).css("display", "none");
          $(".saving-btn").eq(0).css("justify-content", "flex-end");
          $(".progress-bar").eq(0).css("width", "15%");
          $(".progress-bar").eq(0).css("background-color", "crimson");
          break;
        }
        // Outline
        case 1: {
          const previousBtn = $(".previous-btn").eq(0);
          previousBtn.css("display", "inline-block");
          $(".saving-btn").eq(0).css("justify-content", "space-between");
          previousBtn.on("click", function () {
            $(".tab").eq(0).click();
          });
          $(".progress-bar").eq(0).css("width", "40%");
          $(".progress-bar").eq(0).css("background-color", "coral");
          break;
        }
        // Others
        case 2: {
          const previousBtn = $(".previous-btn").eq(0);
          previousBtn.css("display", "inline-block");
          $(".saving-btn").eq(0).css("justify-content", "space-between");
          previousBtn.on("click", function () {
            $(".tab").eq(1).click();
          });
          $(".progress-bar").eq(0).css("width", "65%");
          $(".progress-bar").eq(0).css("background-color", "yellowgreen");
          updateChartData();
          break;
        }
      }
    });
  });
  let anchor = window.location.hash.substring(1);
  switch (anchor) {
    case "general":
      $(".tab").eq(0).click();
      break;
    case "outline":
      $(".tab").eq(1).click();
      break;
    case "others":
      $(".tab").eq(2).click();
      break;
    default:
      $(".tab").eq(0).click();
  }
  syllabusAssessment.init();
  syllabusOutline.init(userId);
  getSyllabus(syllabusId)
  .then(res=>{
    console.log(res);
    $("input#syllabus-name").val(res.name);
    $("input#syllabus-code").val(res.code);
    $("input#syllabus-version").val(res.version);
    $("select#syllabus-level").val(res.level);
    $("input#syllabus-name").val(res.name);
    $("input#attendee-number").val(res.attendeeQuantity);
    window.technicalReq.setData(res.technicalRequirement);
    window.courseObj.setData(res.objective);
    syllabusOutline.loadSyllabusOutline(res.days);
    syllabusAssessment.loadAssessmentSchemes(res.assessmentSchemes);
    $("input#syllabus-passing-gpa").val(res.passingCriteria);
    window.trainingPri.setData(res.deliveryPrinciple)
    updateChartData();
  })
  .catch(err=>{
    Swal.fire({
      icon: "error",
      text: "An error occurred while loading syllabus with the following id "+syllabusId
    }).then(()=>{
      window.location.href = "syllabus.html";
    });
  });
});
function updateChartData() {
  let data = [];
  for (let i = 0; i < 6; i++) {
    let contentType = $(".syllabus-content[data-content-delivery-type=" + i + "]");
    if (contentType.length == 0) {
      data.push(0);
    } else {
      let sum = 0;
      contentType.each((index, value) => {
        sum += parseInt($(value).attr("data-content-training-time"));
      });
      data.push(sum);
    }
  }
  if (JSON.stringify(data) == JSON.stringify([0, 0, 0, 0, 0, 0]) || JSON.stringify(data) == JSON.stringify([])) {
    data = [1];
  }
  window.durationChart.data.datasets[0].data = data;
  window.durationChart.update();
}
function getSyllabusData() {
  let check = true;
  let isNotified = false;
  let syllabusName = $("input#syllabus-name").val();
  if (syllabusName == "") {
    check = false;
    $("#syllabus-name-feedback").text("Please enter a syllabus name");
    $("input#syllabus-name").addClass("is-invalid");
  }
  let syllabusCode = $("input#syllabus-code").val();
  if (syllabusCode == "") {
    check = false;
    $("#syllabus-code-feedback").text("Please enter a syllabus code");
    $("input#syllabus-code").addClass("is-invalid");
  }
  let syllabusVersion = $("input#syllabus-version").val();
  if (syllabusVersion == "") {
    check = false;
    $("#syllabus-version-feedback").text("Please enter a syllabus version");
    $("input#syllabus-version").addClass("is-invalid");
  }
  let syllabusAttendeeNo = $("input#attendee-number").val();
  if (syllabusAttendeeNo=="" || parseInt(syllabusAttendeeNo) < 1) {
    check = false;
    $("#syllabus-attendeeno-feedback").text("Please enter a valid attendee number");
    $("input#attendee-number").addClass("is-invalid");
  }
  let passingCriteria = $("input#syllabus-passing-gpa").val();
  if (passingCriteria=="" || parseInt(passingCriteria) < 1 ||
  parseInt(passingCriteria) > 100) {
    check = false;
    $("input#syllabus-passing-gpa").addClass("is-invalid");
  }

  let syllabusLevel = parseInt($("select#syllabus-level").val());
  let techReq = window.technicalReq.getData();
  let courseObj = window.courseObj.getData();
  let trainingPri = window.trainingPri.getData();
  let days = syllabusOutline.getSyllabusOutlineData();
  let assessmentScheme = syllabusAssessment.getAssessmentScheme();
  if (assessmentScheme === null) {
    check=false;
    isNotified = true;
  }
  if (assessmentScheme === false || JSON.stringify(assessmentScheme) === JSON.stringify({})){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "There are some invalid input with the syllabus assessment schemes. Please check again!",
    });
    $(".tab").eq(2).click();
    check = false;
  }
  if (check === false) {
    return false;
  }
  let syllabus = {};

  syllabus.name = syllabusName;
  syllabus.code = syllabusCode;
  syllabus.version = syllabusVersion;
  syllabus.technicalRequirement = techReq;
  syllabus.objective = courseObj;
  syllabus.deliveryPrinciple = trainingPri;
  syllabus.attendeeQuantity = parseInt(syllabusAttendeeNo);
  syllabus.passingCriteria = parseInt(passingCriteria);
  syllabus.assessmentSchemes = assessmentScheme;
  syllabus.days = days;
  syllabus.level = syllabusLevel;
  syllabus.status = "";

  console.log(syllabus);
  return syllabus;
}
function loadSyllabusData(syllabus){
  
}
const statusEnum = {
  0: "Inactive",
  1: "Active",
  2: "Draft"
};
const levelEnum = {
  0: "Low",
  1: "Medium",
  2: "High"
};
