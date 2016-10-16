
function validateCardName(name) {
	var pattern = /^(?!.*[.]{2})(?!.*[\s]{2})(?!.*[\-]{2})[a-zA-Z.\-\s]+$/;

	if (pattern.test(name)) {
		return true;
	} else {
		return false;
	}
}

/*
    Get the card type
    - Visa (0): 
        - number starts with 4
        - length: 13, 16 or 19
    - Mastercard (1):
        - number starts with 2221-2720 or 51-55
        - length: 16
    - American Express (2):
        - number starts with34 or 37
        - length: 15
    - Other (3):
        - length: 12 (maestro) to 19
*/
function getCardType(number) {
    var temp = number.toString().replace(/[^\d]/g, "");

    if (/^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/.test(temp)) {
        return 0;
    } else if (/^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(temp)) {
        return 1;
    } else if (/^3[47][0-9]{13}$/.test(temp)) {
        return 2;
    } else {
        return 3;
    }
}

/*
    Validate the card number using the Luhn Algorithm

    Luhn Algorithm:
        - Drop last digit (check digit)
        - Reverse numbers
        - Multiply numbers in odd positions by 2
            - substract 9 if result is higher than 9
        - Add all numbers (even positions and results from previous step) together
        - Add check digit
        - If the result % 10 equals 0 the number is valid
*/
function validateCardNumber(number) {
    var result = 0;

    // Remove all characters but numbers
    var temp = number.toString().replace(/[^\d]/g, "");

    if (temp.length == 0) {
        return false;
    }

    for (var i = temp.length - 1; i >= 0; i--) {
        var number = parseInt(temp.charAt(i));

        if (i % 2 == 0) {
            number *= 2;

            if (number > 9) {
                number -= 9
            }
        }

        result += number;
    }

    return (result % 10 == 0);
}

/*
    Validate the CV Code (CVC)
    Visa/Mastercard (cardType 0 and 1): 3 digits
    American Express (cardType 2): 4 digits
*/
function validateCVC(cvc, cardType) {
    if (cardType == 2) {
        var pattern = /^[0-9]{4}$/;
    } else {
        var pattern = /^[0-9]{3}$/;
    }

    if (pattern.test(cvc)) {
        return true;
    } else {
        return false;
    }
}

// Add success class and nice green check mark to the input
function valid(element) {
    element.removeClass("has-error has-feedback");
    element.find(".form-control-feedback").remove();
    element.addClass("has-success has-feedback");
    element.append("<span class=\"glyphicon glyphicon-ok form-control-feedback\"></span>");
}

// Add error class and not so nice red cross to the input
function invalid(element) {
    element.removeClass("has-success has-feedback");
    element.find(".form-control-feedback").remove();
    element.addClass("has-error has-feedback");
    element.append("<span class=\"glyphicon glyphicon-remove form-control-feedback\"></span>");
}

$(document).ready(function() {
    $("#card-name").bind("change focusout keyup", function() {
    	var parent = $(this).parent();

    	if (validateCardName($(this).val())) {
            valid(parent);
    	} else {
            invalid(parent);
    	}
    });

    $("#card-number").bind("change focusout", function() {
        var parent = $(this).parent();

        if (validateCardNumber($(this).val())) {
            valid(parent);
        } else {
            invalid(parent);
        }

        $("#card-type").val(getCardType($(this).val()));
    });
});