angular.module('valentineApp',[])
.controller('MainCtrl', ['$scope','$timeout', function($scope,$timeout){
  // scene can be 'landing' or 'question'
  $scope.scene = 'landing';
  $scope.message = '';
  $scope.accepted = false;

  $scope.openGift = function(){
    $scope.scene = 'question';
    $scope.message = '';
  };

  $scope.goTo = function(s){
    $scope.scene = s;
    $scope.message = '';
    if(s === 'landing'){
      $scope.accepted = false;
    }
  };

  $scope.accept = function(){
    $scope.accepted = true;
    $scope.message = '';
    $scope.scene = 'gift-choice';
  };

  $scope.selectGift = function(giftType){
    if(giftType === 'photo'){
      // navigate to photo gallery
      $scope.scene = 'photo-gallery';
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
