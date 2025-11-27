document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });

    // Handle form submission
    const form = document.querySelector('.contact-form');
    if (form) {
        const originalFormHTML = form.innerHTML;

        const handleSubmit = (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            button.textContent = 'Sending...';
            button.disabled = true;

            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
                .then(() => {
                    // Success - show thank you message with reset button
                    form.innerHTML = '<div style="text-align: center; padding: 2rem;"><h3 style="color: #06b6d4; margin-bottom: 1rem;">Thank You!</h3><p>Your message has been sent successfully. We\'ll get back to you soon.</p><button class="btn btn-primary" style="margin-top: 1.5rem;">Send Another Message</button></div>';

                    // Add click handler to reset button
                    const resetButton = form.querySelector('.btn');
                    resetButton.addEventListener('click', () => {
                        form.innerHTML = originalFormHTML;
                        // Re-attach the submit event listener
                        form.addEventListener('submit', handleSubmit);
                    });
                })
                .catch((error) => {
                    // Error
                    button.textContent = originalText;
                    button.disabled = false;
                    alert('Oops! There was an error sending your message. Please try again.');
                    console.error('Form submission error:', error);
                });
        };

        form.addEventListener('submit', handleSubmit);
    }
});
