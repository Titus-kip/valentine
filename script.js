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

  // voucher redeemed state and modal
  $scope.redeemed = {};
  $scope.redeemModal = {open:false, title:'', message:''};

  var voucherData = {
    'cozy-movie': {title:'Cozy Movie Night 🎬', message:'Ready with blankets, snacks, and your favorite movie — my treat!'},
    'hot-chocolate': {title:'Hot Chocolate & Chill ☕️', message:'A warm cup and cozy time when you want it.'},
    'breakfast': {title:'Breakfast in Bed 🥞', message:'Pancakes, coffee, and slow cuddles — made by me.'},
    'surprise-day': {title:'Surprise Day Out 🎈', message:'I plan the whole day. Say yes to the adventure!'},
    'massage': {title:'Massage & Relax 💆‍♀️', message:'One hour of massage by yours truly — unwind.'}
  };

  $scope.redeem = function(id){
    if($scope.redeemed[id]){
      $scope.redeemModal = {open:true, title:'Already Redeemed', message:'This voucher was already used — but my love is endless 💞'};
      return;
    }

    // mark redeemed, show surprise modal with confetti
    $scope.redeemed[id] = true;
    var d = voucherData[id] || {title:'Voucher', message:'Enjoy!'};
    $scope.redeemModal = {open:true, title:d.title, message:d.message + ' ✨'};

    // small auto-close after 3s
    $timeout(function(){ $scope.redeemModal.open = false; }, 3000);
  };

  $scope.closeRedeemModal = function(){ $scope.redeemModal.open = false; };

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
