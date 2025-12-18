// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');

// Form Input Elements
const fullNameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const aadharInput = document.getElementById('aadhar');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const purposeSelect = document.getElementById('purpose');
const notesInput = document.getElementById('notes');

// Error Message Elements
const nameError = document.getElementById('nameError');
const phoneError = document.getElementById('phoneError');
const emailError = document.getElementById('emailError');
const aadharError = document.getElementById('aadharError');
const checkInError = document.getElementById('checkInError');
const checkOutError = document.getElementById('checkOutError');
const purposeError = document.getElementById('purposeError');

// Set minimum date for check-in to today
window.onload = function() {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    
    // Update check-out min date when check-in changes
    checkInInput.addEventListener('change', function() {
        checkOutInput.min = this.value;
    });
};

// Validation Functions
function validateFullName() {
    const name = fullNameInput.value.trim();
    if (!name) {
        nameError.textContent = "Full name is required";
        return false;
    }
    if (name.length < 2) {
        nameError.textContent = "Name must be at least 2 characters";
        return false;
    }
    nameError.textContent = "";
    return true;
}

function validatePhone() {
    const phone = phoneInput.value.trim();
    const phoneRegex = /^\d{10}$/;
    
    if (!phone) {
        phoneError.textContent = "Phone number is required";
        return false;
    }
    if (!phoneRegex.test(phone)) {
        phoneError.textContent = "Phone must be exactly 10 digits";
        return false;
    }
    phoneError.textContent = "";
    return true;
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        emailError.textContent = "Email address is required";
        return false;
    }
    if (!emailRegex.test(email)) {
        emailError.textContent = "Please enter a valid email address";
        return false;
    }
    emailError.textContent = "";
    return true;
}

function validateAadhar() {
    const aadhar = aadharInput.value.trim();
    const aadharRegex = /^\d{12}$/;
    
    if (!aadhar) {
        aadharError.textContent = "Aadhar card number is required";
        return false;
    }
    if (!aadharRegex.test(aadhar)) {
        aadharError.textContent = "Aadhar must be exactly 12 digits";
        return false;
    }
    aadharError.textContent = "";
    return true;
}

function validateDates() {
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;
    let isValid = true;
    
    if (!checkIn) {
        checkInError.textContent = "Check-in date is required";
        isValid = false;
    } else {
        checkInError.textContent = "";
    }
    
    if (!checkOut) {
        checkOutError.textContent = "Check-out date is required";
        isValid = false;
    } else {
        checkOutError.textContent = "";
    }
    
    if (checkIn && checkOut && checkOut <= checkIn) {
        checkOutError.textContent = "Check-out must be after check-in date";
        isValid = false;
    }
    
    return isValid;
}

function validatePurpose() {
    const purpose = purposeSelect.value;
    if (!purpose) {
        purposeError.textContent = "Please select a purpose of visit";
        return false;
    }
    purposeError.textContent = "";
    return true;
}

// Real-time validation for fields
fullNameInput.addEventListener('blur', validateFullName);
phoneInput.addEventListener('blur', validatePhone);
emailInput.addEventListener('blur', validateEmail);
aadharInput.addEventListener('blur', validateAadhar);
checkInInput.addEventListener('change', validateDates);
checkOutInput.addEventListener('change', validateDates);
purposeSelect.addEventListener('change', validatePurpose);

// Prevent non-numeric input for phone and Aadhar
phoneInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 10) this.value = this.value.slice(0, 10);
});

aadharInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 12) this.value = this.value.slice(0, 12);
});

// Form Submission
registrationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validate all fields
    const isNameValid = validateFullName();
    const isPhoneValid = validatePhone();
    const isEmailValid = validateEmail();
    const isAadharValid = validateAadhar();
    const areDatesValid = validateDates();
    const isPurposeValid = validatePurpose();
    
    // If all validations pass
    if (isNameValid && isPhoneValid && isEmailValid && 
        isAadharValid && areDatesValid && isPurposeValid) {
        
        // Create guest object
        const guest = {
            id: Date.now(), // Unique ID based on timestamp
            fullName: fullNameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            aadhar: aadharInput.value.trim(),
            checkIn: checkInInput.value,
            checkOut: checkOutInput.value,
            purpose: purposeSelect.value,
            notes: notesInput.value.trim(),
            registrationDate: new Date().toLocaleString()
        };
        
        // Save to localStorage
        saveGuestData(guest);
        
        // Show success message
        successMessage.style.display = 'flex';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
        
        // Reset form
        setTimeout(() => {
            registrationForm.reset();
            // Clear all error messages
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(el => el.textContent = '');
            
            // Reset date constraints
            const today = new Date().toISOString().split('T')[0];
            checkInInput.min = today;
            checkOutInput.min = '';
        }, 1000);
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// localStorage Functions
function saveGuestData(guest) {
    // Get existing data from localStorage
    let guests = JSON.parse(localStorage.getItem('hotelGuests')) || [];
    
    // Add new guest to array
    guests.push(guest);
    
    // Save back to localStorage
    localStorage.setItem('hotelGuests', JSON.stringify(guests));
    
    console.log('Guest data saved:', guest);
}

// Form Reset
registrationForm.addEventListener('reset', function() {
    // Clear all error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
    
    // Hide success message
    successMessage.style.display = 'none';
    
    // Reset date constraints
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    checkOutInput.min = '';
});