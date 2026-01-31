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
    $scope.scene = 'playful-no';
  };

  $scope.moveNoButton = function(){
    var noBtn = document.getElementById('noButton');
    if(noBtn){
      var randomLeft = Math.random() * 80 + 10;
      var randomTop = Math.random() * 80 + 10;
      noBtn.style.left = randomLeft + '%';
      noBtn.style.top = randomTop + '%';
    }
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

  // Voucher data and redemption state
  $scope.voucherList = [
    {id:'cozy-movie', title:'Cozy Movie Night 🎬', description:'Blankets, snacks and your favorite movie — my treat.'},
    {id:'hot-chocolate', title:'Hot Chocolate & Chill ☕', description:'A warm cup and a cosy moment together.'},
    {id:'breakfast', title:'Breakfast in Bed 🥞', description:'Pancakes, coffee and slow cuddles — a morning to remember.'},
    {id:'surprise-day', title:'Surprise Day Out 🎉', description:'I plan a whole day of your favorite things.'},
    {id:'massage', title:'Massage & Relax 💆', description:'An hour of massage and full relaxation.'}
  ];

  $scope.redeemed = JSON.parse(localStorage.getItem('redeemed')) || {};
  $scope.redeemModal = {open:false, title:'', message:''};

  $scope.redeem = function(voucherId){
    if($scope.redeemed[voucherId]) return;
    $scope.redeemed[voucherId] = true;
    localStorage.setItem('redeemed', JSON.stringify($scope.redeemed));
    var v = $scope.voucherList.find(function(x){return x.id===voucherId;});
    $scope.redeemModal = {open:true, title: v ? v.title : 'Redeemed', message: v ? v.description : ''};
  };

  $scope.closeRedeemModal = function(){
    $scope.redeemModal = {open:false, title:'', message:''};
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
