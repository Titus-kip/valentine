angular.module('valentineApp',[])
.controller('MainCtrl', ['$scope','$timeout', function($scope,$timeout){
  // Initialize scene from localStorage or default to 'landing'
  $scope.scene = localStorage.getItem('currentScene') || 'landing';
  $scope.message = '';
  $scope.accepted = false;
  $scope.whyReason = '';
  $scope.reasons = JSON.parse(localStorage.getItem('reasons')) || [];

  // Save scene to localStorage whenever it changes
  $scope.$watch('scene', function(newScene){
    if(newScene) {
      localStorage.setItem('currentScene', newScene);
    }
  });

  $scope.openGift = function(){
    $scope.scene = 'question';
    $scope.message = '';
  };

  $scope.goTo = function(s){
    $scope.scene = s;
    $scope.message = '';
    if(s === 'landing'){
      $scope.accepted = false;
      localStorage.removeItem('reasons');
      $scope.reasons = [];
    }
  };

  $scope.accept = function(){
    $scope.accepted = true;
    $scope.message = '';
    $scope.scene = 'why';
  };

  $scope.saveReason = function(){
    if($scope.whyReason.trim()){
      $scope.reasons.push($scope.whyReason);
      localStorage.setItem('reasons', JSON.stringify($scope.reasons));
      $scope.whyReason = '';
      $timeout(function(){
        $scope.scene = 'gift-choice';
      }, 500);
    }
  };

  $scope.selectGift = function(giftType){
    if(giftType === 'photo'){
      $scope.scene = 'photo-gallery';
    } else if(giftType === 'letter'){
      $scope.scene = 'love-letter';
    } else if(giftType === 'voucher'){
      $scope.scene = 'voucher';
    } else {
      $scope.message = 'Thank you! 💕';
      $timeout(function(){
        $scope.scene = 'accepted';
      }, 600);
    }
  };

  $scope.lightboxOpen = false;
  $scope.selectedImage = null;

  $scope.openLightbox = function(imageSrc){
    $scope.selectedImage = imageSrc;
    $scope.lightboxOpen = true;
  };

  $scope.closeLightbox = function(){
    $scope.lightboxOpen = false;
    $scope.selectedImage = null;
  };

  $scope.isVideo = function(imageSrc){
    return imageSrc && imageSrc.endsWith('.mp4');
  };

}]);
