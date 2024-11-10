let currentPage = 1;
const rowsPerPage = 5;
let allJobs = [];

function getAllJobs() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/job/all", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        allJobs = data;
        displayJobs(allJobs); 
    })
    .catch(error => {
        console.error("Error saat mengambil data job:", error);
    });
}

function displayJobs(jobs) {
    const tableBody = document.querySelector("#jobTable tbody");
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedJobs = jobs.slice(start, end);

    if (paginatedJobs.length > 0) {
        paginatedJobs.forEach(job => {
            console.log("Data job yang diterima untuk display:", job);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${job.jobId}</td>
                <td>${job.jobTitle}</td>
                <td>${job.minSalary}</td>
                <td>${job.maxSalary}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editJob(${job.jobId})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.jobId})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.log("Tidak ada data job yang ditemukan");
    }

    updatePagination(jobs); 
}

function filterJobs() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    
    const filteredJobs = allJobs.filter(job => 
        job.jobTitle.toLowerCase().includes(searchInput) ||
        job.minSalary.toString().includes(searchInput) ||
        job.maxSalary.toString().includes(searchInput)
    );

    displayJobs(filteredJobs); 
}

document.addEventListener("DOMContentLoaded", getAllJobs);

function updatePagination(jobs) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const pageCount = Math.ceil(jobs.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("btn", "btn-secondary", "mx-1");
        pageButton.textContent = i;
        if (i === currentPage) pageButton.classList.add("active");

        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayJobs(jobs); 
        });

        paginationContainer.appendChild(pageButton);
    }
}

function editJob(id) {
    const token = localStorage.getItem("token");

    console.log("Mencoba mengambil data job dengan ID:", id);

    fetch(`http://localhost:8080/job/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(job => {
        console.log("Data job yang diterima untuk edit:", job);

        document.getElementById("editJobId").value = job.jobId;
        document.getElementById("editJobTitle").value = job.jobTitle;
        document.getElementById("editMinSalary").value = job.minSalary;
        document.getElementById("editMaxSalary").value = job.maxSalary;

        const editModal = new bootstrap.Modal(document.getElementById("editJobModal"));
        editModal.show();
    })
    .catch(error => {
        console.error("Error saat mengambil data job untuk edit:", error);
    });
}

document.getElementById("addJobForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const newJob = {
        jobTitle: document.getElementById("addJobTitle").value,
        minSalary: document.getElementById("addMinSalary").value,
        maxSalary: document.getElementById("addMaxSalary").value
    };

    fetch("http://localhost:8080/job/create", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newJob)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add job');
        }
        return response.json();
    })
    .then(data => {
        console.log("Job added:", data);

        const addJobModal = bootstrap.Modal.getInstance(document.getElementById("addJobModal"));
        addJobModal.hide();

        getAllJobs();
    })
    .catch(error => {
        console.error("Error saat menambahkan job:", error);
    });
});

document.getElementById("editJobForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const updatedJob = {
        jobId: document.getElementById("editJobId").value,
        jobTitle: document.getElementById("editJobTitle").value,
        minSalary: document.getElementById("editMinSalary").value,
        maxSalary: document.getElementById("editMaxSalary").value
    };

    fetch(`http://localhost:8080/job/update/${updatedJob.jobId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedJob)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update job');
        }
        return response.json();
    })
    .then(data => {
        console.log("Job updated:", data);

        const editJobModal = bootstrap.Modal.getInstance(document.getElementById("editJobModal"));
        editJobModal.hide();

        getAllJobs();
    })
    .catch(error => {
        console.error("Error saat memperbarui job:", error);
    });
});

function deleteJob(id) {
    const token = localStorage.getItem("token");

    if (!confirm("Apakah Anda yakin ingin menghapus data job ini?")) {
        return;
    }

    fetch(`http://localhost:8080/job/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 204) {
            alert("Data job berhasil dihapus.");
            getAllJobs();
        } else {
            throw new Error("Gagal menghapus data job");
        }
    })
    .catch(error => {
        console.error("Error saat menghapus job:", error);
    });
}

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