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

		console.log(input);
		if (jQuery.isNumeric(input) || input == '.') {
			if (this.currentNum == 0) {
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
				console.log('Plus pressed');
				this.result = operand2 + operand1;
				break;
			case '−':
				console.log('Minus pressed');
				this.result = operand2 - operand1;
				break;
			case '×':
				console.log('Times pressed');
				this.result = operand2 * operand1;
				break;
			case '÷':
				console.log('Division pressed');
				this.result = operand2 / operand1;
				break;
		}
		this.stack.push(this.result);
		$('#readout').html(this.result);
		this.currentNum = 0;
		console.log(this.stack);
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
		console.log('Clear pressed');
		this.stack = [];
		this.currentNum = 0;
		$('#readout').html(this.currentNum);
	},
	clearEntry: function() {
		console.log('Clear Entry pressed');
		this.currentNum = 0;
		$('#readout').html(this.currentNum);
	},
	enterNum: function() {
		console.log('Enter pressed: ' + this.currentNum);
		if (this.currentNum != 0) {
			this.stack.push(this.currentNum);
			this.currentNum = 0;
		}
		console.log(this.stack);
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
		$("body").removeClass( "retro" ).addClass('modern');
	});
	$('#retro-theme').click(function() {
		$("body").removeClass( "modern" ).addClass('retro');
	});
	var d = new Date();
	var thisYear = d.getFullYear();
	document.getElementById("copyDate").innerHTML = thisYear;

}


buttonHandlers();