var app = angular.module("addressBook", ["ui.sortable"]);

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
    $scope.contacts = [{firstName : "Thomas", lastName : "van Ophem", phoneNumber : "0683609531"},
                        {firstName : "Jose", lastName : "Cats", phoneNumber : "0611405443"}];
    
    $scope.sortBy = "lastName";
    $scope.reverseOrder = false;
    $scope.searchFor = "";
             
    $scope.addContact = function() {
        var exists = false;
        
        $scope.requiredFields = false;
        $scope.addContactExists = false;
        
        if ($scope.firstName !== undefined && $scope.lastName !== undefined && 
            $scope.phoneNumber !== undefined) {
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
        
        $scope.editID = $scope.contacts.indexOf(item);
        $scope.editFirstName = contact.firstName;
        $scope.editLastName = contact.lastName;
        $scope.editPhoneNumber = contact.phoneNumber;
        
        $scope.showEditModal();
    };
    
    $scope.saveContact = function() {
        var exists = false;
        
        $scope.requiredFields = false;
        $scope.editContactExists = false;
        
        if ($scope.editFirstName !== "" && $scope.editLastName !== "" && 
            $scope.editPhoneNumber !== "") {
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
        $scope.contacts.splice($scope.contacts.indexOf(item), 1)
    };
}

angular.bootstrap(document, ["addressBook"]);
