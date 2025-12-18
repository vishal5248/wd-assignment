// Simple Password Checker jQuery Plugin
(function($) {
    
    $.fn.passwordChecker = function() {
        
        return this.each(function() {
            var $input = $(this);
            
            $input.on('keyup', function() {
                var password = $input.val();
                
                // Check password strength
                var score = checkPasswordStrength(password);
                
                // Update meter
                updateStrengthMeter(score);
                
                // Check requirements
                checkRequirements(password);
                
                // Log to console
                logStrength(password, score);
            });
        });
    };
    
    function checkPasswordStrength(password) {
        if (!password) return 0;
        
        var score = 0;
        
        // Length check
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 15;  // lowercase
        if (/[A-Z]/.test(password)) score += 15;  // uppercase
        if (/\d/.test(password)) score += 15;     // numbers
        if (/[^A-Za-z0-9]/.test(password)) score += 15;  // special chars
        
        // Weak patterns
        if (/password|123456|qwerty/i.test(password)) score -= 30;
        
        return Math.max(0, Math.min(100, score));
    }
    
    function updateStrengthMeter(score) {
        var $fill = $('#meterFill');
        var $text = $('#strengthText');
        
        $fill.css('width', score + '%');
        
        if (score === 0) {
            $text.text('No Password').css('color', '#718096');
            $fill.css('background', '#e53e3e');
        } else if (score < 40) {
            $text.text('Weak').css('color', '#e53e3e');
            $fill.css('background', '#e53e3e');
        } else if (score < 70) {
            $text.text('Medium').css('color', '#d69e2e');
            $fill.css('background', '#d69e2e');
        } else {
            $text.text('Strong').css('color', '#38a169');
            $fill.css('background', '#38a169');
        }
    }
    
    function checkRequirements(password) {
        // Reset all requirements
        $('#req1, #req2, #req3, #req4, #req5').removeClass('valid');
        
        if (!password) return;
        
        // Check each requirement
        if (password.length >= 8) {
            $('#req1').addClass('valid');
        }
        
        if (/[a-z]/.test(password)) {
            $('#req2').addClass('valid');
        }
        
        if (/[A-Z]/.test(password)) {
            $('#req3').addClass('valid');
        }
        
        if (/\d/.test(password)) {
            $('#req4').addClass('valid');
        }
        
        if (/[^A-Za-z0-9]/.test(password)) {
            $('#req5').addClass('valid');
        }
    }
    
    function logStrength(password, score) {
        var strength = '';
        
        if (score === 0) strength = 'No Password';
        else if (score < 40) strength = 'Weak';
        else if (score < 70) strength = 'Medium';
        else strength = 'Strong';
        
        console.log('Password: "' + password.replace(/./g, '*') + '"');
        console.log('Strength: ' + strength + ' (Score: ' + score + ')');
        console.log('---');
    }
    
})(jQuery);

// Initialize when page loads
$(document).ready(function() {
    $('#password').passwordChecker();
    
    // Toggle password visibility
    $('#showPassword').click(function() {
        var $password = $('#password');
        var $button = $(this);
        
        if ($password.attr('type') === 'password') {
            $password.attr('type', 'text');
            $button.text('Hide');
        } else {
            $password.attr('type', 'password');
            $button.text('Show');
        }
    });
});