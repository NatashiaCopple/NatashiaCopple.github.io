// define function to draw snake
// @param pass in snake to be drawn
var drawSnake = function(snakeToDraw) {
  //create variables to draw
  var drawableSnake = { color: "green", pixels: snake }
  var drawableApple = { color: "red", pixels: [apple] }
  // create array
  var drawableObjects = [drawableSnake, drawableApple]
  // draw snake
  CHUNK.draw(drawableObjects)
}
// function that moves the segment based upon it's direction (down, up, right, left)
//  @params segment is place holder for what is passed when function is called
// @return is munipluated input aka what is passed in
var moveSegment = function(segment) {
  if (segment.direction === "down") {
    return { top: segment.top + 1, left: segment.left }
  } else if (segment.direction === "up") {
    return { top: segment.top - 1, left: segment.left }
  } else if (segment.direction === "right") {
    return { top: segment.top, left: segment.left + 1 }
  } else if (segment.direction === "left") {
    return { top: segment.top, left: segment.left - 1 }
  }
  return segment;
}
/*
create function to
@param segment index and snake
@return segment closer to head
*/
var segmentFurtherForwardThan = function(index, snake) {
  if (snake[index - 1] === undefined) {
    return snake[index];
  } else {
    return snake[index - 1];
  }
}

/*
 define function to move snake
 @params pass in snake
 @return new snake
array.forEach allows us to call a function with each item in a collection
This is a very common kind of loop and is very powerful.
array.push adds the element it is given to the array it is called in
*/
var moveSnake = function(snake) {
  return snake.map(function(oldSegment, segmentIndex) {
    var newSegment = moveSegment(oldSegment);
    newSegment.direction = segmentFurtherForwardThan(segmentIndex, snake).direction;
    return newSegment;
  });

  return newSnake;
}
/*
 define function to "drow" snake
 @param pass in snake
 @return return grown snake
*/
var growSnake = function(snake) {
  var indexOfLastSegment = snake.length - 1;
  var lastSegment = snake[indexOfLastSegment];
  snake.push({ top: lastSegment.top, left: lastSegment.left });
  return snake;
}
//check to see if snake ate its self
// @params snake and other thing it hits
// @return where head of snake is
var ate = function(snake, otherThing) {
  var head = snake[0];
  return CHUNK.detectCollisionBetween([head], otherThing);
}

// define function to advance the game
// @return newly drawn snake
var advanceGame = function() {
  // function call to move snake
  var newSnake = moveSnake(snake)
  /*
  CHUNK.detectCollisionBetween takes two collections of coordinates and returns true if the collections share any pixels
  CHUNK.endGame tells chunk to stop calling the advanceGame function, effectively ending the game.
  CHUNK.flashMessage displays text to the user.
  */
  if (ate(newSnake, snake)) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! You ate yourself!");
  }

  if (ate(newSnake, [apple])) {
    newSnake = growSnake(newSnake);
    apple = CHUNK.randomLocation();
  }

  if (ate(newSnake, CHUNK.gameBoundaries())) {
    CHUNK.endGame();
    CHUNK.flashMessage("Whoops! you hit a wall!")
  }
  snake = newSnake
  // function call to draw snake and apple
  drawSnake(snake, apple)
}
// function to change direction of snake
// @params place holder for direction to be passed in
var changeDirection = function(direction) {
  snake[0].direction = direction;
}
// setting up my snake and apple variables
var apple = { top: 8, left: 10 };
var snake = [{ top: 1, left: 0, direction: "down" }, { top: 0, left: 0, direction: "down" }];
// access CHUNK library to advance the game
// @params call function and number of moves per second
CHUNK.executeNTimesPerSecond(advanceGame, 3)
// access CHUNK library to access arrow keys
// @param place holder for direction passed in to change
CHUNK.onArrowKey(changeDirection);
