var navWidth;
var closeNavWidth;
var mainNavMenu;
var loggedUser;
$(document).ready(function () {

  loggedUser = sessionStorage.getItem("loggedUser");
  if (loggedUser === null) {
    window.location.href = "./login.html"
  }
  var fullName = sessionStorage.getItem("name");
  let memberImage = sessionStorage.getItem("imageUrl");
  let defaultImage = "./img/Default_pfp.svg";
  memberImage = memberImage === "" ? defaultImage : memberImage;
  $("#fullName").html(fullName);
  $("#image").attr("src", memberImage);
  mainNavMenu = $("#main-navigation-menu");
  navWidth = mainNavMenu.outerWidth(true);
  $("#main-navigation-menu").css("width", navWidth);
  closeNavWidth = $("#btn-nav-toggle").outerWidth(true) + navWidth - mainNavMenu.width();
  $("#btn-nav-toggle-open-icon").css("opacity", "0.5");
  $("#btn-nav-toggle-open-icon").css("transform", "rotate(-45deg)");
  $("#btn-nav-toggle").click(function () {
    $(this).prop("disabled", true);
    if ($(".nav-collapsed").length === 0) {
      collapseNavbar();
    } else {
      expandNavbar();
    }
    setTimeout(() => {
      $(this).prop("disabled", false);
    }, 150);
  });
  $(".btn-nav").click(function () {
    $(this).prop("disabled", true);
    if ($(".nav-collapsed").length !== 0) {
      expandNavbar();
    }
    setTimeout(() => {
      $(this).prop("disabled", false);
    }, 150);
    $(this).children(".nav-dropdown").toggleClass("nav-dropdown-open");
  });
  $("#logoutButton").click(function () {
    // Clear the session storage
    sessionStorage.removeItem("loggedUser");
    // Redirect to the login page or perform any other desired action
    window.location.href = "login.html";
  });
  $("#navigation-syllabus-collapse.collapse").on("show.bs.collapse", collapseNavSubmenu);
  $("#navigation-training-program-collapse.collapse").on("show.bs.collapse", collapseNavSubmenu);
  $("#navigation-class-collapse.collapse").on("show.bs.collapse", collapseNavSubmenu);
  $("#navigation-user-management-collapse.collapse").on("show.bs.collapse", collapseNavSubmenu);
  $("#navigation-setting-collapse.collapse").on("show.bs.collapse", collapseNavSubmenu);

  $(document).on("ajaxStart", function () {
    console.log("start");
    showLoadingBackdrop();
  });
  $(document).on("ajaxStop", function () {
    console.log("stop");

    hideLoadingBackdrop();
  });
});
function expandNavbar() {
  $(".nav-collapsed").removeClass("nav-collapsed");
  $(".nav-text").removeClass("hide");
  $(".nav-dropdown").removeClass("hide");
  $("#main-navigation-menu").animate({ width: navWidth }, 150, function () { });
  $("#btn-nav-toggle-open-icon").animate(
    {
      opacity: 0.5,
      angle: -45,
    },
    {
      duration: 75,
      step: function (now, fx) {
        if (fx.prop === "angle") {
          $(this).css("transform", "rotate(" + now + "deg)");
        } else {
          $(this).css("opacity", now);
        }
      },
      complete: function () {
        $("#btn-nav-toggle-open-icon").addClass("hide");
        $("#btn-nav-toggle-close-icon").removeClass("hide");
        $("#btn-nav-toggle-close-icon").animate(
          {
            opacity: 1,
            angle: 0,
          },
          {
            duration: 75,
            step: function (now, fx) {
              if (fx.prop === "angle") {
                $(this).css("transform", "rotate(" + now + "deg)");
              } else {
                $(this).css("opacity", now);
              }
            },
          }
        );
      },
    }
  );
}
function collapseNavbar() {
  $("#main-navigation-menu").addClass("nav-collapsed");
  collapseNavSubmenu();
  $(".nav-dropdown-open").removeClass("nav-dropdown-open");
  $("#main-navigation-menu").animate(
    { width: closeNavWidth },
    150,
    function () {
      $(".nav-text").addClass("hide");
      $(".nav-dropdown").addClass("hide");
    }
  );
  $("#btn-nav-toggle-close-icon").animate(
    {
      opacity: 0.5,
      angle: 45,
    },
    {
      duration: 75,
      step: function (now, fx) {
        if (fx.prop === "angle") {
          $(this).css("transform", "rotate(" + now + "deg)");
        } else {
          $(this).css("opacity", now);
        }
      },
      complete: function () {
        $("#btn-nav-toggle-close-icon").addClass("hide");
        $("#btn-nav-toggle-open-icon").removeClass("hide");
        $("#btn-nav-toggle-open-icon").animate(
          {
            opacity: 1,
            angle: 0,
          },
          {
            duration: 75,
            step: function (now, fx) {
              if (fx.prop === "angle") {
                $(this).css("transform", "rotate(" + now + "deg)");
              } else {
                $(this).css("opacity", now);
              }
            },
          }
        );
      },
    }
  );
}

function collapseNavSubmenu() {
  $("#navigation-syllabus-collapse.collapse.show").collapse("hide");
  $("#navigation-training-program-collapse.collapse.show").collapse("hide");
  $("#navigation-class-collapse.collapse.show").collapse("hide");
  $("#navigation-user-management-collapse.collapse.show").collapse("hide");
  $("#navigation-setting-collapse.collapse.show").collapse("hide");
}
function showLoadingBackdrop() {
  $('#loadingBackdrop').addClass('loading-active');
}
function hideLoadingBackdrop() {
  $('#loadingBackdrop').removeClass('loading-active');
}