/* ==========================================================================
   CarePulse Medical Center - Master JavaScript (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DOM ELEMENT REFERENCES
    // ----------------------------------------------------------------------
    const appointmentForm = document.getElementById('appointmentForm');
    const formContainer = document.getElementById('formContainer');
    const successCard = document.getElementById('successCard');

    // Input Fields
    const patientName = document.getElementById('patientName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const age = document.getElementById('age');
    const appointmentDate = document.getElementById('appointmentDate');
    const preferredTime = document.getElementById('preferredTime');
    const reason = document.getElementById('reason');
    const emergency = document.getElementById('emergency');
    const terms = document.getElementById('terms');

    // Error Small Elements
    const patientNameError = document.getElementById('patientNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const ageError = document.getElementById('ageError');
    const genderError = document.getElementById('genderError');
    const appointmentDateError = document.getElementById('appointmentDateError');
    const preferredTimeError = document.getElementById('preferredTimeError');
    const reasonError = document.getElementById('reasonError');
    const termsError = document.getElementById('termsError');

    // Success Display Elements
    const displayApptId = document.getElementById('displayApptId');
    const displayPatientName = document.getElementById('displayPatientName');
    const displayDoctorName = document.getElementById('displayDoctorName');
    const displayApptDate = document.getElementById('displayApptDate');
    const displayApptTime = document.getElementById('displayApptTime');
    const displayReason = document.getElementById('displayReason');

    // Buttons
    const bookAnotherBtn = document.getElementById('bookAnotherBtn');
    const printBtn = document.getElementById('printBtn');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const header = document.getElementById('header');

    // ----------------------------------------------------------------------
    // 2. INITIALIZATION & DATE RESTRICTIONS
    // ----------------------------------------------------------------------
    /**
     * Sets the minimum date for the appointment date input to today's date
     * to prevent patients from selecting previous dates.
     */
    function initDateRestriction() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        const minDateString = `${year}-${month}-${day}`;
        appointmentDate.min = minDateString;
    }

    initDateRestriction();

    // ----------------------------------------------------------------------
    // 3. FORM VALIDATION & HELPER FUNCTIONS
    // ----------------------------------------------------------------------

    /**
     * Displays an error message for a specific input field
     */
    function showError(inputElement, errorElement, message) {
        if (inputElement && inputElement.classList) {
            inputElement.classList.add('input-error');
        }
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /**
     * Clears an error message for a specific input field
     */
    function clearError(inputElement, errorElement) {
        if (inputElement && inputElement.classList) {
            inputElement.classList.remove('input-error');
        }
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /**
     * Clears all validation errors across the form
     */
    function clearAllErrors() {
        const inputs = appointmentForm.querySelectorAll('.form-control');
        inputs.forEach(input => input.classList.remove('input-error'));

        const errorSmalls = appointmentForm.querySelectorAll('.error-msg');
        errorSmalls.forEach(small => small.textContent = '');
    }

    /**
     * Validates Email format using Standard Regex
     */
    function isValidEmail(emailVal) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailVal);
    }

    /**
     * Validates Phone Number (Exactly 10 digits)
     */
    function isValidPhone(phoneVal) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phoneVal.trim());
    }

    /**
     * Validates the entire booking form
     * @returns {boolean} True if all validations pass, false otherwise
     */
    function validateForm() {
        let isValid = true;
        clearAllErrors();

        // 1. Patient Name Validation
        const nameValue = patientName.value.trim();
        if (!nameValue) {
            showError(patientName, patientNameError, 'Patient name is required.');
            isValid = false;
        } else if (nameValue.length < 2) {
            showError(patientName, patientNameError, 'Name must be at least 2 characters.');
            isValid = false;
        }

        // 2. Email Address Validation
        const emailValue = email.value.trim();
        if (!emailValue) {
            showError(email, emailError, 'Email address is required.');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(email, emailError, 'Please enter a valid email address.');
            isValid = false;
        }

        // 3. Phone Number Validation (Exactly 10 digits)
        const phoneValue = phone.value.trim();
        if (!phoneValue) {
            showError(phone, phoneError, 'Phone number is required.');
            isValid = false;
        } else if (!isValidPhone(phoneValue)) {
            showError(phone, phoneError, 'Phone number must contain exactly 10 digits.');
            isValid = false;
        }

        // 4. Age Validation (Between 1 and 120)
        const ageValue = parseInt(age.value, 10);
        if (!age.value || isNaN(ageValue)) {
            showError(age, ageError, 'Age is required.');
            isValid = false;
        } else if (ageValue < 1 || ageValue > 120) {
            showError(age, ageError, 'Age must be between 1 and 120.');
            isValid = false;
        }

        // 5. Gender Radio Selection Validation
        const selectedGender = appointmentForm.querySelector('input[name="gender"]:checked');
        if (!selectedGender) {
            showError(null, genderError, 'Please select a gender.');
            isValid = false;
        }

        // 6. Appointment Date Validation
        const dateValue = appointmentDate.value;
        if (!dateValue) {
            showError(appointmentDate, appointmentDateError, 'Appointment date is required.');
            isValid = false;
        } else {
            const selectedDate = new Date(dateValue + 'T00:00:00');
            const todayAtMidnight = new Date();
            todayAtMidnight.setHours(0, 0, 0, 0);

            if (selectedDate < todayAtMidnight) {
                showError(appointmentDate, appointmentDateError, 'Cannot select a past date.');
                isValid = false;
            }
        }

        // 7. Preferred Time Slot Validation
        if (!preferredTime.value) {
            showError(preferredTime, preferredTimeError, 'Please select a preferred time slot.');
            isValid = false;
        }

        // 8. Reason for Visit Validation
        const reasonValue = reason.value.trim();
        if (!reasonValue) {
            showError(reason, reasonError, 'Reason for visit is required.');
            isValid = false;
        }

        // 9. Terms & Conditions Checkbox Validation
        if (!terms.checked) {
            showError(terms, termsError, 'You must agree to the Terms & Conditions.');
            isValid = false;
        }

        return isValid;
    }

    // Real-time error clearing when user types or changes input
    patientName.addEventListener('input', () => clearError(patientName, patientNameError));
    email.addEventListener('input', () => clearError(email, emailError));
    phone.addEventListener('input', () => clearError(phone, phoneError));
    age.addEventListener('input', () => clearError(age, ageError));
    appointmentDate.addEventListener('change', () => clearError(appointmentDate, appointmentDateError));
    preferredTime.addEventListener('change', () => clearError(preferredTime, preferredTimeError));
    reason.addEventListener('input', () => clearError(reason, reasonError));
    terms.addEventListener('change', () => clearError(terms, termsError));
    
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', () => clearError(null, genderError));
    });

    // ----------------------------------------------------------------------
    // 4. RANDOM APPOINTMENT ID GENERATOR & BOOKING SUMMARY
    // ----------------------------------------------------------------------

    /**
     * Generates a random Appointment ID formatted as APT-YYYYMMDD-XXXX
     * Example: APT-20260730-4587
     */
    function generateAppointmentId() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 random digits

        return `APT-${year}${month}${day}-${randomDigits}`;
    }

    /**
     * Formats date string from YYYY-MM-DD to a human-friendly format
     * Example: 2026-08-05 -> August 5, 2026
     */
    function formatDate(dateStr) {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;

        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // ----------------------------------------------------------------------
    // 5. FORM SUBMISSION EVENT HANDLER
    // ----------------------------------------------------------------------
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate Form
        if (validateForm()) {
            // Get form values
            const nameVal = patientName.value.trim();
            const dateVal = appointmentDate.value;
            const timeVal = preferredTime.value;
            const reasonVal = reason.value.trim();
            const isEmergency = emergency.checked;

            // Generate Appointment Pass ID
            const apptId = generateAppointmentId();

            // Populate Success Card Details
            displayApptId.textContent = apptId;
            displayPatientName.textContent = nameVal;
            displayDoctorName.textContent = "Dr. Karthik Sundaram (Cardiologist)";
            displayApptDate.textContent = formatDate(dateVal);
            displayApptTime.textContent = timeVal;
            displayReason.textContent = isEmergency ? `[URGENT] ${reasonVal}` : reasonVal;

            // Hide Form Card and Show Success Card
            formContainer.classList.add('hidden');
            successCard.classList.remove('hidden');

            // Smooth Scroll to Success Card
            successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Focus on first error element
            const firstErrorInput = appointmentForm.querySelector('.input-error');
            if (firstErrorInput) {
                firstErrorInput.focus();
            }
        }
    });

    // ----------------------------------------------------------------------
    // 6. RESET & PRINT BUTTON HANDLERS
    // ----------------------------------------------------------------------

    /**
     * Resets the booking form and returns to step 1
     */
    bookAnotherBtn.addEventListener('click', () => {
        // Reset form inputs
        appointmentForm.reset();
        clearAllErrors();
        initDateRestriction();

        // Hide Success Card and Show Form Card
        successCard.classList.add('hidden');
        formContainer.classList.remove('hidden');

        // Scroll back to form container
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /**
     * Triggers browser print dialog for printing receipt
     */
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // ----------------------------------------------------------------------
    // 7. STICKY NAVBAR & MOBILE MENU TOGGLE
    // ----------------------------------------------------------------------

    // Sticky Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll to Top FAB Visibility
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Mobile Hamburger Menu Toggle
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburgerBtn.classList.toggle('active', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close Mobile Navigation when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Scroll to Top Button Action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ----------------------------------------------------------------------
    // 8. SCROLL FADE-IN ANIMATION (Intersection Observer)
    // ----------------------------------------------------------------------
    const fadeObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        fadeObserver.observe(element);
    });
});
