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
                'name': name.toUpperCase(),
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
                createLetter('e', false, null, false),
                createLetter('t', false, null, false),
                createLetter('s', false, null, false),
                createLetter('p', false, null, false),
                createLetter('v', false, null, false),
            ],
            [
                createLetter('l', false, null, false),
                createLetter('p', false, null, false),
                createLetter('r', false, null, false),
                createLetter('a', false, null, false),
                createLetter('c', false, null, false)
            ],
            [
                createLetter('r', false, null, false),
                createLetter('y', false, null, false),
                createLetter('b', false, null, false),
                createLetter('m', false, null, false),
                createLetter('j', false, null, false)
            ],
            [
                createLetter('a', false, null, false),
                createLetter('l', false, null, false),
                createLetter('k', false, null, false),
                createLetter('u', false, null, false),
                createLetter('m', false, null, false)
            ],
            [
                createLetter('n', false, null, false),
                createLetter('e', false, null, false),
                createLetter('p', false, null, false),
                createLetter('i', false, null, false),
                createLetter('f', false, null, false),
            ]
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

        var removeChosenLetters = function() {
            $scope.chosenLetters.forEach(function (letter) {
                letter.state.chosen = false;
            });
            $scope.chosenLetters = [];
        };

        $scope.submit = function() {

            var word = $scope.chosenLetters.reduce(function(a, b) {
                return {name: a.name + b.name};
            }).name;

            if (dictionaryContainsWord(word)) {
                acceptWord();
            } else {
                alert('"' + word + '" is not in the dictionary!');
            }
        };

        var acceptWord = function() {

            var currentPlayer = 'me';

            $scope.chosenLetters.forEach(function(letter) {
                letter.state.lastPlayedBy = currentPlayer;
                removeChosenLetters();
            });
        };


        var dictionaryContainsWord = function(word) {
            var dictionary = ["i", "like", "likes", "run", "runs", "runners"];
            var dictionaryContainsWord = (dictionary.indexOf(word.toLowerCase()) > -1);
            return dictionaryContainsWord;
        };
    });
