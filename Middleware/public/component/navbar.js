let navbar = document.getElementById("main-page-navigation");
navbar.innerHTML = `
<ul class="p-3 sticky-top" id="main-navigation-menu">
  <li class="mb-1">
    <button class="btn" id="btn-nav-toggle">
      <svg id="btn-nav-toggle-close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15981)">
          <path
            d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15981">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <svg id="btn-nav-toggle-open-icon" class="hide" width="24" height="24" viewBox="0 0 24 24"
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15978)">
          <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15978">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  </li>
  <li class="mb-1">
    <a href="index.html" class="btn btn-nav btn-active">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15942)">
          <path
            d="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69ZM12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15942">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span class="nav-text">
      Home
      </span>
    </a>
  </li>
  <li class="mb-1">
    <button class="btn btn-nav" type="button" data-bs-toggle="collapse"
      data-bs-target="#navigation-syllabus-collapse" aria-expanded="false"
      aria-controls="navigation-syllabus-collapse">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3.25 4.125H8.5C9.42826 4.125 10.3185 4.49375 10.9749 5.15013C11.6313 5.8065 12 6.69674 12 7.625V19.875C12 19.1788 11.7234 18.5111 11.2312 18.0188C10.7389 17.5266 10.0712 17.25 9.375 17.25H3.25V4.125Z"
          stroke="#2D3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M20.75 4.125H15.5C14.5717 4.125 13.6815 4.49375 13.0251 5.15013C12.3687 5.8065 12 6.69674 12 7.625V19.875C12 19.1788 12.2766 18.5111 12.7688 18.0188C13.2611 17.5266 13.9288 17.25 14.625 17.25H20.75V4.125Z"
          stroke="#2D3748" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span class="nav-text">
      Syllabus
      </span>
      <span class="nav-dropdown">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_184_15998)">
            <path
              d="M16 7.16212L14.9323 6L9 12.5L14.9383 19L16 17.8379L11.1234 12.5L16 7.16212Z"
              fill="#2D3748" />
          </g>
          <defs>
            <clipPath id="clip0_184_15998">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </button>
    <div class="collapse" id="navigation-syllabus-collapse">
      <a href="syllabus.html" class=" btn btn-nav-sub">
      View syllabus
      </a>
      <a href="createSyllabus.html" class="btn btn-nav-sub">
      Create syllabus
      </a>
    </div>
  </li>
  <li class="mb-1">
    <button class="btn btn-nav" type="button" data-bs-toggle="collapse"
      data-bs-target="#navigation-training-program-collapse" aria-expanded="false"
      aria-controls="navigation-training-program-collapse">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15950)">
          <path
            d="M7 19C5.9 19 5 19.9 5 21H19C19 19.9 18.1 19 17 19H13V17H16C17.1 17 18 16.1 18 15H10C8.34 15 7 13.66 7 12C7 10.91 7.59 9.96 8.47 9.43C8.88 10.02 9.53 10.43 10.3 10.49C11 10.55 11.66 10.3 12.15 9.87L12.74 11.48L13.68 11.14L14.02 12.08L15.9 11.4L15.56 10.46L16.5 10.12L13.76 2.6L12.82 2.94L12.48 2L10.6 2.68L10.94 3.62L10 3.97L10.56 5.52C9.39 5.48 8.37 6.27 8.08 7.38C6.27 8.14 5 9.92 5 12C5 14.76 7.24 17 10 17V19H7ZM12.86 4.52L14.57 9.22L13.63 9.56L11.92 4.86L12.86 4.52ZM10.5 7C11.05 7 11.5 7.45 11.5 8C11.5 8.55 11.05 9 10.5 9C9.95 9 9.5 8.55 9.5 8C9.5 7.45 9.95 7 10.5 7Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15950">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span class="nav-text">
      Training program
      </span>
      <span class="nav-dropdown">
        <svg class="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_184_15998)">
            <path
              d="M16 7.16212L14.9323 6L9 12.5L14.9383 19L16 17.8379L11.1234 12.5L16 7.16212Z"
              fill="#2D3748" />
          </g>
          <defs>
            <clipPath id="clip0_184_15998">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </button>
    <div style="width: 100%;" class="collapse" id="navigation-training-program-collapse">
      <a href="viewProgram.html" class="btn btn-nav-sub">
      View program
      </a>
      <a href="createProgram.html" class="btn btn-nav-sub">
      Create program
      </a>
    </div>
  </li>
  <li class="mb-1">
    <button class="btn btn-nav" type="button" data-bs-toggle="collapse"
      data-bs-target="#navigation-class-collapse" aria-expanded="false"
      aria-controls="navigation-class-collapse">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15956)">
          <path
            d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15956">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span class="nav-text">
      Class
      </span>
      <span class="nav-dropdown">
        <svg class="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_184_15998)">
            <path
              d="M16 7.16212L14.9323 6L9 12.5L14.9383 19L16 17.8379L11.1234 12.5L16 7.16212Z"
              fill="#2D3748" />
          </g>
          <defs>
            <clipPath id="clip0_184_15998">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </button>
    <div class="collapse" id="navigation-class-collapse">
      <a href="viewClass.html" class="btn btn-nav-sub">
      View class
      </a>
      <a href="createClass.html" class="btn btn-nav-sub">
      Create class
      </a>
    </div>
  </li>
  <li class="mb-1">
    <a href="trainingCalendar.html" class="btn btn-nav">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15960)">
          <path
            d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V8H20V21Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15960">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span class="nav-text">
      Training calendar
      </span>
    </a>
  </li>
  <li class="mb-1">
    <button class="btn btn-nav" type="button" data-bs-toggle="collapse"
      data-bs-target="#navigation-user-management-collapse" aria-expanded="false"
      aria-controls="navigation-user-management-collapse">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15964)">
          <path
            d="M9 13.75C6.66 13.75 2 14.92 2 17.25V19H16V17.25C16 14.92 11.34 13.75 9 13.75ZM4.34 17C5.18 16.42 7.21 15.75 9 15.75C10.79 15.75 12.82 16.42 13.66 17H4.34ZM9 12C10.93 12 12.5 10.43 12.5 8.5C12.5 6.57 10.93 5 9 5C7.07 5 5.5 6.57 5.5 8.5C5.5 10.43 7.07 12 9 12ZM9 7C9.83 7 10.5 7.67 10.5 8.5C10.5 9.33 9.83 10 9 10C8.17 10 7.5 9.33 7.5 8.5C7.5 7.67 8.17 7 9 7ZM16.04 13.81C17.2 14.65 18 15.77 18 17.25V19H22V17.25C22 15.23 18.5 14.08 16.04 13.81ZM15 12C16.93 12 18.5 10.43 18.5 8.5C18.5 6.57 16.93 5 15 5C14.46 5 13.96 5.13 13.5 5.35C14.13 6.24 14.5 7.33 14.5 8.5C14.5 9.67 14.13 10.76 13.5 11.65C13.96 11.87 14.46 12 15 12Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15964">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span class="nav-text">
      User management
      </span>
      <span class="nav-dropdown">
        <svg class="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_184_15998)">
            <path
              d="M16 7.16212L14.9323 6L9 12.5L14.9383 19L16 17.8379L11.1234 12.5L16 7.16212Z"
              fill="#2D3748" />
          </g>
          <defs>
            <clipPath id="clip0_184_15998">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </button>
    <div class="collapse" id="navigation-user-management-collapse">
      <a class="btn btn-nav-sub" id="userList" href="userManagement.html">
      User list
      </a>
      <a href="userPermission.html" class="btn btn-nav-sub">
      User permission
      </a>
    </div>
  </li>
  <li class="mb-1">
    <a href="learningMaterial.html" class="btn btn-nav">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15968)">
          <path
            d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM17.5 12.12V15.5H14.5V10.5H15.88L17.5 12.12ZM13 9V17H19V11.5L16.5 9H13Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15968">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span class="nav-text">
      Learning Material
      </span>
    </a>
  </li>
  <li class="mb-1">
    <button class="btn btn-nav" type="button" data-bs-toggle="collapse"
      data-bs-target="#navigation-setting-collapse" aria-expanded="false"
      aria-controls="navigation-setting-collapse">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_184_15973)">
          <path
            d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.57 5.11 19.4 5.02 19.22 5.02C19.16 5.02 19.1 5.03 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H9.99996C9.74996 2 9.53996 2.18 9.50996 2.42L9.12996 5.07C8.51996 5.32 7.95996 5.66 7.43996 6.05L4.94996 5.05C4.88996 5.03 4.82996 5.02 4.76996 5.02C4.59996 5.02 4.42996 5.11 4.33996 5.27L2.33996 8.73C2.20996 8.95 2.26996 9.22 2.45996 9.37L4.56996 11.02C4.52996 11.34 4.49996 11.67 4.49996 12C4.49996 12.33 4.52996 12.66 4.56996 12.98L2.45996 14.63C2.26996 14.78 2.21996 15.05 2.33996 15.27L4.33996 18.73C4.42996 18.89 4.59996 18.98 4.77996 18.98C4.83996 18.98 4.89996 18.97 4.94996 18.95L7.43996 17.95C7.95996 18.35 8.51996 18.68 9.12996 18.93L9.50996 21.58C9.53996 21.82 9.74996 22 9.99996 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.11 18.97 19.17 18.98 19.23 18.98C19.4 18.98 19.57 18.89 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98ZM17.45 11.27C17.49 11.58 17.5 11.79 17.5 12C17.5 12.21 17.48 12.43 17.45 12.73L17.31 13.86L18.2 14.56L19.28 15.4L18.58 16.61L17.31 16.1L16.27 15.68L15.37 16.36C14.94 16.68 14.53 16.92 14.12 17.09L13.06 17.52L12.9 18.65L12.7 20H11.3L11.11 18.65L10.95 17.52L9.88996 17.09C9.45996 16.91 9.05996 16.68 8.65996 16.38L7.74996 15.68L6.68996 16.11L5.41996 16.62L4.71996 15.41L5.79996 14.57L6.68996 13.87L6.54996 12.74C6.51996 12.43 6.49996 12.2 6.49996 12C6.49996 11.8 6.51996 11.57 6.54996 11.27L6.68996 10.14L5.79996 9.44L4.71996 8.6L5.41996 7.39L6.68996 7.9L7.72996 8.32L8.62996 7.64C9.05996 7.32 9.46996 7.08 9.87996 6.91L10.94 6.48L11.1 5.35L11.3 4H12.69L12.88 5.35L13.04 6.48L14.1 6.91C14.53 7.09 14.93 7.32 15.33 7.62L16.24 8.32L17.3 7.89L18.57 7.38L19.27 8.59L18.2 9.44L17.31 10.14L17.45 11.27ZM12 8C9.78996 8 7.99996 9.79 7.99996 12C7.99996 14.21 9.78996 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM12 14C10.9 14 9.99996 13.1 9.99996 12C9.99996 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z"
            fill="#2D3748" />
        </g>
        <defs>
          <clipPath id="clip0_184_15973">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span class="nav-text">
      Setting
      </span>
      <span class="nav-dropdown">
        <svg class="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_184_15998)">
            <path
              d="M16 7.16212L14.9323 6L9 12.5L14.9383 19L16 17.8379L11.1234 12.5L16 7.16212Z"
              fill="#2D3748" />
          </g>
          <defs>
            <clipPath id="clip0_184_15998">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </span>
    </button>
    <div class="collapse" id="navigation-setting-collapse">
      <a href="settingCalendar.html" class="btn btn-nav-sub">
      Calendar
      </a>
    </div>
    <div class="collapse" id="navigation-setting-collapse">
    <a href="profile.html" class="btn btn-nav-sub">
    Update Profile
    </a>
  </div>
  </li>
</ul>
`;