'use strict';

describe('myApp.board module', function () {

    beforeEach(module('myApp.board'));

    describe('BoardCtrl', function () {

        it('should be defined', inject(function ($controller) {
            var $scope = {};

            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});
            expect(boardCtrl).toBeDefined();
        }));

        it('should initialize a 5x5 board', inject(function ($controller) {
            var $scope = {};

            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});
            expect($scope.letterRows.length).toBe(5);
            $scope.letterRows.forEach(function (letterRow) {
                expect(letterRow.length).toBe(5);
            });
        }));

    });
});
