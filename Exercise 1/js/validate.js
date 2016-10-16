
function validateCardName(name) {
	var pattern = /^(?!.*[.]{2})(?!.*[\s]{2})(?!.*[\-]{2})[a-zA-Z.\-\s]+$/;

	if (pattern.test(name)) {
		return true;
	} else {
		return false;
	}
}

function getCardType(number) {

}

function validateCardNumber(number) {

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
});