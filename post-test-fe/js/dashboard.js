document.addEventListener("DOMContentLoaded", function() {
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
        menuDepartment.addEventListener("click", function() {
            window.location.href = "department.html";
        });
    }

    if (menuEmployee) {
        menuEmployee.addEventListener("click", function() {
            window.location.href = "employee.html";
        });
    }

    if (menuJob) {
        menuJob.addEventListener("click", function() {
            window.location.href = "job.html";
        });
    }

    if (menuJobHistory) {
        menuJobHistory.addEventListener("click", function() {
            window.location.href = "jobHistory.html";
        });
    }

    const logoutLink = document.querySelector(".nav-link[onclick='logout()']");
    if (logoutLink) {
        logoutLink.addEventListener("click", function(event) {
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

    if (window.location.href.includes("dashboard.html")) {
        checkLoginStatus();
        loadPage('department');
    }
});
