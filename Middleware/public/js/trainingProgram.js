import { getTrainingProgram } from "./Services/trainingprogram.service.js";

$(document).ready(function () {
  $("#open-add-program-button").click((e)=>{
    window.location.href = "createProgram.html";
  })
  $("#logoutButton").click(function () {
    // Clear the session storage
    sessionStorage.removeItem("loggedUser");
    // Redirect to the login page or perform any other desired action
    window.location.href = "login.html";
  });
});

$(document).ready(function () {
  // Lấy tham chiếu đến tbody trong bảng
  var tableBody = $("#user-information-table tbody");

  // Gọi hàm getTrainingprogram để lấy dữ liệu
  getTrainingProgram()
    .then(function (trainingPrograms) {
      // Duyệt qua mỗi đối tượng trong dữ liệu trả về
      trainingPrograms.forEach(function (program) {
          // Tạo một chuỗi HTML đại diện cho hàng
          var row = `<tr class="program-row" data-id="${program.id}">
                               <td>${program.id}</td>
                               <td>${program.name}</td>
                               <td>${program.createOn}</td>
                               <td>${program.createBy.name}</td>
                               <td>${program.duration}</td>
                               <td>${
                                 program.status ? "Active" : "Inactive"
                               }</td>
                           </tr>`;

          // Thêm chuỗi HTML vào tbody của bảng
          tableBody.append(row);
          console.log(program.status);
      });
    })
    .catch(function (error) {
      console.error("Error fetching training programs: ", error);
    });
});

$(document).on("click", ".program-row", function(e) {
  var programId = $(this).data("id");
  sessionStorage.setItem("programId", programId);
  window.location.href = `trainingProgramDetail.html`;
});

$(document).ready(function () {
  $("#open-filter-dialog-button").click(function () {
    $("#filter-option-dialog")[0].showModal();
  });
});

$("#cancel-filter-option-dialog-button").click(function (event) {
  $("#filter-option-dialog").removeClass("show-dialog");
  setTimeout(() => {
    $("#filter-option-dialog")[0].close();
  }, 150);
});

$("#reset-filter-option-dialog-button").click(function (event) {
  $("#filter-class-location").val(null).trigger("change");
});
