import { getClass } from "./Services/class.service.js";
import { getUser } from "./Services/userManagement.service.js";
$(document).ready(function () {
  $("#logoutButton").click(function () {
    // Clear the session storage
    sessionStorage.removeItem("loggedUser");
    sessionStorage.removeItem("programId");
    // Redirect to the login page or perform any other desired action
    window.location.href = "login.html";
  });
});

$(document).ready(function () {
  var checkId = sessionStorage.getItem("classId");
  getClass(checkId).then(function (classInfo) {
    var startDate = new Date(classInfo.startDate);
    var endDate = new Date(classInfo.endDate);
    var durationInMillis = endDate - startDate;
    var durationInDays = durationInMillis / (1000 * 60 * 60 * 24);
    var durationInHours = durationInMillis / (1000 * 60 * 60);

    var className = classInfo.name;
    var statusProgram = classInfo.status;
    var createBy = classInfo.createdByUserId.userName;
    var classCode = classInfo.code;
    var planned = classInfo.planned;
    var accepted = classInfo.accepted;
    var actual = classInfo.actual;
    var attendeeName = classInfo.attendee.attendeeName;
    var classTime = classInfo.classTime;
    var location = classInfo.location.locationName;
    var fsu = classInfo.fsu;
    var createOn = classInfo.startDate;
    $("#nameClass").text(className);

    if (statusProgram === 0) {
      $("#statusClass").text("Planning");
    } else if (statusProgram === 1) {
      $("#statusClass").text("Opening");
    } else if (statusProgram === 2) {
      $("#statusClass").text("Closed");
    } else {
      $("#statusClass").text("Unknown Status");
    }

    $("#classCode").text(classCode);
    $("#durationTimeDays").text(durationInDays + " days");
    $("#durationTimeHours").text("(" + durationInHours + " hours)");
    $("#planned").text(planned);
    $("#accepted").text(accepted);
    $("#actual").text(actual);
    $("#attendeeName").text("Attendee " + attendeeName);
    $("#classTime").text(classTime);
    $("#location").text(location);
    $("#fsu").text(fsu);
    $("#createdBy").text(createOn + " by " + createBy);

    var trainerIDs = classInfo.trainer;
    var adminIDs = classInfo.admin;
    for (let i = 0; i < trainerIDs.length; i++) {
      const currentID = trainerIDs[i];

      getUser(currentID)
      .then(function (user) {
        // Update the content of the "trainerName" element with the user's name
        $("#trainerName").append(user.name + '<br>');
      })
    }

    for (let i = 0; i < adminIDs.length; i++) {
      const currentID = adminIDs[i];

      getUser(currentID)
      .then(function (user) {
        // Update the content of the "trainerName" element with the user's name
        $("#adminName").append(user.name + '<br>');
      })
    }
  });
});
