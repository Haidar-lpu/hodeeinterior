document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector("#navMenu ul");

  if (toggle && navMenu) {

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("show");
      toggle.textContent = navMenu.classList.contains("show") ? "✖" : "☰";
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !toggle.contains(e.target)) {
        navMenu.classList.remove("show");
        toggle.textContent = "☰";
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("show");
        toggle.textContent = "☰";
      }
    });

  }

  const navLinks = document.querySelectorAll("#navMenu ul li a");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("show")) {
        navMenu.classList.remove("show");
        toggle.textContent = "☰";
      }
    });
  });

  const enquiryForm = document.getElementById("enquiryForm");

  if (enquiryForm) {

    enquiryForm.addEventListener("submit", async (e) => {

      e.preventDefault();

      const name = document.getElementById("name")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();
      const service = document.getElementById("service")?.value;
      const message = document.getElementById("message")?.value.trim();

      if (!name || !email || !phone || !message) {
        alert("Please fill all fields");
        return;
      }

      const phonePattern = /^[0-9]{10}$/;

      if (!phonePattern.test(phone)) {
        alert("Enter valid 10-digit phone number");
        return;
      }

      try {

        const response = await fetch("/api/enquiry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            service,
            message
          })
        });

        if (response.ok) {
          window.location.href = "/success.html";
        } else {
          alert("Error submitting enquiry");
        }

      } catch (err) {
        console.error(err);
        alert("Server error");
      }

    });

  }

  const projectContainer = document.getElementById("projects");

  if (projectContainer) {

    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {

        projectContainer.innerHTML = "";

        data.forEach(project => {

          const card = document.createElement("div");
          card.className = "project-card";

          card.innerHTML = `
            <img src="/uploads/${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p><b>Status:</b> ${project.status}</p>
          `;

          projectContainer.appendChild(card);

        });

      })
      .catch(err => console.error(err));

  }

  const fadeElements = document.querySelectorAll(".fade-up");

  if (fadeElements.length > 0) {

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.2 });

    fadeElements.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "0.6s ease";
      observer.observe(el);
    });

  }

});