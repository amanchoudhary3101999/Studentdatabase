document.addEventListener('DOMContentLoaded', () => {
    let students = [];
    let filteredStudents = [];

    fetch('https://gist.githubusercontent.com/harsh3195/b441881e0020817b84e34d27ba448418/raw/c4fde6f42310987a54ae1bc3d9b8bfbafac15617/demo-json-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            students = data;
            filteredStudents = data;
            displayStudents(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function displayStudents(data) {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) {
            console.error('No table body found with id "tableBody"');
            return;
        }
        tableBody.innerHTML = data.map(student => `
            <tr>
                <td class="name-cell">
                    <img src="${student.img_src}" alt="${student.first_name} ${student.last_name}">
                    ${student.first_name} ${student.last_name}
                </td>
                <td>${student.email}</td>
                <td>${student.class}</td>
                <td>${student.marks}</td>
                <td>${student.passing ? 'Passing' : 'Failed'}</td>
                <td>${student.gender}</td>
            </tr>
        `).join('');
    }

    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');

    function filterStudents() {
        const query = searchBar.value.toLowerCase();
        filteredStudents = students.filter(student => 
            student.first_name.toLowerCase().includes(query) ||
            student.last_name.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query)
        );
        displayStudents(filteredStudents);
    }

    searchBar.addEventListener('input', filterStudents);
    searchButton.addEventListener('click', filterStudents);

    document.getElementById('sortAZ').addEventListener('click', () => {
        filteredStudents.sort((a, b) => 
            `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
        );
        displayStudents(filteredStudents);
    });

    document.getElementById('sortZA').addEventListener('click', () => {
        filteredStudents.sort((a, b) => 
            `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`)
        );
        displayStudents(filteredStudents);
    });

    document.getElementById('sortMarks').addEventListener('click', () => {
        filteredStudents.sort((a, b) => a.marks - b.marks);
        displayStudents(filteredStudents);
    });

    document.getElementById('sortPassing').addEventListener('click', () => {
        filteredStudents = students.filter(student => student.passing);
        displayStudents(filteredStudents);
    });

    document.getElementById('sortClass').addEventListener('click', () => {
        filteredStudents.sort((a, b) => a.class - b.class);
        displayStudents(filteredStudents);
    });

    document.getElementById('sortGender').addEventListener('click', () => {
        const males = filteredStudents.filter(student => student.gender === 'Male');
        const females = filteredStudents.filter(student => student.gender === 'Female');
        displayStudents(males);
        const tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML += `
            <h2>Female Students</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Marks</th>
                        <th>Passing</th>
                        <th>Gender</th>
                    </tr>
                </thead>
                <tbody>
                    ${females.map(student => `
                        <tr>
                            <td class="name-cell">
                                <img src="${student.img_src}" alt="${student.first_name} ${student.last_name}">
                                ${student.first_name} ${student.last_name}
                            </td>
                            <td>${student.email}</td>
                            <td>${student.class}</td>
                            <td>${student.marks}</td>
                            <td>${student.passing ? 'Passing' : 'Failed'}</td>
                            <td>${student.gender}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
});