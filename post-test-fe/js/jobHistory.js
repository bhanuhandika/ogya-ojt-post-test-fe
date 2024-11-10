let currentPage = 1;
const rowsPerPage = 5;
let allJobHistories = [];

// Fungsi untuk mengambil dan menampilkan semua data job history
function getAllJobHistories() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/job-histories/details", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        allJobHistories = data;
        displayJobHistories(allJobHistories);
    })
    .catch(error => {
        console.error("Error saat mengambil data job history:", error);
    });
}

// Menampilkan job history di tabel
function displayJobHistories(jobHistories) {
    const tableBody = document.querySelector("#jobHistoryTable tbody");
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedJobHistories = jobHistories.slice(start, end);

    if (paginatedJobHistories.length > 0) {
        paginatedJobHistories.forEach(jobHistory => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${jobHistory.jobHistoryId}</td>
                <td>${jobHistory.departmentName}</td>
                <td>${jobHistory.employeeFirstName} ${jobHistory.employeeLastName}</td>
                <td>${jobHistory.jobTitle}</td>
                <td>${jobHistory.startDate}</td>
                <td>${jobHistory.endDate}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.log("Tidak ada data job history yang ditemukan");
    }

    updatePagination(jobHistories);
}

// Filter job history berdasarkan input pencarian
function filterJobHistories() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    
    const filteredJobHistories = allJobHistories.filter(jobHistory => {
        return (
            (jobHistory.jobHistoryId && jobHistory.jobHistoryId.toString().includes(searchInput)) ||
            (jobHistory.departmentId && jobHistory.departmentId.toString().includes(searchInput)) ||
            (jobHistory.employeeId && jobHistory.employeeId.toString().includes(searchInput)) ||
            (jobHistory.jobId && jobHistory.jobId.toString().includes(searchInput)) ||
            (jobHistory.startDate && jobHistory.startDate.toLowerCase().includes(searchInput)) ||
            (jobHistory.endDate && jobHistory.endDate.toLowerCase().includes(searchInput))
        );
    });

    displayJobHistories(filteredJobHistories);
}


// Update pagination buttons
function updatePagination(jobHistories) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const pageCount = Math.ceil(jobHistories.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("btn", "btn-secondary", "mx-1");
        pageButton.textContent = i;
        if (i === currentPage) pageButton.classList.add("active");

        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayJobHistories(jobHistories);
        });

        paginationContainer.appendChild(pageButton);
    }
}

document.addEventListener("DOMContentLoaded", getAllJobHistories);


document.addEventListener("DOMContentLoaded", function () {
            function loadPage(page) {
                const pages = document.querySelectorAll('.page');
                pages.forEach(p => p.style.display = 'none');

                const pageElement = document.getElementById(page);
                if (pageElement) {
                    pageElement.style.display = 'block';
                }

                switch (page) {
                    case 'department':
                        loadScript('js/department.js');
                        break;
                    case 'employee':
                        loadScript('js/employee.js');
                        break;
                    case 'job':
                        loadScript('js/job.js');
                        break;
                    case 'jobHistory':
                        loadScript('js/jobHistory.js');
                        break;
                    default:
                        break;
                }
            }

            function loadScript(src) {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => console.log(`${src} loaded successfully`);
                document.body.appendChild(script);
            }

            const menuDepartment = document.getElementById("menu-department");
            const menuEmployee = document.getElementById("menu-employee");
            const menuJob = document.getElementById("menu-job");
            const menuJobHistory = document.getElementById("menu-jobHistory");

            if (menuDepartment) {
                menuDepartment.addEventListener("click", function () {
                    window.location.href = "department.html";
                });
            }

            if (menuEmployee) {
                menuEmployee.addEventListener("click", function () {
                    window.location.href = "employee.html";
                });
            }

            if (menuJob) {
                menuJob.addEventListener("click", function () {
                    window.location.href = "job.html";
                });
            }

            if (menuJobHistory) {
                menuJobHistory.addEventListener("click", function () {
                    window.location.href = "jobHistory.html";
                });
            }

            const logoutLink = document.querySelector(".nav-link[onclick='logout()']");
            if (logoutLink) {
                logoutLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    logout();
                });
            }

            function logout() {
                localStorage.removeItem("token");
                alert("Logout berhasil");
                window.location.href = "login.html";
            }

            function checkLoginStatus() {
                const token = localStorage.getItem("token");

                if (!token) {
                    alert("Silakan login terlebih dahulu.");
                    window.location.href = "login.html";
                }
            }

            if (window.location.href.includes("employee.html")) {
                checkLoginStatus();
                loadPage('employee');
            }
        });