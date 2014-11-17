var KeyPad = Backbone.Model.extend({
	defaults: {
		idAttribute: '_id',
		value: '0',
	},
});

var KeyPadCollection = Backbone.Collection.extend({
	model: KeyPad
});

var KeyPadView = Backbone.View.extend({
	currentNum: 0,
	result: 0,
	stack: [],
	events: {
		"click .keyPad": "keyPadClick",
	},
	initialize: function() {
		this.render();
		_.bindAll(this, 'on_keypress');
		$(document).bind('keypress', this.on_keypress);
	},
	render: function() {
		keyPadTemplate = _.template($('#key-pad-template').html(), {
			keyPads: this.collection.models
		});
		this.$el.html(keyPadTemplate);
		return this;
	},
	on_keypress: function(e) {
		var stringPressed = String.fromCharCode(e.keyCode);
		if (e.keyCode === 13) {
			this.processInput('Enter');
		} else {
			this.processInput(stringPressed);
		}
	},
	keyPadClick: function(e) {
		var input = e.target.innerHTML.trim();
		this.processInput(input);
	},
	processInput: function(input) {
		if (jQuery.isNumeric(input) || input == '.') {
			if (input == '.') {
				this.handleDecimal(input);
			} else if (this.currentNum === 0) {
				this.currentNum = Number(input);
			} else {
				this.currentNum += input;
				this.currentNum = Number(this.currentNum);
			}
			this.displayNum(this.currentNum);
		} else if (input == '+' || input == '−' || input == '-' || input == '×' || input == '*' || input == '÷' || input == '/') {
			this.doOperation(input);
		} else if (input == '±') {
			this.switchSign();
		} else if (input == 'Enter' || input == 13) {
			this.enterNum();
		} else if (input == 'C') {
			this.clearStack();
		} else if (input == 'CE') {
			this.clearEntry();
		}
	},
	handleDecimal: function(dot) {
		numString = String(this.currentNum);
		if (numString.indexOf('.') == -1) {
			if (this.currentNum == 0) {
				this.currentNum = '0.';
			} else {
				this.currentNum += '.';
			}
		}
	},
	doOperation: function(operator) {
		var operand1, operand2;
		if (this.currentNum != 0 && this.stack.length > 0) {
			operand1 = this.currentNum;
			operand2 = this.stack.pop();
		} else if (this.stack.length > 1) {
			operand1 = this.stack.pop();
			operand2 = this.stack.pop();
		} else {
			return;
		}
		switch (operator) {
			case '+':
				this.result = operand2 + operand1;
				break;
			case '−':
			case '-':
				this.result = operand2 - operand1;
				break;
			case '×':
			case '*':
				this.result = operand2 * operand1;
				break;
			case '÷':
			case '/':
				if (operand1 === 0){ 
					break;
					return;
				}
				this.result = operand2 / operand1;
				break;
		}
		this.stack.push(this.result);
		this.displayNum(this.result);
		this.currentNum = 0;
	},
	switchSign: function() {
		if (this.currentNum != 0) {
			this.currentNum *= -1;
			this.displayNum(this.currentNum);
		} else {
			this.stack[this.stack.length - 1] *= -1;
			this.displayNum(this.stack[this.stack.length - 1]);
		}

	},
	clearStack: function() {
		this.stack = [];
		this.currentNum = 0;
		this.displayNum(this.currentNum);
	},
	clearEntry: function() {
		this.currentNum = 0;
		this.displayNum(this.currentNum);
	},
	enterNum: function() {
		if (this.currentNum != 0) {
			this.stack.push(this.currentNum);
			this.currentNum = 0;
		}
	},
	displayNum: function(num) {
		var maxDigits = 8;
		if (this.getLength(num) > maxDigits) {
			$('#readout').html(num.toExponential(maxDigits));
		} else {
			$('#readout').html(num);
		}

	},
	getLength: function(number) {
		return number.toString().length;
	}
});

var keyPads = new KeyPadCollection([{
		value: '7'
	}, {
		value: '8'
	}, {
		value: '9'
	}, {
		value: '&divide'
	}, {
		value: '4'
	}, {
		value: '5'
	}, {
		value: '6'
	}, {
		value: '&times'
	}, {
		value: '1'
	}, {
		value: '2'
	}, {
		value: '3'
	}, {
		value: '&#8722'
	}, {
		value: '0'
	}, {
		value: '.'
	}, {
		value: '&#xB1'
	}, {
		value: '+'
	}, {
		value: 'C'
	}, {
		value: 'CE'
	}, {
		value: 'Enter',
		width: 'doubleKey'
	}]),
	keyPadView = new KeyPadView({
		model: new KeyPad(),
		collection: keyPads,
		el: $('#calculator'),
	});


function buttonHandlers() {

	$('#modern-theme').click(function() {
		$("body").removeClass("retro metal").addClass('modern');
	});
	$('#retro-theme').click(function() {
		$("body").removeClass("modern metal").addClass('retro');
	});
	$('#metal-theme').click(function() {
		$("body").removeClass("modern retro").addClass('metal');
	});
	var d = new Date();
	var thisYear = d.getFullYear();
	document.getElementById("copyDate").innerHTML = thisYear;

}


buttonHandlers();