//Create variables here
var database, feed, addFood, fedTime, lastFed, changingGameState, readingGameState, readFeedTime;
var dog, happydog, database, foodS, foodStock, dogImg, dogImg2, foodS, foodObj;
var bedroomImg, bathroomImg, gardenImg, sadDog, gameState;
function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  dogImg2 = loadImage("images/dogImg1.png");
  gardenImg = loadImage("images/Garden.png");
  bedroomImg = loadImage("images/Bed Room.png");
  bathroomImg = loadImage("images/Wash Room.png");
  sadDog = loadImage("images/dog.png");
}

function setup() {
  createCanvas(400, 500);
  database=firebase.database();
  console.log(database);
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  foodObj = new Food();

  readFeedTime=database.ref('FeedTime');
  readFeedTime.on("value",function(data){
    lastFed=data.val();
  });
  console.log(lastFed);
  dog = createSprite(800,200,150,150);
  console.log(gameState);
  dog.addImage(dogImg);
  dog.scale = 0.2;
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);
  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
//foodS = 0;
}


function draw() {  
  if(foodS !== undefined){
    text("Food Remaining: " + foodS, 150,140);
  }
  //if(keyWentDown(UP_ARROW)){
  //  writeStock(foodS);
   // dog.addImage(dogImg2);
 // }
 // foodObj.display();

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
    console.log("line 63");
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.bathroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  drawSprites();
  //add styles here
}

function update(State){
  database.ref('/').update({
    gameState:State
  });
}

function readStock(data){
  foodS=data.val();
  console.log(foodS);
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x = 0;
  }
  else{
  x = x - 1;
  }
  database.ref('/').update({
  Food:x
  })
}

function feedDog(){
  dog.addImage(dogImg2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){

  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}