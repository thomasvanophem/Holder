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
        
        if ($scope.lastName !== undefined && $scope.phoneNumber !== undefined) {
            $scope.contacts.forEach(function(contact) {
                try {
                    if (contact.lastName == $scope.lastName && contact.phoneNumber == $scope.phoneNumber) {                            
                        throw contactExists;
                    }
                } catch (e) {
                    if (e !== contactExists) {
                        throw e;
                    } else {
                        alert("Contact staat al in adresboek!");
                        
                        exists = true;
                    }                            
                }
            });
                
            if (!exists) {
            	$scope.contacts.push({firstName : $scope.firstName, lastName : $scope.lastName, phoneNumber : $scope.phoneNumber});
            }
            
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.phoneNumber = "";
            
            $scope.dismissAddModal();
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
        $scope.contacts[$scope.editID] = {firstName : $scope.editFirstName, lastName : $scope.editLastName, phoneNumber : $scope.editPhoneNumber};
        
        $scope.dismissEditModal();
    }
    
    $scope.deleteContact = function(item) {
        $scope.contacts.splice($scope.contacts.indexOf(item), 1)
    };
}

angular.bootstrap(document, ["addressBook"]);
