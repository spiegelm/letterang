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

        it('middle letter should have 4 neighbours', inject(function($controller) {
            var $scope = {};

            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

            var x = 1, y = 1;

            var neighbours = $scope.neighbouringLetters($scope.letterRows[y][x]);
            expect(neighbours.length).toBe(4);

            var left = $scope.letterRows[y][x-1];
            var top = $scope.letterRows[y-1][x];
            var right = $scope.letterRows[y][x+1];
            var down = $scope.letterRows[y+1][x];

            expect(neighbours).toEqual([left, top, right, down]);
        }));

        it('edge letter should have 3 neighbours', inject(function($controller) {
            var $scope = {};

            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

            var x = 1, y = 0;

            var neighbours = $scope.neighbouringLetters($scope.letterRows[y][x]);
            expect(neighbours.length).toBe(3);

            var left = $scope.letterRows[y][x-1];
            var right = $scope.letterRows[y][x+1];
            var down = $scope.letterRows[y+1][x];

            expect(neighbours).toEqual([left, right, down]);
        }));

        it('corner letter should have 2 neighbours', inject(function($controller) {
            var $scope = {};

            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

            var x = 0, y = 0;

            var neighbours = $scope.neighbouringLetters($scope.letterRows[y][x]);
            expect(neighbours.length).toBe(2);

            var right = $scope.letterRows[y][x+1];
            var down = $scope.letterRows[y+1][x];

            expect(neighbours).toEqual([right, down]);
        }));

    });
});
