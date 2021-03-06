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
    // Load the contacts from localStorage
    if (localStorage.getItem("savedContacts") !== null) {
        $scope.contacts = JSON.parse(localStorage.getItem("savedContacts"));
    } else {
        $scope.contacts = [];
    }
    
    $scope.firstName = "";
    $scope.lastName = "";
    $scope.phoneNumber = "";
    
    $scope.sortBy = "order";
    $scope.reverseOrder = false;
    $scope.searchFor = "";
    
    /*
        Add callback function so we can update the order in the localStorage
        when contacts are moved
     */
    $scope.sortableOptions = {
        update: function(e, ui) {
            var oldValue = ui.item.sortable.index;
            var newValue = ui.item.index();
            var temp = $scope.contacts[oldValue];
            
            // Update the order of contacts
            if (oldValue > newValue) {                
                $scope.contacts.forEach(function(contact) {
                    if (contact.order >= newValue && contact.order <= oldValue) {
                        contact.order += 1;
                    }
                });
            } else if (oldValue < newValue) {                
                $scope.contacts.forEach(function(contact) {
                    if (contact.order <= newValue && contact.order >= oldValue) {
                        contact.order -= 1;
                    }
                });
            }
            
            $scope.contacts[$scope.contacts.indexOf(temp)].order = newValue;
            
            $scope.contacts.sort(function(a, b) {
                return a.order - b.order;
            });
            
            localStorage.setItem("savedContacts", JSON.stringify($scope.contacts));
        }
    };
             
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
            	                        phoneNumber : $scope.phoneNumber, 
            	                        order: $scope.contacts.length});
                
                $scope.firstName = "";
                $scope.lastName = "";
                $scope.phoneNumber = "";
                
                $scope.dismissAddModal();
                
                localStorage.setItem("savedContacts", JSON.stringify($scope.contacts));
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
                                                    phoneNumber : $scope.editPhoneNumber, 
                                                    order: $scope.editOrder};

                $scope.dismissEditModal();
                
                localStorage.setItem("savedContacts", JSON.stringify($scope.contacts));
            }
        } else {
            $scope.requiredFields = true;
        }
    }
    
    $scope.deleteContact = function(item) {
        // Update the order of contacts
        var order = $scope.contacts[$scope.contacts.indexOf(item)].order;
        
        $scope.contacts.forEach(function(contact) {
            if (contact.order > order) {
                contact.order -= 1;
            }
        });
        
        // Delete the contact from the contacts array and update the localStorage
        $scope.contacts.splice($scope.contacts.indexOf(item), 1);
        
        localStorage.setItem("savedContacts", JSON.stringify($scope.contacts));
    };
}

angular.bootstrap(document, ["addressBook"]);
