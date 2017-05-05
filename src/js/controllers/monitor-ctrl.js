angular
    .module('app')
    .controller('MonitorCtrl', ['$scope','$state','ApiService',MonitorCtrl]);

function MonitorCtrl($scope, $state, ApiService) {
    
    $scope.selectedTraveller = {};
    localStorage.setItem('travellerSelected', null);
    $scope.travellers = [];
    $scope.travellersById = {};

    $scope.picture = {
        picturebase64: '' 
    };

    ApiService.getPassengers().then(function(response) {
        console.log('Passengers: ' , response.data);
        if (response.data.status == 'SUCCESS') {
            response.data.message.manifest.forEach(function(item) {
                $scope.travellers.push({
                    id: item.uuid,
                    name: item.passportInfo.firstName + ' ' + item.passportInfo.lastName,
                    description: 'Passport number: ' + item.passportInfo.passportNumber 
                });
                $scope.travellersById[item.uuid] = item;
            });
        } else {
            $scope.error = 'Error getting passengers.'
        }
    });

    $scope.dataready = false;

    $scope.onSubmit = function() {
        localStorage.setItem('travellerSelected', JSON.stringify($scope.travellersById[$scope.selectedTraveller.id]));
        ApiService.submit('checkin', 'airline', $scope.travellersById[$scope.selectedTraveller.id], $scope.picture.picturebase64).then(function(response) {
            $scope.blockchaindata = response.data;
            $scope.dataready = true;
        });
    };

    $scope.onNext = function() {
        $state.transitionTo('security');
    };
    
}