//validation
if (sessionStorage.getItem("loggedUser") == null) {
    window.location.href = "login.html";
}

$(document).ready(function () {
    $("#logoutButton").click(function () {
        // Clear the session storage
        sessionStorage.removeItem("loggedUser");
        // Redirect to the login page or perform any other desired action
        window.location.href = "login.html";
    })
})