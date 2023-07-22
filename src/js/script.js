const countryCode = document.querySelector("#country-code"),
  orbitCode = document.querySelector("#orbit-code"),
  objectType = document.querySelector("#object-type"),
  exploreButton = document.querySelector(".satellites-explore"),
  satelliteFind = document.querySelector(".satellite-find"),
  astronaut = document.querySelector(".astronaut-pic"),
  instruction = document.querySelector(".astronaut-pic .instruction"),
  main = document.querySelector("main"),
  input = document.querySelector("input"),
  submitButton = document.querySelector(".submit-btn"),
  satName = document.querySelector(".sat-name"),
  satnoradCatId = document.querySelector(".sat-noradCatId"),
  satorbitCode = document.querySelector(".sat-orbitCode"),
  satobjectType = document.querySelector(".sat-objectType"),
  searchingSatellite = document.querySelector(".searching-satellite"),
  loadingSatellite = document.querySelector(".loading-satellite"),
  closeButton = document.querySelector(".close-btn"),
  loading = document.querySelector(".loading");

let myArray = [],
  filterArray = [],
  getFilterArray = [],
  satellites = [];

fetchingData();

async function fetchingData() {
  // Use the data from the JSON file here
  let response = await fetch("satellites.json");
  satellites = await response.json();

  getCountryCode(satellites);
  getOrbitCode(satellites);
  getObjectType(satellites);

  submitButtonClick(satellites);

  handleFilters(satellites);
}

let countryCodeFilter = null;
let orbitCodeFilter = null;
let objectTypeFilter = null;

function handleFilters(satellites) {
  countryCode.addEventListener("change", () => {
    countryCodeFilter = countryCode.value;
    applyFilterAndDisplayResults(satellites, currentPage);
  });

  orbitCode.addEventListener("change", () => {
    orbitCodeFilter = orbitCode.value;
    applyFilterAndDisplayResults(satellites, currentPage);
  });

  objectType.addEventListener("change", () => {
    objectTypeFilter = objectType.value;
    applyFilterAndDisplayResults(satellites, currentPage);
  });
}

// function applyFilterAndDisplayResults(satellites,currentPage) {
//   searchingSatellite.innerHTML = ""; // Clear previous results
//   let foundSatellite = false;

//   satellites.forEach((satellite) => {
//     if (
//       countryCodeFilter === satellite.countryCode &&
//       orbitCodeFilter === satellite.orbitCode &&
//       objectTypeFilter === satellite.objectType
//     ) {
//       searchingSatellite.innerHTML += `
//         <div class="searched-satellite shadow-xxl bg-gray-700  flex gap-6 p-4 mb-6 flex-wrap flex-grow justify-center items-center text-white border-2 border-gray-600 hover:border-blue-600 rounded-2xl hover:scale-[1.02] transition-all ease-in-out duration-300">
//               <div class="satellite-image animate-opacity">
//                 <img
//                   class="rounded-xl shadow-xxl"
//                   src="${satellite.src}"
//                   width="200"
//                   alt=""
//                 />

//               </div>
//               <div class="satellite-details flex flex-col gap-1 animate-opacity">
//                 <p class="sat-name">${satellite.name}</p>
//                 <p class="sat-noradCatId">${satellite.noradCatId}</p>
//                 <p class="sat-orbitCode">${satellite.orbitCode}</p>
//                 <p class="sat-objectType">${satellite.objectType}</p>
//               </div>

//             </div>
//       `;
//       foundSatellite = true;
//     }
//   });

//   if (!foundSatellite) {
//     searchingSatellite.innerHTML = `<div class="error mb-6 text-white animate-opacity"><span class="text-xl">⚠ </span>Satellite does not exist.</div>`;
//   }
// }
const satellitesPerPage = 10;
let currentPage = 1;

function applyFilterAndDisplayResults(satellites, currentPage) {
  // Clear previous results and reset the current page to 1
  searchingSatellite.innerHTML = "";
  currentPage = 1;

  // Filter the satellites based on selected filters
  const filteredSatellites = satellites.filter((satellite) => {
    return (
      (!countryCodeFilter || satellite.countryCode === countryCodeFilter) &&
      (!orbitCodeFilter || satellite.orbitCode === orbitCodeFilter) &&
      (!objectTypeFilter || satellite.objectType === objectTypeFilter)
    );
  });

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * satellitesPerPage;
  const endIndex = startIndex + satellitesPerPage;
  let foundSatellite = false;
  // Display the satellites for the current page
  for (let i = startIndex; i < endIndex && i < filteredSatellites.length; i++) {
    const satellite = filteredSatellites[i];
    searchingSatellite.innerHTML += `
            <div class="searched-satellite shadow-xxl bg-gray-700  flex gap-6 p-4 mb-6 flex-wrap flex-grow justify-center items-center text-white border-2 border-gray-600 hover:border-blue-600 rounded-2xl hover:scale-[1.02] transition-all ease-in-out duration-300">
                  <div class="satellite-image animate-opacity">
                    <img
                      class="rounded-xl shadow-xxl"
                      src="${satellite.src}"
                      width="200"
                      alt=""
                    />
                    
                  </div>
                  <div class="satellite-details flex flex-col gap-1 animate-opacity">
                    <p class="sat-name">${satellite.name}</p>
                    <p class="sat-noradCatId">${satellite.noradCatId}</p>
                    <p class="sat-orbitCode">${satellite.orbitCode}</p>
                    <p class="sat-objectType">${satellite.objectType}</p>
                  </div>
                  
                </div>
          `;

    foundSatellite = true;
  }
  if (!foundSatellite) {
    searchingSatellite.innerHTML = `<div class="error mb-6 text-white animate-opacity"><span class="text-xl">⚠ </span>Satellite does not exist.</div>`;
  }

  // Disable/enable previous and next buttons based on the current page
  const prevButton = document.querySelector(".prev-page");
  const nextButton = document.querySelector(".next-page");
  prevButton.disabled = currentPage === 1;
  nextButton.disabled =
    endIndex >= filteredSatellites.length || filteredSatellites.length === 0;
}

// Add event listeners to the pagination buttons
const prevButton = document.querySelector(".prev-page");
const nextButton = document.querySelector(".next-page");
prevButton.addEventListener("click", prevPage);
nextButton.addEventListener("click", nextPage);

// Function to update the current page number in the UI
function updateCurrentPageNumber() {
  const currentPageElement = document.querySelector(".current-page");
  currentPageElement.textContent = currentPage;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    applyFilterAndDisplayResults(satellites, currentPage);
    updateCurrentPageNumber();
  }
}

function nextPage() {
  const filteredSatellites = satellites.filter((satellite) => {
    return (
      (!countryCodeFilter || satellite.countryCode === countryCodeFilter) &&
      (!orbitCodeFilter || satellite.orbitCode === orbitCodeFilter) &&
      (!objectTypeFilter || satellite.objectType === objectTypeFilter)
    );
  });

  const startIndex = (currentPage - 1) * satellitesPerPage;
  const endIndex = Math.min(
    (currentPage + 1) * satellitesPerPage + 1,
    filteredSatellites.length
  );

  const newSatellites = filteredSatellites.slice(startIndex, endIndex);

  if (newSatellites.length > 0) {
    currentPage++;
    applyFilterAndDisplayResults(satellites, currentPage);
    updateCurrentPageNumber();
  }
}

function submitButtonClick(satellites) {
  submitButton.addEventListener("click", () => {
    getSatellite(input.value, satellites);
  });
}

exploreClick();

function getSatellite(nameOrId, satellites) {
  let foundSatellite = false;
  searchingSatellite.innerHTML = ""; // Clear previous results

  if (nameOrId == "") {
    searchingSatellite.innerHTML = `<div class="error mb-6 text-white animate-opacity"><span class="text-xl">⚠</span>Enter Satellite Data</div>`;
  } else {
    satellites.forEach((satellite) => {
      if (nameOrId == satellite.noradCatId || nameOrId == satellite.name) {
        searchingSatellite.innerHTML += `
        <div class="searched-satellite shadow-xxl bg-gray-700  flex gap-6 p-4 mb-6 flex-wrap flex-grow justify-center items-center text-white border-2 border-gray-600 hover:border-blue-600 rounded-2xl hover:scale-[1.02] transition-all ease-in-out duration-300">
              <div class="satellite-image animate-opacity">
                <img
                  class="rounded-xl shadow-xxl"
                  src="assets/images/advanced-satellite.jpg"
                  width="200"
                  alt=""
                />
                
              </div>
              <div class="satellite-details flex flex-col gap-1 animate-opacity">
                <p class="sat-name">${satellite.name}</p>
                <p class="sat-noradCatId">${satellite.noradCatId}</p>
                <p class="sat-orbitCode">${satellite.orbitCode}</p>
                <p class="sat-objectType">${satellite.objectType}</p>
              </div>
              
            </div>
      `;

        foundSatellite = true;
      }
    });

    if (!foundSatellite) {
      searchingSatellite.innerHTML = `<div class="error mb-6 text-white animate-opacity"><span class="text-xl">⚠ </span>Satellite does not exist.</div>`;
    }
  }
}

// filters
function applyFilters() {
  countryCode.addEventListener("change", (e) => {
    selectedFilter = e.target.value;
    filterArray.push(selectedFilter);
  });
  orbitCode.addEventListener("change", (e) => {
    selectedFilter = e.target.value;
    filterArray.push(selectedFilter);
  });
  objectType.addEventListener("change", (e) => {
    selectedFilter = e.target.value;
    filterArray.push(selectedFilter);
  });
  return filterArray;
}

function exploreClick() {
  exploreButton.addEventListener("click", () => {
    satelliteFind.classList.toggle("hidden");
    astronaut.classList.toggle("hidden");
    exploreButton.classList.toggle("hidden");
  });
  closeButton.addEventListener("click", () => {
    satelliteFind.classList.toggle("hidden");
    astronaut.classList.toggle("hidden");
    exploreButton.classList.toggle("hidden");
  });
  timeOutInstruction();
}

function getCountryCode(satellites) {
  //COUNTRY CODE unique dropdown handling
  satellites.forEach((satellite) => {
    myArray.push(satellite.countryCode);
  });
  var unique = myArray.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  unique.forEach((satellite) => {
    countryCode.innerHTML += `<option value="${satellite}">${satellite}</option>`;
  });

  // Clearing arrays for reuse
  myArray = [];
}
function getOrbitCode(satellites) {
  //ORBIT CODE unique dropdown handling
  satellites.forEach((satellite) => {
    myArray.push(satellite.orbitCode);
  });
  var unique = myArray.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  unique.forEach((satellite) => {
    orbitCode.innerHTML += `<option value="${satellite}">${satellite}</option>`;
  });

  // Clearing arrays for reuse
  myArray = [];
}

function getObjectType(satellites) {
  //OBJECT TYPE unique dropdown handling
  satellites.forEach((satellite) => {
    myArray.push(satellite.objectType);
  });
  var unique = myArray.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  unique.forEach((satellite) => {
    objectType.innerHTML += `<option value="${satellite}">${satellite}</option>`;
  });
}

function timeOutInstruction() {
  setTimeout(() => {
    instruction.classList.toggle("hidden");
  }, 1000);
}
