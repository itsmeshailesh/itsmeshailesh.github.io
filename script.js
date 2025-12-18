document.addEventListener('DOMContentLoaded', () => {
    // Add timestamp to prevent caching
    fetch('data.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            renderProfile(data.profile);
            renderSummary(data.summary);
            renderExperience(data.experience);
            renderEducation(data.education);
            renderSkills(data.skills);
            renderProjects(data.projects);

            // Allow browser to render before optimizing layout
            setTimeout(optimizeLayout, 100);
        })
        .catch(error => console.error('Error loading data:', error));
});

function optimizeLayout() {
    const paperSheet = document.querySelector('.paper-sheet');
    const leftColumn = document.getElementById('left-column');
    const rightColumn = document.getElementById('right-column');
    const educationSection = document.getElementById('education-section');

    if (!paperSheet || !leftColumn || !rightColumn || !educationSection) return;

    // 1. Check if Left Column is shorter than Right Column
    // If so, move Education to Left Column to balance
    if (leftColumn.offsetHeight < rightColumn.offsetHeight) {
        console.log('Moving Education to Left Column');
        leftColumn.appendChild(educationSection);
    }

    // 2. Check for Overflow and Adjust Font Size
    // Only if overflow is within 20%
    const maxOverflowRatio = 0.20;
    let currentFontSize = 16; // Default browser root font size is usually 16px

    // Loop to reduce font size if overflowing
    while (paperSheet.scrollHeight > paperSheet.clientHeight && currentFontSize > 10) {
        const overflowRatio = (paperSheet.scrollHeight - paperSheet.clientHeight) / paperSheet.clientHeight;

        if (overflowRatio > maxOverflowRatio) {
            console.log('Overflow too large for font scaling:', overflowRatio);
            break; // Too much overflow, let it scroll
        }

        currentFontSize -= 0.5;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
        console.log(`Reducing root font size to ${currentFontSize}px`);
    }
}

function renderProfile(profile) {
    document.title = profile.name;
    document.getElementById('name').textContent = profile.name;
    document.getElementById('title').textContent = profile.title;

    const decodedPhone = atob(profile.contact.phone);
    const contactHtml = `
        <span><a href="mailto:${profile.contact.email}">${profile.contact.email}</a></span>
        <span class="phone-number"><a href="tel:${decodedPhone}">${decodedPhone}</a></span>
        <span><a href="https://github.com/${profile.contact.github}" target="_blank" rel="noopener noreferrer">github/${profile.contact.github}</a></span>
        <span><a href="https://linkedin.com/in/${profile.contact.linkedin}" target="_blank" rel="noopener noreferrer">linkedin/${profile.contact.linkedin}</a></span>
    `;
    document.getElementById('contact').innerHTML = contactHtml;
}

function renderSummary(summary) {
    document.getElementById('summary').textContent = summary;
}

function renderExperience(experience) {
    const container = document.getElementById('experience-list');
    let html = '';
    experience.forEach(job => {
        html += `
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-baseline">
                    <h4 class="h5 fw-bold mb-1">${job.role}</h4>
                    <span class="text-muted small">${job.period}</span>
                </div>
                <div class="text-muted fst-italic mb-2">${job.company}</div>
                <ul>
                    ${job.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderEducation(education) {
    const container = document.getElementById('education-list');
    let html = '';
    education.forEach(edu => {
        const additionalInfo = edu.additional_info ? `<div class="text-muted" style="font-size: x-small;">${edu.additional_info}</div>` : '';
        html += `
            <div class="mb-3 d-flex align-items-baseline">
                <span class="me-2">•</span>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-baseline">
                        <h5 class="h6 fw-bold mb-1">${edu.degree}</h5>
                        <span class="small text-muted">${edu.year}</span>
                    </div>
                    ${additionalInfo}
                    <div class="fst-italic">${edu.school}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderSkills(skills) {
    const container = document.getElementById('skills-list');
    let html = '';
    skills.forEach(skillGroup => {
        html += `
            <div class="mb-3">
                <h4 class="h6 fw-bold mb-1">${skillGroup.category}</h4>
                <p class="small mb-2">${skillGroup.items}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderProjects(projects) {
    const container = document.getElementById('projects-list');
    let html = '';
    projects.forEach(project => {
        html += `
            <div class="mb-3">
                <h4 class="h6 fw-bold mb-1">${project.name}</h4>
                <p class="small mb-2">${project.description}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function downloadPDF() {
    const element = document.querySelector('.paper-sheet');
    const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Store original styles
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflowY;
    const originalFontSize = document.documentElement.style.fontSize;

    // Prepare for capture
    element.classList.add('pdf-mode'); // Force single column layout
    element.style.height = 'auto';
    element.style.overflowY = 'visible';

    // Fit to A4 Page Logic
    // A4 Aspect Ratio = 1.414 (Height / Width)
    // We want content height <= width * 1.414
    const a4Ratio = 1.414;
    let currentFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const minFontSize = 8; // Allow shrinking a bit more for single column

    // Iteratively reduce font size if content is too tall for one page
    while (element.scrollHeight > element.offsetWidth * a4Ratio && currentFontSize > minFontSize) {
        currentFontSize -= 0.5;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
        console.log(`PDF Generation: Reducing font size to ${currentFontSize}px to fit single page`);
    }

    html2pdf().set(opt).from(element).save().then(() => {
        // Restore original styles
        element.classList.remove('pdf-mode');
        element.style.height = originalHeight;
        element.style.overflowY = originalOverflow;
        document.documentElement.style.fontSize = originalFontSize;
    });
}
