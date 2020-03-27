var CARD_WIDTH = 5;
var CARD_HEIGHT = 5;
var CELL_WIDTH = 75;
var CELL_HEIGHT = 75;
var NUM_PER_COL = 15;
var CELL_BORDER = 2;
var CELL_OUTER_WIDTH = (CELL_WIDTH + CELL_BORDER*2);
var bingoCard = [];
var chosenNumbers = [];
var timers = [];

$(document).ready(setup);

function setup() {
    $('.build').mousedown(gatherInput);
	gatherInput();
}

function gatherInput() {
	generateGame();
}

function resetGame() {
	timers = [];
	bingoCard = [];
	for (var i=0; i < timers.length; ++i) {
		clearTimeout(timers[i]);
	}
}

function generateGame() {
	resetGame();
	$('.container').empty();
	$('.container').width(CARD_WIDTH*(CELL_WIDTH + CELL_BORDER*2));
	$('.container').height(CARD_HEIGHT*(CELL_WIDTH + CELL_BORDER*2));

    generateBingoCard();
    setupBingoCard();
    setupButtons();
}

function generateBingoCard() {
	for (var x=0; x < CARD_WIDTH; ++x) {
        bingoCard.push([]);
        for (var y=0; y < CARD_HEIGHT; ++y) {
            bingoCard[x].push("");
        }
    }

    for (var x=0; x < CARD_WIDTH; ++x) {
        for (var y=0; y < CARD_HEIGHT; ++y) {
        	var curValue = "FREE";
        	if (x != 2 || y != 2)
        	{
	        	do
	        	{
		        	var randomOffset = Math.floor(Math.random() * NUM_PER_COL) + 1;
	    	    	curValue = (x * NUM_PER_COL) + randomOffset;
	        	} while (chosenNumbers.includes(curValue));

	        	chosenNumbers.push(curValue);
        	}

            bingoCard[x][y] = curValue;
        }
    }
    
	for (x=0; x < CARD_WIDTH; ++x) {
		console.log(bingoCard[x]);
	}
}

function setupBingoCard() {
    var container = $('.container');
    var all_cells = '';
    
    processOnBingoCard(function (x, y) {
        var cell = '<div id="cell-' + x + '-' + y + '" class="cell unselectable"';
        cell += ' style="left: ' + (x*CELL_OUTER_WIDTH+1) + 'px; top: ' + (y*CELL_OUTER_WIDTH+1) + 'px;"><div style="height:'+ (y*CELL_OUTER_WIDTH+1) + ' line-height:'+ (y*CELL_OUTER_WIDTH+1) + '">' + bingoCard[x][y] + '</div></div>';
        all_cells += cell;
    });
    container.append(all_cells);
}

function setupButtons() {
    var container = $('.container');
    var all_buttons = '';
    processOnBingoCard(function (x, y) {
            var button = '<div id="button-' + x + '-' + y + '" class="button unselectable"';
            button += ' style="left: ' + (x*CELL_OUTER_WIDTH+1) + 'px; top: ' + (y*CELL_OUTER_WIDTH+1) + 'px;"><div>' + bingoCard[x][y] + '</div></div>';
            all_buttons += button;
    });
    container.append(all_buttons)
    var buttons = $('[id*=button-]');
    buttons.mousedown(handleMouse);
}

function getXPos(id) {
	return parseInt(id.split('-')[1]);
}

function getYPos(id) {
	return parseInt(id.split('-')[2]);
}

function uncoverCell(btn) {
    var x, y;
    var target_button;

    var btnID = btn.attr('id');
    var btnX = getXPos(btnID);
    var btnY = getYPos(btnID);
	target_button = $('#button-' + btnX + '-' + btnY);
	
	console.log("uncoverCell:" + btnID + " " + btn.hasClass('uncovered'));
    if (!btn.hasClass('uncovered')) {
        btn.fadeTo('slow', 0.0001);
        btn.addClass('uncovered');
    }
    else {
        btn.fadeTo('slow', 1.0);
        btn.removeClass('uncovered');
    }
}

function handleMouse(event) {
    switch (event.which) {
        case 1: //Left mouse
			uncoverCell($(this));
			break;
        case 3: //Right mouse
        case 2: //Middle mouse
        default: //Other?
    }
}

function processOnBingoCard(someFunc) {
	for (var x=0; x < CARD_WIDTH; ++x) {
        for (var y=0; y < CARD_HEIGHT; ++y) {
			someFunc(x, y);
		}
	}
}