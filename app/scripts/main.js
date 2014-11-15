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
	stack: 0,
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
		this.stack += e.target.innerHTML;
		console.log(this.stack);
		//this.readout.html(e.target.innerHTML);
		$('#readout').html(this.stack);
	}
});

var keyPads = new KeyPadCollection([{
		value: '7'
	}, {
		value: '8'
	}, {
		value: '9'
	}, {
		value: '%'
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
		value: '='
	}, {
		value: '+'
	}]),
	keyPadView = new KeyPadView({
		model: new KeyPad(),
		collection: keyPads,
		el: $('#calculator'),
	});