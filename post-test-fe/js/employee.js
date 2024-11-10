let currentPage = 1;
const rowsPerPage = 5;
let allEmployees = [];

function getAllEmployees() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/employees/details", {
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
        allEmployees = data;
        displayEmployees(allEmployees);
    })
    .catch(error => {
        console.error("Error saat mengambil data employee:", error);
    });
}

{/* <td>${employee.departmentName}</td> */}
function displayEmployees(employees) {
    const tableBody = document.querySelector("#employeeTable tbody");
    tableBody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedEmployees = employees.slice(start, end);

    if (paginatedEmployees.length > 0) {
        paginatedEmployees.forEach(employee => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${employee.employeeId}</td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.phoneNumber}</td>
                <td>${employee.hireDate}</td>
                <td>${employee.jobTitle || 'N/A'}</td> <!-- Tampilkan jobTitle -->
                <td>${employee.salary}</td>
                <td>${employee.commissionPct}</td>
                <td>${employee.managerId}</td>
                <td>${employee.departmentName || 'N/A'}</td> <!-- Tampilkan departmentName -->
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editEmployee(${employee.employeeId})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.employeeId})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        console.log("Tidak ada data employee yang ditemukan");
    }

    updatePagination(employees);
}


function filterEmployees() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    
    const filteredEmployees = allEmployees.filter(employee => 
        employee.firstName.toLowerCase().includes(searchInput) ||
        employee.lastName.toLowerCase().includes(searchInput) ||
        employee.phoneNumber.toString().includes(searchInput) ||
        employee.salary.toString().includes(searchInput) ||
        employee.email.toLowerCase().includes(searchInput)
    );

    displayEmployees(filteredEmployees);
}

document.addEventListener("DOMContentLoaded", getAllEmployees);

function updatePagination(employees) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const pageCount = Math.ceil(employees.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("btn", "btn-secondary", "mx-1");
        pageButton.textContent = i;
        if (i === currentPage) pageButton.classList.add("active");

        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayEmployees(employees);
        });

        paginationContainer.appendChild(pageButton);
    }
}

function editEmployee(id) {
    const token = localStorage.getItem("token");

    console.log("Mencoba mengambil data employee dengan ID:", id);

    fetch(`http://localhost:8080/employees/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(employee => {
        console.log("Data employee yang diterima untuk edit:", employee);

        document.getElementById("editEmployeeId").value = employee.employeeId;
        document.getElementById("editFirstName").value = employee.firstName;
        document.getElementById("editLastName").value = employee.lastName;
        document.getElementById("editEmail").value = employee.email;
        document.getElementById("editPhoneNumber").value = employee.phoneNumber;
        document.getElementById("editHireDate").value = employee.hireDate;
        document.getElementById("editJobId").value = employee.jobId;
        document.getElementById("editSalary").value = employee.salary;
        document.getElementById("editCommissionPct").value = employee.commissionPct;
        document.getElementById("editManagerId").value = employee.managerId;
        document.getElementById("editDepartmentId").value = employee.departmentId; //
        
        const editModal = new bootstrap.Modal(document.getElementById("editEmployeeModal"));
        editModal.show();
    })
    .catch(error => {
        console.error("Error saat mengambil data employee untuk edit:", error); // Menambahkan log error
    });
}

document.getElementById("addEmployeeForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

    const token = localStorage.getItem("token");
    const newEmployee = {
        firstName: document.getElementById("addFirstName").value,
        lastName: document.getElementById("addLastName").value,
        email: document.getElementById("addEmail").value,
        phoneNumber: document.getElementById("addPhoneNumber").value,
        hireDate: document.getElementById("addHireDate").value,
        jobId: document.getElementById("addJobId").value,
        salary: document.getElementById("addSalary").value,
        commissionPct: document.getElementById("addCommissionPct").value,
        managerId: document.getElementById("addManagerId").value,
        departmentId: document.getElementById("addDepartmentId").value
    };

    fetch("http://localhost:8080/employees/create", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEmployee)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add employee');
        }
        return response.json();
    })
    .then(data => {
        console.log("Employee added:", data);

        const addEmployeeModal = bootstrap.Modal.getInstance(document.getElementById("addEmployeeModal"));
        addEmployeeModal.hide();

        getAllEmployees();
    })
    .catch(error => {
        console.error("Error saat menambahkan employee:", error);
    });
});

document.getElementById("editEmployeeForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    const updatedEmployee = {
        employeeId: document.getElementById("editEmployeeId").value,
        firstName: document.getElementById("editFirstName").value,
        lastName: document.getElementById("editLastName").value,
        email: document.getElementById("editEmail").value,
        phoneNumber: document.getElementById("editPhoneNumber").value,
        hireDate: document.getElementById("editHireDate").value,
        jobId: document.getElementById("editJobId").value,
        salary: document.getElementById("editSalary").value,
        commissionPct: document.getElementById("editCommissionPct").value,
        managerId: document.getElementById("editManagerId").value,
        departmentId: document.getElementById("editDepartmentId").value
    };

    fetch(`http://localhost:8080/employees/update/${updatedEmployee.employeeId}`, {
        method: "PUT", 
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedEmployee) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update employee');
        }
        return response.json();
    })
    .then(data => {
        console.log("Employee updated:", data); 

        const editEmployeeModal = bootstrap.Modal.getInstance(document.getElementById("editEmployeeModal"));
        editEmployeeModal.hide();

        getAllEmployees();
    })
    .catch(error => {
        console.error("Error saat memperbarui employee:", error);
    });
});

function getJobs() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/job/all", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(jobs => {
        console.log("Data Job:", jobs); 

        const addJobSelect = document.getElementById("addJobId");

        addJobSelect.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Job";
        addJobSelect.appendChild(defaultOption);

        jobs.forEach(job => {
            const option = document.createElement("option");
            option.value = job.jobId;
            option.textContent = job.jobTitle;
            
            addJobSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error saat mengambil data job:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    getJobs();
});

function getDepartments() {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/department/all", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(departments => {
        console.log("Data Departemen:", departments); 

        const addDepartmentSelect = document.getElementById("addDepartmentId");

        addDepartmentSelect.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Department";
        addDepartmentSelect.appendChild(defaultOption);

        departments.forEach(department => {
            const option = document.createElement("option");
            option.value = department.departmentId;
            option.textContent = department.departmentName;
            
            addDepartmentSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error saat mengambil data departemen:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    getDepartments();
});

function deleteEmployee(id) {
    const token = localStorage.getItem("token");

    if (!confirm("Apakah Anda yakin ingin menghapus data employee ini?")) {
        return;
    }

    fetch(`http://localhost:8080/employees/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.status === 204) {
            alert("Data employee berhasil dihapus.");
            getAllEmployees();
        } else {
            throw new Error('Gagal menghapus data employee');
        }
    })
    .catch(error => console.error("Error saat menghapus data employee:", error));
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