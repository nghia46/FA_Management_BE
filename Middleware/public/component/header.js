let header = document.getElementById("main-page-header");
header.innerHTML = `
<div class="d-flex flex-row align-items-center p-2">
  <div class="flex-grow-1 mx-3">
    <img style="height: 60px;" src="https://fpt.com/-/media/project/fpt-corporation/fpt/common/images/navigation/logo/fpt-logo.svg">
  </div>
  <div>
    <button class="btn btn-dark btn-unigate" style="overflow: hidden; white-space: nowrap;">
    <img style="height: 30px;" src="img/uniGate_logo.png" alt="uniGate logo">
    uniGate
    </button>
  </div>
  <div class="d-flex flex-row mx-3">
    <div class="mx-3 align-middle my-auto">
      <img style="height: 60px; width: 60px; border-radius: 50%; object-fit: cover" src="" alt="profile picture" id="image">
    </div>
    <div class="d-flex flex-column">
      <div class="flex-grow-1 fw-bold fs-5 text-white text-center"
        style="overflow: hidden; white-space: nowrap;" id="fullName"></div>
      <div id="member-id" style="display: none;"></div>
      <button class="flex-grow-1 text-center btn btn-danger" style="overflow: hidden; white-space: nowrap; background-color: #ff0000;"><a
        class=" fs-6 text-white text-decoration-none" id="logoutButton">LOG OUT</a></button>
    </div>
  </div>
</div>
`;