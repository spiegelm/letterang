'use strict';


angular.module('myApp.board', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/board', {
            templateUrl: 'board/board.html',
            controller: 'BoardCtrl'
        });
    }])

    .controller('BoardCtrl', function ($scope) {
        var defaultFor = function (arg, val) {
            return typeof arg !== 'undefined' ? arg : val;
        };

        var createLetter = function(name, chosen, lastPlayedBy, protect) {
            return {
                'name': name,
                'state': {
                    'chosen': defaultFor(chosen, false),
                    'lastPlayedBy': defaultFor(lastPlayedBy, null),
                    'protected': defaultFor(protect, false)
                }
            };
        };

        var createBoard = function (boardRows) {
            var elementRows = [];
            boardRows.forEach(function (row) {
                var elementRow = [];
                row.forEach(function (letterName) {
                    elementRow.push(createLetter(letterName));
                });
                elementRows.push(elementRow);
            });
            return elementRows;
        };

        $scope.chosenLetters = [];
        $scope.letterRows = [
            [
                createLetter('R', false, 'me', true),
                createLetter('U', false, 'me', false),
                createLetter('N', false, 'me', false),
                createLetter('S', false, null, false),
                createLetter('E', false, 'me', false)
            ],
            [
                createLetter('R', false, 'me', false),
                createLetter('U', false, null, false),
                createLetter('N', false, null, false),
                createLetter('S', false, null, false),
                createLetter('E', false, null, false)
            ],
            [
                createLetter('R', false, null, false),
                createLetter('U', false, null, false),
                createLetter('N', false, null, false),
                createLetter('S', false, null, false),
                createLetter('E', false, null, false)
            ],
            [
                createLetter('R', false, null, false),
                createLetter('U', false, null, false),
                createLetter('N', false, null, false),
                createLetter('S', false, 'other', false),
                createLetter('E', false, null, false)
            ],
            [
                createLetter('R', false, null, false),
                createLetter('U', false, null, false),
                createLetter('N', false, 'other', false),
                createLetter('S', false, 'other', true),
                createLetter('E', false, 'other', false)
            ],
        ];

        $scope.chooseLetter = function (letter) {
            letter.state.chosen = true;
            $scope.chosenLetters.push(letter);
        };

        $scope.removeLetter = function (letter) {
            letter.state.chosen = false;
            // Remove letter from array
            var index = $scope.chosenLetters.indexOf(letter);
            $scope.chosenLetters.splice(index, 1);
        };

        $scope.removeAllLetters = function() {
            $scope.chosenLetters.forEach(function (letter) {
                letter.state.chosen = false;
            });
            $scope.chosenLetters = [];
        };

        $scope.submit = function() {
            $scope.removeAllLetters();
        };
    });
