'use strict';


angular.module('myApp.board', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/board', {
            templateUrl: 'board/board.html',
            controller: 'BoardCtrl'
        });
    }])

    .controller('BoardCtrl', function ($scope, $http) {
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

        var dictionary = [];

        $scope.dictionary = function() {
            return dictionary;
        };

        $scope.chosenLetters = [];
        $scope.playedWords = [];
        $scope.currentPlayer = 'me';

        var createLetterRows = function() {
            return [
                [
                    createLetter('e', false, null, false),
                    createLetter('t', false, null, false),
                    createLetter('s', false, null, false),
                    createLetter('p', false, null, false),
                    createLetter('v', false, null, false)
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
                    createLetter('f', false, null, false)
                ]
            ];
        };

        $scope.letterRows = createLetterRows();

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

        /**
         * @returns {string} Lowercase
         */
        $scope.chosenWord = function() {
            return $scope.chosenLetters.reduce(function(a, b) {
                return {name: a.name + b.name};
            }).name.toLowerCase();
        };

        $scope.submit = function() {

            var word = $scope.chosenWord();

            if (wordPlayed(word)) {
                alert(word.toUpperCase() + ' has already been played.');
                return;
            }

            if (biggerWordPlayed(word)) {
                alert('A longer version of ' + word.toUpperCase() + ' has already been played.');
                return;
            }

            if (dictionaryContainsWord(dictionary, word)) {
                acceptWord();
            } else {
                alert(word.toUpperCase() + ' is not in the dictionary.');
            }
        };

        $scope.removeChosenLetters = function() {
            $scope.chosenLetters.forEach(function (letter) {
                letter.state.chosen = false;
            });
            $scope.chosenLetters = [];
        };

        var acceptWord = function() {
            // Save chosen word
            $scope.playedWords.push($scope.chosenWord().toLowerCase());

            // Assign letters to player
            $scope.chosenLetters.forEach(function(letter) {
                letter.state.lastPlayedBy = $scope.currentPlayer;
                $scope.removeChosenLetters();
            });

            // Next turn
            switchPlayer();
        };

        var switchPlayer = function() {
            $scope.currentPlayer = ($scope.currentPlayer === 'me') ? 'other' : 'me';
        };

        var dictionaryContainsWord = function(dictionary, word) {
            return (dictionary.indexOf(word.toLowerCase()) > -1);
        };

        /**
         * @param {string} word
         * @returns {boolean}
         */
        var wordPlayed = function(word) {
            return $scope.playedWords.indexOf(word.toLowerCase()) > -1;
        };

        /**
         * @param {string} word
         * @returns {boolean}
         */
        var biggerWordPlayed = function(word) {
            var result = false;
            $scope.playedWords.forEach(function(playedWord) {
                if (playedWord.indexOf(word.toLowerCase()) > -1) {
                    result = true;
                }
            });
            return result;
        };

        var readDictionary = function() {
            $http({
                url: 'wordlist.txt',
                method: 'GET'
            }).success(function(response) {
                dictionary = response.split("\n");
            }).error(function(error) {
                var message = 'ERROR! Could not load the dictionary.';
                alert (message);
                console.log(message);
                dictionary = [];
            });
        };

        readDictionary();
    });
