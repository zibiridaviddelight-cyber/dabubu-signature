// =======================================================
// Main JavaScript for dabubu signature Website
// This file handles all dynamic and interactive features.
// =======================================================

// === Mobile Menu Toggle ===
// This function handles showing and hiding the mobile navigation menu.
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}


// === Smooth Scrolling for Navigation ===
// This script enables smooth scrolling when clicking on internal links
// and automatically closes the mobile menu afterward.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });

            // Close mobile menu on link click
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// === Image Gallery Modal ===
// This script creates a full-screen modal to show a larger version of
// a gallery image when the user clicks on it.
const galleryImages = document.querySelectorAll('.gallery-img img');
const modal = document.createElement('div');
modal.id = 'image-modal';
modal.classList.add('fixed', 'inset-0', 'z-[100]', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-80', 'hidden');
document.body.appendChild(modal);

modal.innerHTML = `
    <div class="relative max-w-5xl mx-auto p-4 md:p-8">
        <img id="modal-image" src="" alt="Enlarged view" class="rounded-lg shadow-xl max-h-[90vh] mx-auto">
        <button id="modal-close" class="absolute top-4 right-4 text-white text-3xl font-bold p-2 leading-none">&times;</button>
    </div>
`;

const modalImage = document.getElementById('modal-image');
const modalCloseButton = document.getElementById('modal-close');

// Add click event listeners to each gallery image
galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        // Update the modal image source and show the modal
        modalImage.src = img.src;
        modal.classList.remove('hidden');
    });
});

// Add event listener to close the modal
modalCloseButton.addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Close modal when clicking outside the image
modal.addEventListener('click', (e) => {
    if (e.target.id === 'image-modal') {
        modal.classList.add('hidden');
    }
});

// === Scroll-to-Top Button ===
// A small button that appears after scrolling down and scrolls the user back to the top of the page.
const scrollToTopButton = document.createElement('button');
scrollToTopButton.innerHTML = '&uarr;'; // Up arrow
scrollToTopButton.classList.add('fixed', 'bottom-4', 'right-4', 'bg-gray-800', 'text-white', 'p-3', 'rounded-full', 'shadow-lg', 'transition-opacity', 'duration-300', 'hover:bg-gray-700', 'focus:outline-none', 'z-50', 'opacity-0');
document.body.appendChild(scrollToTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200) {
        scrollToTopButton.classList.remove('opacity-0');
    } else {
        scrollToTopButton.classList.add('opacity-0');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// === Gemini-powered Subject Line Suggester ===
// This script uses the Gemini API to generate a professional email subject line
// based on the user's message in the contact form.
const suggestSubjectBtn = document.getElementById('suggest-subject-btn');
const messageInput = document.getElementById('message');
const subjectInput = document.getElementById('subject');
const loadingSpinner = document.getElementById('loading-spinner');

// Add event listener to the "Suggest Subject Line" button
suggestSubjectBtn.addEventListener('click', async () => {
    const userMessage = messageInput.value.trim();
    if (userMessage === '') {
        subjectInput.value = 'Please write a message first.';
        return;
    }

    loadingSpinner.classList.remove('hidden');
    subjectInput.value = 'Generating...';
    subjectInput.disabled = true;

    // The prompt for the Gemini API
    const prompt = `Based on the following message, generate a single, concise, professional email subject line. Do not include any other text besides the subject line.
    
    Message: "${userMessage}"
    
    Subject:`;

    let retries = 0;
    const maxRetries = 5;
    const initialDelay = 1000; // 1 second

    while (retries < maxRetries) {
        try {
            const payload = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            };

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // If the response is not ok, throw an error to trigger the catch block
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
                subjectInput.value = generatedText.trim();
                break; // Exit the loop on success
            } else {
                subjectInput.value = 'Error generating subject.';
                console.error('API response was not in the expected format.');
                break;
            }

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            retries++;
            if (retries < maxRetries) {
                const delay = initialDelay * Math.pow(2, retries);
                await new Promise(res => setTimeout(res, delay));
            } else {
                subjectInput.value = 'Failed to generate. Please try again later.';
            }
        } finally {
            loadingSpinner.classList.add('hidden');
            subjectInput.disabled = false;
        }
    }
});
