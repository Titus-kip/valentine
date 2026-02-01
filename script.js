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
    } else if(giftType === 'games'){
      $scope.scene = 'game-hub';
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

  // 30-DAY GAME HUB
  $scope.playerScores = JSON.parse(localStorage.getItem('playerScores')) || {player1: 0, player2: 0};
  $scope.currentDay = Math.floor((Date.now() - new Date(2026,0,31).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  if($scope.currentDay > 30) $scope.currentDay = 30;

  $scope.drawPrompts = ['A sunset', 'A cup of coffee', 'A heart', 'A cat', 'A tree', 'A phone', 'A pizza', 'A flower'];
  $scope.loveQuestions = [
    'What is your favorite memory with me?',
    'What do you love most about me?',
    'Where do you see us in 5 years?',
    'What is your favorite thing I do?',
    'How did I make you smile today?',
    'What is your favorite date we had?'
  ];
  $scope.ratherQuestions = [
    {prompt: 'Would you rather...', a: 'Have a cozy night in', b: 'Have a wild night out'},
    {prompt: 'Would you rather...', a: 'Get breakfast in bed', b: 'Get dinner out'},
    {prompt: 'Would you rather...', a: 'Kiss under the stars', b: 'Kiss in the rain'},
    {prompt: 'Would you rather...', a: 'Travel the world', b: 'Build a home together'},
    {prompt: 'Would you rather...', a: 'Learn to cook together', b: 'Take dance lessons'}
  ];
  $scope.dares = [
    'Give each other a 1-minute massage',
    'Slow dance to your favorite song',
    'Write a love note to each other',
    'Cook breakfast together',
    'Have a picnic date',
    'Watch the sunrise/sunset together',
    'Create a playlist for each other',
    'Take cute couple photos',
    'Stargazing date',
    'Make a scrapbook page',
    'Plan a future trip together',
    'Have a movie marathon',
    'Bake something sweet together',
    'Write a bucket list together',
    'Take a walk and talk about dreams',
    'Exchange compliments for 10 minutes',
    'Surprise breakfast in bed',
    'Paint or draw together',
    'Make homemade dinner together',
    'Exchange promise jars',
    'Have a photoshoot date',
    'Write love letters',
    'Create inside jokes',
    'Learn something new together',
    'Volunteer together',
    'Have a spa night at home',
    'Make a time capsule',
    'Share your favorite memories',
    'Plan next vacation together',
    'End with a romantic dinner'
  ];

  // Quick Draw
  $scope.drawingMode = false;
  $scope.currentDrawPrompt = $scope.drawPrompts[Math.floor(Math.random() * $scope.drawPrompts.length)];
  $scope.guessText = '';

  $scope.startDrawing = function(){
    $scope.drawingMode = true;
    $timeout(function(){
      var canvas = document.getElementById('drawCanvas');
      if(canvas){
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var drawing = false;
        canvas.addEventListener('mousedown', function(){drawing = true;});
        canvas.addEventListener('mouseup', function(){drawing = false;});
        canvas.addEventListener('mousemove', function(e){
          if(drawing){
            var rect = canvas.getBoundingClientRect();
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#ff7aa2';
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
          }
        });
      }
    }, 100);
  };

  $scope.finishDrawing = function(){
    $scope.drawingMode = false;
    $scope.guessPrompt = $scope.currentDrawPrompt;
  };

  $scope.submitGuess = function(){
    if($scope.guessText.trim()){
      $scope.playerScores.player1 += 10;
      localStorage.setItem('playerScores', JSON.stringify($scope.playerScores));
      $scope.guessText = '';
      $scope.currentDrawPrompt = $scope.drawPrompts[Math.floor(Math.random() * $scope.drawPrompts.length)];
      $scope.guessPrompt = '';
    }
  };

  // Love Questions
  $scope.answerText = '';
  $scope.partnerAnswer = '';
  $scope.currentQuestion = $scope.loveQuestions[Math.floor(Math.random() * $scope.loveQuestions.length)];

  $scope.submitAnswer = function(){
    if($scope.answerText.trim()){
      localStorage.setItem('lastAnswer_' + Date.now(), $scope.answerText);
      $scope.partnerAnswer = $scope.answerText;
      $scope.answerText = '';
      $scope.currentQuestion = $scope.loveQuestions[Math.floor(Math.random() * $scope.loveQuestions.length)];
    }
  };

  $scope.rateAnswer = function(rating){
    $scope.playerScores.player1 += rating;
    localStorage.setItem('playerScores', JSON.stringify($scope.playerScores));
    $scope.partnerAnswer = '';
  };

  // Would You Rather
  $scope.currentRatherQuestion = $scope.ratherQuestions[0];
  $scope.ratherResult = '';

  $scope.chooseRather = function(choice){
    $scope.ratherResult = choice === 'a' ? $scope.currentRatherQuestion.a : $scope.currentRatherQuestion.b;
    $scope.playerScores.player1 += 10;
    localStorage.setItem('playerScores', JSON.stringify($scope.playerScores));
  };

  $scope.nextRather = function(){
    var randomIdx = Math.floor(Math.random() * $scope.ratherQuestions.length);
    $scope.currentRatherQuestion = $scope.ratherQuestions[randomIdx];
    $scope.ratherResult = '';
  };

  // Daily Dare
  $scope.dareDay = $scope.currentDay;
  $scope.currentDare = $scope.dares[$scope.currentDay - 1];
  $scope.dareCompleted = localStorage.getItem('dare_day_' + $scope.currentDay) === 'true';

  $scope.completeDare = function(){
    if(!$scope.dareCompleted){
      $scope.dareCompleted = true;
      $scope.playerScores.player1 += 50;
      localStorage.setItem('playerScores', JSON.stringify($scope.playerScores));
      localStorage.setItem('dare_day_' + $scope.currentDay, 'true');
    }
  };

}]);
