var CARD_WIDTH = 5;
var CARD_HEIGHT = 5;
var CELL_WIDTH = 75;
var CELL_HEIGHT = 75;
var NUM_PER_COL = 15;
var CELL_BORDER = 2;
var CELL_OUTER_WIDTH = (CELL_WIDTH + CELL_BORDER*2);
var CELL_OUTER_HEIGHT = (CELL_HEIGHT + CELL_BORDER*2);
var BASE_Y_OFFSET = 150;


$(document).ready(setup);

function setup() {
    //$('.build').mousedown(gatherInput);
	$('.container').each(generateGame);
}

function generateGame(index) {
	$(this).empty();
	$(this).width(CARD_WIDTH*(CELL_WIDTH + CELL_BORDER*2));
	$(this).height(CARD_HEIGHT*(CELL_WIDTH + CELL_BORDER*2));

    var bingoCard = generateBingoCard();
    setupBingoCard(index, bingoCard, $(this));
    setupButtons(index, bingoCard, $(this));
}

function generateBingoCard() {
    var bingoCard = [];
	for (var x=0; x < CARD_WIDTH; ++x) {
        bingoCard.push(["","","","","",""]);
    }

    for (var x=0; x < CARD_WIDTH; ++x) {
        var chosenNumbers = [];
        for (var y=0; y < CARD_HEIGHT; ++y) {
        	var curValue = -1;
        	if (x != 2 || y != 2) {
	        	do
	        	{
		        	var randomOffset = Math.floor(Math.random() * NUM_PER_COL) + 1;
	    	    	curValue = (x * NUM_PER_COL) + randomOffset;
	        	} while (chosenNumbers.includes(curValue));

	        	chosenNumbers.push(curValue);
        	}
        }

        chosenNumbers.sort(function(a, b){return a - b});
        if (x == 2) {
            //Inset 'FREE' into array index 2 if it's the middle column
            chosenNumbers.splice(2, 0, "FREE");
        }

        bingoCard[x] = chosenNumbers;
    }
    
	for (x=0; x < CARD_WIDTH; ++x) {
		console.log(bingoCard[x]);
	}

    return bingoCard;
}

function setupBingoCard(index, bingoCard, container) {
    container.append("<div class='bingoHeader unselectable'>BINGO</div>");

    var all_cells = '';
    processOnBingoCard(function (x, y) {
        var xOffset = (x*CELL_OUTER_WIDTH);
        var yOffset = (y*CELL_OUTER_HEIGHT) + BASE_Y_OFFSET;
        var cell = '<div id="cell-' + index + '-' + x + '-' + y + '" class="cell unselectable"';
        cell += ' style="left: ' + xOffset + 'px; top: ' + yOffset + 'px;">' + bingoCard[x][y] + '</div></div>';
        all_cells += cell;
    });
    container.append(all_cells);
}

function setupButtons(index, bingoCard, container) {
    var all_buttons = '';
    processOnBingoCard(function (x, y) {
            var xOffset = (x*CELL_OUTER_WIDTH);
            var yOffset = (y*CELL_OUTER_HEIGHT) + BASE_Y_OFFSET;
            var button = '<div id="button-' + index + '-' + x + '-' + y + '" class="button unselectable"';
            button += ' style="left: ' + xOffset + 'px; top: ' + yOffset + 'px;"><div>' + bingoCard[x][y] + '</div></div>';
            all_buttons += button;
    });
    container.append(all_buttons)
    var buttons = $('[id*=button-' + index + ']');
    buttons.mousedown(handleMouse);
}


function getContainerIndex(id) {
    return parseInt(id.split('-')[1]);
}

function getXPos(id) {
	return parseInt(id.split('-')[2]);
}

function getYPos(id) {
	return parseInt(id.split('-')[3]);
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