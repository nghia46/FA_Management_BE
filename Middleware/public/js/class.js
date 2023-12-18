import { getAllClass } from "./Services/class.service.js";

$(document).ready(function () {
  // Lấy tham chiếu đến tbody trong bảng
  var tableBody = $("#user-information-table tbody");

  getAllClass()
    .then(function (viewClass) {
      viewClass.forEach(function (showClass) {
        console.log(showClass);
        var startDate = new Date(showClass.startDate);
        var endDate = new Date(showClass.endDate);

        // Calculate duration in milliseconds
        var durationInMillis = endDate - startDate;
        var durationInDays = durationInMillis / (1000 * 60 * 60 * 24);

        var row = `<tr class="class-row" data-id="${showClass.id}">
                                 <td>${showClass.name}</td>
                                 <td>${showClass.code}</td>
                                 <td>${showClass.startDate}</td>
                                 <td>${showClass.createdByUserId.userName}</td>
                                 <td>${durationInDays + " days"}</td>
                                 <td>${showClass.attendee.attendeeName}</td>
                                 <td>${showClass.location.locationName}</td>
                                 <td>${showClass.fsu}</td>
                             </tr>`;

        // Thêm chuỗi HTML vào tbody của bảng
        tableBody.append(row);
      });
    })
    .catch(function (error) {
      console.error("Error fetching training programs: ", error);
    });
});

$(document).on("click", ".class-row", function(e) {
  var classId = $(this).data("id");
  sessionStorage.setItem("classId", classId);
  window.location.href = `classDetail.html`;
});
