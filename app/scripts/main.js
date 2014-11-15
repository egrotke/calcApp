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
			if (this.currentNum == 0) {
				this.currentNum = input;
			} else {
				this.currentNum += input;
			}
			$('#readout').html(this.currentNum);
		} else if (input == '+' || input == '-' || input == 'x' || input == '/') {
			this.doOperation(input);
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
		if (Number(this.currentNum) != 0 && this.stack.length > 0) {
			operand1 = Number(this.currentNum);
			operand2 = Number(this.stack.pop());
		} else if (this.stack.length > 1) {
			operand1 = Number(this.stack.pop());
			operand2 = Number(this.stack.pop());
		} else {
			return;
		}
		switch (operator) {
			case '+':
				console.log('Plus pressed');
				this.result = operand1 + operand2;
				break;
			case '-':
				console.log('Minus pressed');
				this.result = operand1 - operand2;
				break;
			case 'x':
				console.log('Times pressed');
				this.result = operand1 * operand2;
				break;
			case '/':
				console.log('Division pressed');
				this.result = operand1 / operand2;
				break;

		}
		this.stack.push(this.result);
		$('#readout').html(String(this.result));
		this.currentNum = 0;
		console.log(this.stack);
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
		if (Number(this.currentNum) != 0) {
			this.stack.push(Number(this.currentNum.trim()));
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
		value: '/'
	}, {
		value: '4'
	}, {
		value: '5'
	}, {
		value: '6'
	}, {
		value: 'x'
	}, {
		value: '1'
	}, {
		value: '2'
	}, {
		value: '3'
	}, {
		value: '-'
	}, {
		value: '0'
	}, {
		value: '.'
	}, {
		value: 'CE'
	}, {
		value: '+'
	}, {
		value: 'C'
	}, {
		value: 'Enter'
	}]),
	keyPadView = new KeyPadView({
		model: new KeyPad(),
		collection: keyPads,
		el: $('#calculator'),
	});