var app = angular.module("addressBook", ["ui.sortable"]);

// Add directive so we can close the modal when the submit button is clicked
app.directive("addModal", function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            scope.dismissAddModal = function() {
                element.modal("hide");
            };
        }
    } 
});

// Add directive so we can open and close the modal when the edit button is clicked
app.directive("editModal", function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            scope.showEditModal = function() {
                element.modal("show");
            };
            
            scope.dismissEditModal = function() {
                element.modal("hide");
            };
        }
    } 
});

function addressBookController($scope) {
    $scope.contacts = [{firstName : "Thomas", lastName : "van Ophem", phoneNumber : "0683609531"}];
    
    
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.phoneNumber = "";
    
    $scope.sortBy = "lastName";
    $scope.reverseOrder = false;
    $scope.searchFor = "";
             
    $scope.addContact = function() {
        var exists = false;
        
        $scope.requiredFields = false;
        $scope.addContactExists = false;
        
        // Check if the required fields are filled out
        if ($scope.firstName.trim().length != 0 && $scope.lastName.trim().length != 0 && $scope.phoneNumber.trim().length != 0) {            
            // Check if the lastname and phone number are already used for another contact
            $scope.contacts.forEach(function(contact) {
                try {
                    if (contact.lastName.toLowerCase() == $scope.lastName.toLowerCase() && 
                        contact.phoneNumber == $scope.phoneNumber) {                            
                        throw {name : "contactExists", message : "too lazy to implement"};
                    }
                } catch (e) {
                    if (e.name !== "contactExists") {
                        throw e;
                    } else {                        
                        exists = true;
                    }                            
                }
            });
            
            $scope.addContactExists = exists;
             
            // If the lastname/phone number combination isn't used we add it to the list of contacts   
            if (!exists) {
            	$scope.contacts.push({firstName : $scope.firstName, 
            	                        lastName : $scope.lastName, 
            	                        phoneNumber : $scope.phoneNumber});
                
                $scope.firstName = "";
                $scope.lastName = "";
                $scope.phoneNumber = "";
                
                $scope.dismissAddModal();
            }
        } else {   
            $scope.requiredFields = true;
        }
    };
    
    $scope.editContact = function(item) {
        var contact = $scope.contacts[$scope.contacts.indexOf(item)];
        
        // Load the contact details into the edit form
        $scope.editID = $scope.contacts.indexOf(item);
        $scope.editFirstName = contact.firstName;
        $scope.editLastName = contact.lastName;
        $scope.editPhoneNumber = contact.phoneNumber;
        $scope.editOrder = contact.order;
        
        $scope.showEditModal();
    };
    
    $scope.saveContact = function() {
        var exists = false;
        
        $scope.requiredFields = false;
        $scope.editContactExists = false;
        
        // Check if the required fields are filled out
        if ($scope.editFirstName.trim().length != 0 && $scope.editLastName.trim().length != 0 && 
            $scope.editPhoneNumber.trim().length != 0) {
            // Check if the lastname and phone number are already used for another contact
            $scope.contacts.forEach(function(contact) {
                try {
                    if (contact.lastName.toLowerCase() == $scope.editLastName.toLowerCase() && 
                        contact.phoneNumber == $scope.editPhoneNumber &&  
                        $scope.contacts.indexOf(contact) != $scope.editID) {
                        throw {name : "contactExists", message : "too lazy to implement"};  
                    }
                } catch (e) {
                    if (e.name !== "contactExists") {
                        throw e;
                    } else {
                        exists = true;
                    }
                }
            });
            
            $scope.editContactExists = exists;
        
            // If the lastname/phone number combination isn't used we update the contact
            if (!exists) {
                $scope.contacts[$scope.editID] = {firstName : $scope.editFirstName, 
                                                    lastName : $scope.editLastName, 
                                                    phoneNumber : $scope.editPhoneNumber};

                $scope.dismissEditModal();
            }
        } else {
            $scope.requiredFields = true;
        }
    }
    
    $scope.deleteContact = function(item) {
        // Delete the contact from the contacts array
        $scope.contacts.splice($scope.contacts.indexOf(item), 1)
    };
}

angular.bootstrap(document, ["addressBook"]);
