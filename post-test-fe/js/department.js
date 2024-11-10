let currentPage = 1;
const rowsPerPage = 5;
let allDepartments = [];

// Fungsi untuk mengambil dan menampilkan semua data department
function getAllDepartments() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/department/all", {
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
        allDepartments = data;
        displayDepartments(allDepartments);
    })
    .catch(error => {
        console.error("Error saat mengambil data department:", error);
    });
}

function displayDepartments(departments) {
    const tableBody = document.querySelector("#departmentTable tbody");
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedDepartments = departments.slice(start, end);

    if (paginatedDepartments.length > 0) {
        paginatedDepartments.forEach(department => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${department.departmentId}</td>
                <td>${department.departmentName}</td>
                <td>${department.managerId}</td>
                <td>${department.locationId}</td>
                
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editDepartment(${department.departmentId})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteDepartment(${department.departmentId})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
    } else {
        console.log("Tidak ada data department yang ditemukan");
    }

    updatePagination(departments);
}

function filterDepartments() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    
    const filteredDepartments = allDepartments.filter(department => 
        department.departmentName.toLowerCase().includes(searchInput) ||
        department.managerId.toString().includes(searchInput) ||
        department.locationId.toString().includes(searchInput)
    );

    displayDepartments(filteredDepartments);
}


document.addEventListener("DOMContentLoaded", getAllDepartments);

function updatePagination(departments) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const pageCount = Math.ceil(departments.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("btn", "btn-secondary", "mx-1");
        pageButton.textContent = i;
        if (i === currentPage) pageButton.classList.add("active");

        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayDepartments(departments);
        });

        paginationContainer.appendChild(pageButton);
    }
}

function editDepartment(id) {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/department/${id}`, {
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
    .then(department => {
        document.getElementById("editDepartmentId").value = department.departmentId;
        document.getElementById("editDepartmentName").value = department.departmentName;
        document.getElementById("editManagerId").value = department.managerId;
        document.getElementById("editLocationId").value = department.locationId;

        const editModal = new bootstrap.Modal(document.getElementById("editDepartmentModal"));
        editModal.show();
    })
    .catch(error => {
        console.error("Error saat mengambil data department untuk edit:", error);
    });
}

document.getElementById("addDepartmentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const newDepartment = {
        departmentName: document.getElementById("addDepartmentName").value,
        managerId: document.getElementById("addManagerId").value,
        locationId: document.getElementById("addLocationId").value
    };

    fetch("http://localhost:8080/department/create", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newDepartment)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add department');
        }
        return response.json();
    })
    .then(data => {
        const addDepartmentModal = bootstrap.Modal.getInstance(document.getElementById("addDepartmentModal"));
        addDepartmentModal.hide();

        getAllDepartments();
    })
    .catch(error => {
        console.error("Error saat menambahkan department:", error);
    });
});

document.getElementById("editDepartmentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const updatedDepartment = {
        departmentId: document.getElementById("editDepartmentId").value,
        departmentName: document.getElementById("editDepartmentName").value,
        managerId: document.getElementById("editManagerId").value,
        locationId: document.getElementById("editLocationId").value
    };

    fetch(`http://localhost:8080/department/update/${updatedDepartment.departmentId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedDepartment)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update department');
        }
        return response.json();
    })
    .then(data => {
        const editDepartmentModal = bootstrap.Modal.getInstance(document.getElementById("editDepartmentModal"));
        editDepartmentModal.hide();

        getAllDepartments();
    })
    .catch(error => {
        console.error("Error saat memperbarui department:", error);
    });
});

function deleteDepartment(id) {
    const token = localStorage.getItem("token");

    if (!confirm("Apakah Anda yakin ingin menghapus data department ini?")) {
        return;
    }

    fetch(`http://localhost:8080/department/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 204) {
            alert("Data department berhasil dihapus.");
            getAllDepartments();
        } else {
            throw new Error('Failed to delete department');
        }
    })
    .catch(error => {
        console.error("Error saat menghapus department:", error);
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