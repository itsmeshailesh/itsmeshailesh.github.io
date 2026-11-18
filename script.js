document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            renderProfile(data.profile);
            renderSummary(data.summary);
            renderExperience(data.experience);
            renderEducation(data.education);
            renderCertifications(data.certifications);
            renderSkills(data.skills);
            renderProjects(data.projects);

            setTimeout(optimizeLayout, 100);
        })
        .catch(error => console.error('Error loading data:', error));
});

function optimizeLayout() {
    const paperSheet = document.querySelector('.paper-sheet');
    const leftColumn = document.getElementById('left-column');
    const rightColumn = document.getElementById('right-column');

    if (!paperSheet || !leftColumn || !rightColumn) return;

    const maxOverflowRatio = 0.20;
    let currentFontSize = 16;

    while (paperSheet.scrollHeight > paperSheet.clientHeight && currentFontSize > 10) {
        const overflowRatio = (paperSheet.scrollHeight - paperSheet.clientHeight) / paperSheet.clientHeight;

        if (overflowRatio > maxOverflowRatio) break;

        currentFontSize -= 0.5;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
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
    container.innerHTML = experience.map(job => `
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
    `).join('');
}

function renderEducation(education) {
    const container = document.getElementById('education-list');
    container.innerHTML = education.map(edu => {
        const additionalInfo = edu.additional_info ? `<div class="text-muted small">${edu.additional_info}</div>` : '';
        return `
            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-baseline">
                    <h5 class="h6 fw-bold mb-1">${edu.degree}</h5>
                    <span class="small text-muted">${edu.year}</span>
                </div>
                ${additionalInfo}
                <div class="fst-italic small">${edu.school}</div>
            </div>
        `;
    }).join('');
}

function renderCertifications(certifications) {
    const container = document.getElementById('certifications-list');

    if (!certifications || certifications.length === 0) {
        document.getElementById('certifications-section').style.display = 'none';
        return;
    }

    container.innerHTML = certifications.map(certification => `
        <div class="mb-3">
            <h5 class="h6 fw-bold mb-1">${certification.name}</h5>
            ${certification.issuer ? `<div class="small text-muted">${certification.issuer}</div>` : ''}
            ${certification.year ? `<div class="small text-muted">${certification.year}</div>` : ''}
        </div>
    `).join('');
}

function renderSkills(skills) {
    const container = document.getElementById('skills-list');
    container.innerHTML = skills.map(skillGroup => `
        <div class="mb-3">
            <h4 class="h6 fw-bold mb-1">${skillGroup.category}</h4>
            <p class="small mb-2">${skillGroup.items}</p>
        </div>
    `).join('');
}

function renderProjects(projects) {
    const container = document.getElementById('projects-list');
    container.innerHTML = projects.map(project => `
        <div class="mb-3">
            <h4 class="h6 fw-bold mb-1">${project.name}</h4>
            <p class="small mb-2">${project.description}</p>
        </div>
    `).join('');
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

    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflowY;
    const originalFontSize = document.documentElement.style.fontSize;

    element.classList.add('pdf-mode');
    element.style.height = 'auto';
    element.style.overflowY = 'visible';

    const a4Ratio = 1.414;
    let currentFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const minFontSize = 8;

    while (element.scrollHeight > element.offsetWidth * a4Ratio && currentFontSize > minFontSize) {
        currentFontSize -= 0.5;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
    }

    html2pdf().set(opt).from(element).save().then(() => {
        element.classList.remove('pdf-mode');
        element.style.height = originalHeight;
        element.style.overflowY = originalOverflow;
        document.documentElement.style.fontSize = originalFontSize;
    });
}
