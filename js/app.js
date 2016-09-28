///// Angular JS /////
'use strict';
/**
 * Main module of the application.
 */
angular
  .module('reviews', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.bootstrap.modal',
    'ui.bootstrap-slider',
	  'ui.bootstrap.modal',
	  'dialogs',    
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.expandable',
    'ui.grid.edit',
    'ui.grid.pagination'
  ])
  .config(function ($routeProvider,$httpProvider) {
    $routeProvider	 
	  .when('/', {
      controller: 'RatingCtrl'
    });
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }).value('GlobalVariables', {   

});

//Controller for showing  Reviews
 angular.module("reviews").controller("RatingCtrl", function($scope, $http) {
  // Code for Constant stars in near to progress bar 
  $scope.isReadonly = true;
  $scope.ratingWrite = 0;
  $scope.show = true;
  $scope.revLen = 10;
  $scope.max= 5;
  $scope.showMore = true;
  $scope.thankyou = false;
  $scope.test = false;

  //Function for Write a review box open
  $scope.writeareview_Show = function(){
    $scope.ratingWrite = 0;
    $scope.show =  !$scope.show;
    $scope.thankyou = false;
    $scope.submitted = false;
    $scope.review.title = null;
    $scope.review.desc = null;
    $scope.review.disName = null;
  };


  //Function for Thankyou box close button
  $scope.close_thankyou = function(){
    $scope.thankyou = false;
  }

  //Function for Submit Button
  $scope.submitUser = function() {
    if($scope.ratingWrite > 0)
       $scope.test = false;
      else {
        $scope.test = true;
         $scope.submitted = true;
        return;
      }
    if ($scope.reviewSubmitForm.$valid) {
      
        $scope.show = true;
        $scope.thankyou = true;
     
    } else {

      $scope.submitted = true;
    }
  }

  // Function for Write a Review box star hover
  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  // Ajax call for review details json data
  $http.get('controllers/reviewdetails.json')
     .then(function(res){
        var r1 = 0,r2 = 0, r3 = 0, r4 = 0, r5 = 0, revCnt = 0;
          $scope.reviews = res.data;
          //Code for Progress bar in top of the page
          angular.forEach($scope.reviews, function(review, idx){
            if(review.product_review_rating == 5){
              r5++;
            }else if(review.product_review_rating == 4){
              r4++;
            }else if(review.product_review_rating == 3){
              r3++;
            }else if(review.product_review_rating == 2){
              r2++;
            }else if(review.product_review_rating == 1){
              r1++;
            }
          });
          
            revCnt = $scope.reviews.length;
            $scope.totalLen = revCnt;
            $scope.rat5 = r5;
            $scope.rat4 = r4;
            $scope.rat3 = r3;
            $scope.rat2 = r2;
            $scope.rat1 = r1;
            $scope.pb5 = (r5 * 100)/revCnt;
            $scope.pb4 = (r4 * 100)/revCnt;
            $scope.pb3 = (r3 * 100)/revCnt;
            $scope.pb2 = (r2 * 100)/revCnt;
            $scope.pb1 = (r1 * 100)/revCnt;

 // Function for Showmore button in bottom of the page
  $scope.ShowMore = function(){
    if($scope.revLen < $scope.totalLen){
       $scope.revLen += 10;
    if($scope.totalLen - $scope.revLen <= 10)
       $scope.showMore = false;
     }
  };

  });

  // Ajax call; for overal rating and reviews json data
  $http.get('controllers/overalrating.json')
      .then(function(overal){
        $scope.overal_reviews = overal.data
      });


}).directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li class="test" ng-repeat="star in stars" ng-class="star">' +
            '<span class="glyphicon"></span>'+
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '='
        },
        link: function (scope, elem, attrs) {
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.ratingValue
                });
            }
        }
    }
});

