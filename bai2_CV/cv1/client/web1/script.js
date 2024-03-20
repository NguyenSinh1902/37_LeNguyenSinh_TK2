document.addEventListener("DOMContentLoaded", function () {
  // Mã JavaScript của bạn ở đây
});

fetch("http://localhost:3000/work_experience")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((workExperience) => {
    const workExperienceSection = document.getElementById(
      "work-experience-section"
    );
    workExperience.forEach((exp) => {
      const expElement = document.createElement("p");
      expElement.textContent =
        exp.position + " at " + exp.company + ", " + exp.description;
      workExperienceSection.appendChild(expElement);
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

fetch("http://localhost:3000/education")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((education) => {
    const educationSection = document.getElementById("education-section");
    education.forEach((edu) => {
      const eduElement = document.createElement("p");
      eduElement.textContent = edu.school + ", " + edu.period;
      educationSection.appendChild(eduElement);
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

fetch("http://localhost:3000/skills")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((skills) => {
    var skillCategories = {};

    skills.forEach((skill) => {
      if (skillCategories[skill.category]) {
        skillCategories[skill.category].push(skill.skill);
      } else {
        skillCategories[skill.category] = [skill.skill];
      }
    });

    // Render skillCategories
    const skillsList = document.getElementById("skills-list");
    for (const category in skillCategories) {
      const categorySkills = skillCategories[category];
      const categoryElement = document.createElement("li");
      categoryElement.innerHTML = `<strong>${category}:</strong> ${categorySkills.join(
        ", "
      )}`;
      skillsList.appendChild(categoryElement);
    }
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
