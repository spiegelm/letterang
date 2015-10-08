'use strict';


angular.module('myApp.board', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/board', {
            templateUrl: 'board/board.html',
            controller: 'BoardCtrl'
        });
    }])

    .controller('BoardCtrl', function ($scope, $http) {

        /**
         *
         * @param {int} posX
         * @param {int} posY
         * @param {string} name
         * @param {boolean} chosen
         * @param {string} lastPlayedBy
         * @param {boolean} protect
         * @returns {{name: string, position: {x: int, y: int}, state: {chosen: boolean, lastPlayedBy: (string|null), protected: boolean}}}
         */
        var createLetter = function(posX, posY, name, chosen, lastPlayedBy, protect) {
            return {
                'name': name,
                'position': {
                    'x': posX,
                    'y': posY
                },
                'state': {
                    'chosen': chosen || false,
                    'lastPlayedBy': lastPlayedBy || null,
                    'protected': protect || false
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

        /**
         * Calculate
         * @returns {{me: number, other: number, none: number}}
         */
        $scope.score = function () {
            var scoreObj = {'me' : 0, 'other': 0, 'none': 0 };
            $scope.letterRows.forEach(function (row) {
                row.forEach(function (letter) {
                    scoreObj[letter.state.lastPlayedBy || 'none' ]++;
                });
            });
            return scoreObj;
        };

        var dictionary = [];

        $scope.dictionary = [];

        $scope.chosenLetters = [];
        $scope.playedWords = [];
        $scope.currentPlayer = 'me';

        var createLetterRows = function() {
            return [
                [
                    createLetter(0, 0, 'e', false, null, false),
                    createLetter(1, 0, 't', false, null, false),
                    createLetter(2, 0, 's', false, null, false),
                    createLetter(3, 0, 'p', false, null, false),
                    createLetter(4, 0, 'v', false, null, false)
                ],
                [
                    createLetter(0, 1, 'l', false, null, false),
                    createLetter(1, 1, 'p', false, null, false),
                    createLetter(2, 1, 'r', false, null, false),
                    createLetter(3, 1, 'a', false, null, false),
                    createLetter(4, 1, 'c', false, null, false)
                ],
                [
                    createLetter(0, 2, 'r', false, null, false),
                    createLetter(1, 2, 'y', false, null, false),
                    createLetter(2, 2, 'b', false, null, false),
                    createLetter(3, 2, 'm', false, null, false),
                    createLetter(4, 2, 'j', false, null, false)
                ],
                [
                    createLetter(0, 3, 'a', false, null, false),
                    createLetter(1, 3, 'l', false, null, false),
                    createLetter(2, 3, 'k', false, null, false),
                    createLetter(3, 3, 'u', false, null, false),
                    createLetter(4, 3, 'm', false, null, false)
                ],
                [
                    createLetter(0, 4, 'n', false, null, false),
                    createLetter(1, 4, 'e', false, null, false),
                    createLetter(2, 4, 'p', false, null, false),
                    createLetter(3, 4, 'i', false, null, false),
                    createLetter(4, 4, 'f', false, null, false)
                ]
            ];
        };

        $scope.letterRows = createLetterRows();

        /**
         * @param {int} x
         * @param {int} y
         */
        $scope.letter = function(x, y) {
            return $scope.letterRows[y][x];
        };

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

            if (dictionaryContainsWord($scope.dictionary, word)) {
                $scope.acceptWord();
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

        $scope.neighbouringLetters = function(letter) {
            var neighbours = [];
            var x = letter.position.x;
            var y = letter.position.y;

            // Left
            if (x > 0) {
                neighbours.push($scope.letter(x - 1, y));
            }

            // Up
            if (y > 0) {
                neighbours.push($scope.letter(x, y - 1));
            }

            // Right
            if (x < $scope.letterRows[0].length - 1) {
                neighbours.push($scope.letter(x + 1, y));
            }

            // Down
            if (y < $scope.letterRows.length - 1) {
                neighbours.push($scope.letter(x, y + 1));
            }

            return neighbours;
        };

        $scope.acceptWord = function() {
            // Save chosen word
            $scope.playedWords.push($scope.chosenWord().toLowerCase());

            // Assign letters to player
            $scope.chosenLetters.forEach(function(letter) {
                if (!letter.state.protected) {
                    letter.state.lastPlayedBy = $scope.currentPlayer;
                }
            });
            $scope.removeChosenLetters();

            // Mark protected letters
            $scope.letterRows.forEach(function(letterRow) {
                letterRow.forEach(function(letter) {
                    var neighbours = $scope.neighbouringLetters(letter);

                    var protectedLetter = true;
                    neighbours.forEach(function(neighbor) {
                        if (neighbor.state.lastPlayedBy === null || letter.state.lastPlayedBy === null) {
                            protectedLetter = false;
                        }
                        protectedLetter = protectedLetter && neighbor.state.lastPlayedBy == letter.state.lastPlayedBy;
                    });

                    letter.state.protected = protectedLetter;
                });
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
                $scope.dictionary = response.split("\n");
            }).error(function(error) {
                var message = 'ERROR! Could not load the dictionary.';
                alert (message);
                console.log(message);
                $scope.dictionary = [];
            });
        };

        readDictionary();
    });
