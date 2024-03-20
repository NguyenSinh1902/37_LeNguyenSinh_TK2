// Function để gửi yêu cầu GET đến server và xử lý kết quả
function fetchData(endpoint, sectionId) {
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Tạo các phần tử HTML tương ứng với dữ liệu và thêm vào section có id tương ứng
        const section = document.getElementById(sectionId);
        data.forEach(item => {
          const element = document.createElement('div');
          element.innerHTML = `
            <p><strong>${item.position || item.school || item.category}</strong>: ${item.description || item.period || item.skill}</p>
          `;
          section.appendChild(element);
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }
  
  // Gọi function để lấy dữ liệu từ các endpoint trên server và đổ vào các section tương ứng trong HTML
  fetchData('http://localhost:8070/work_experience', 'work-experience-section');
  fetchData('http://localhost:8070/education', 'education-section');
  fetchData('http://localhost:8070/skills', 'skills-section');
  