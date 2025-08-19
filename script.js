// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu on link click
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// The old contact form javascript has been removed.
// Formspree will handle the submission now.

// === NEW FEATURE: Image Gallery Modal ===
// This script handles opening a modal when a gallery image is clicked,
// and closing it when the user clicks off the image or on the close button.
// It uses a single modal element and updates its content dynamically.

// Get the necessary elements
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
