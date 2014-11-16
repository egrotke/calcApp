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
	},
	render: function() {
		keyPadTemplate = _.template($('#key-pad-template').html(), {
			keyPads: this.collection.models
		});
		this.$el.html(keyPadTemplate);
		return this;
	},
	keyPadClick: function(e) {
		var input = e.target.innerHTML.trim();
		if (jQuery.isNumeric(input) || input == '.') {
			if (input == '.') {
				this.handleDecimal(input);
			} else if (this.currentNum === 0) {
				this.currentNum = Number(input);
			} else {
				this.currentNum += input;
				this.currentNum = Number(this.currentNum);
			}
			$('#readout').html(this.currentNum);
		} else if (input == '+' || input == '−' || input == '×' || input == '÷') {
			this.doOperation(input);
		} else if (input == '±') {
			this.switchSign();
		} else if (input == 'Enter') {
			this.enterNum();
		} else if (input == 'C') {
			this.clearStack();
		} else if (input == 'CE') {
			this.clearEntry();
		}
	},
	handleDecimal: function(dot){
		
		numString = String(this.currentNum);
		console.log('HD' + numString.indexOf('.'));
		if(numString.indexOf('.') == -1){
			if (this.currentNum == 0){
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
				this.result = operand2 - operand1;
				break;
			case '×':
				this.result = operand2 * operand1;
				break;
			case '÷':
				this.result = operand2 / operand1;
				break;
		}
		this.stack.push(this.result);
		$('#readout').html(this.result);
		this.currentNum = 0;
		this.drawStack('operator');
	},
	switchSign: function() {
		console.log('+/- pressed');
		if (this.currentNum != 0) {
			this.currentNum *= -1;
			$('#readout').html(this.currentNum);
		} else {
			this.stack[this.stack.length - 1] *= -1;
			$('#readout').html(this.stack[this.stack.length - 1]);
		}

	},
	clearStack: function() {
		this.stack = [];
		this.currentNum = 0;
		$('#readout').html(this.currentNum);
		this.drawStack('clear');
	},
	clearEntry: function() {
		this.currentNum = 0;
		$('#readout').html(this.currentNum);
	},
	enterNum: function() {
		if (this.currentNum != 0) {
			this.stack.push(this.currentNum);
			this.currentNum = 0;
		}
		this.drawStack('enter');
	},
	drawStack: function(action) {
		console.log(this.stack);
		$('#stack').empty();
		this.stack.forEach(function(entry, index) {
    		console.log(entry);
    		$('#stack').append('<h3 class="stack-item">' + entry + '</h3>');
		});
		
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
		$("body").removeClass( "retro metal" ).addClass('modern');
	});
	$('#retro-theme').click(function() {
		$("body").removeClass( "modern metal" ).addClass('retro');
	});
	$('#metal-theme').click(function() {
		$("body").removeClass( "modern retro" ).addClass('metal');
	});
	var d = new Date();
	var thisYear = d.getFullYear();
	document.getElementById("copyDate").innerHTML = thisYear;

}


buttonHandlers();