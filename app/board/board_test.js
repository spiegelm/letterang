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

        it('middle letter should have 4 neighbours', inject(function ($controller) {
            var $scope = {};
            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

            var x = 1, y = 1;

            var neighbours = $scope.neighbouringLetters($scope.letterRows[y][x]);
            expect(neighbours.length).toBe(4);

            var left = $scope.letterRows[y][x - 1];
            var top = $scope.letterRows[y - 1][x];
            var right = $scope.letterRows[y][x + 1];
            var down = $scope.letterRows[y + 1][x];

            expect(neighbours).toEqual([left, top, right, down]);
        }));

        it('edge letter should have 3 neighbours', inject(function ($controller) {
            var $scope = {};
            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

            var x = 1, y = 0;

            var neighbours = $scope.neighbouringLetters($scope.letterRows[y][x]);
            expect(neighbours.length).toBe(3);

            var left = $scope.letterRows[y][x - 1];
            var right = $scope.letterRows[y][x + 1];
            var down = $scope.letterRows[y + 1][x];

            expect(neighbours).toEqual([left, right, down]);
        }));

        it('edge letter should have 3 neighbours', inject(function ($controller) {
            var $scope = {};
            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

            var x = 0, y = 1;

            var neighbours = $scope.neighbouringLetters($scope.letterRows[y][x]);

            // Test
            var top = $scope.letterRows[y - 1][x];
            var right = $scope.letterRows[y][x + 1];
            var down = $scope.letterRows[y + 1][x];

            expect(neighbours.length).toBe(3);
            expect(neighbours).toEqual([top, right, down]);
        }));

        it('corner letter should have 2 neighbours', inject(function ($controller) {
            var $scope = {};
            var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

            var x = 0, y = 0;

            var neighbours = $scope.neighbouringLetters($scope.letterRows[y][x]);

            // Test
            var right = $scope.letterRows[y][x + 1];
            var down = $scope.letterRows[y + 1][x];

            expect(neighbours.length).toBe(2);
            expect(neighbours).toEqual([right, down]);
        }));

        describe('a protected letter', function() {

            var playTopLeftLetters = function ($scope) {

                // Choose letters in the corner
                $scope.chooseLetter($scope.letterRows[0][0]);
                $scope.chooseLetter($scope.letterRows[0][1]);
                $scope.chooseLetter($scope.letterRows[1][0]);

                // Accept this 3-lettered-word
                $scope.acceptWord();

                // Test
                expect($scope.letterRows[0][0].state.protected).toBe(true);
                expect($scope.letterRows[0][1].state.protected).toBe(false);
                expect($scope.letterRows[1][0].state.protected).toBe(false);

                // Test if letter is owned by me
                expect($scope.letterRows[0][0].state.lastPlayedBy).toBe('me');
            };

            it('should be surrounded by letters last played by the same player', inject(function($controller) {
                var $scope = {};
                var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

                playTopLeftLetters($scope);
            }));

            it('should not change its owner', inject(function ($controller) {
                var $scope = {};
                var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

                playTopLeftLetters($scope);

                // Test if letter is owned by me and protected
                expect($scope.letterRows[0][0].state.protected).toBe(true);
                expect($scope.letterRows[0][0].state.lastPlayedBy).toBe('me');

                // Choose the protected letter and accept this word
                $scope.chooseLetter($scope.letterRows[0][0]);
                $scope.acceptWord();

                // Test if protected state is unchanged
                expect($scope.letterRows[0][0].state.protected).toBe(true);
                expect($scope.letterRows[0][1].state.protected).toBe(false);
                expect($scope.letterRows[1][0].state.protected).toBe(false);

                // Test if letter is still owned by me
                expect($scope.letterRows[0][0].state.lastPlayedBy).toBe('me');
            }));


            it('should keep it owner but become unprotected if a neighbour changes its owner', inject(function ($controller) {
                var $scope = {};
                var boardCtrl = $controller('BoardCtrl', {$scope: $scope});

                playTopLeftLetters($scope);

                // Test if letter is owned by me and protected
                expect($scope.letterRows[0][0].state.protected).toBe(true);
                expect($scope.letterRows[0][0].state.lastPlayedBy).toBe('me');

                // Choose the protected letter and accept this word
                $scope.chooseLetter($scope.letterRows[0][1]);
                $scope.acceptWord();

                // Test if protected state is unchanged
                expect($scope.letterRows[0][0].state.protected).toBe(false);
                expect($scope.letterRows[0][1].state.protected).toBe(false);
                expect($scope.letterRows[1][0].state.protected).toBe(false);

                // Test if letter is still owned by me
                expect($scope.letterRows[0][0].state.lastPlayedBy).toBe('me');
            }));

        });

    });
});
