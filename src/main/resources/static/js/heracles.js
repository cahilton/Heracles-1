$(document).ready(function() {
		// initialize the cohort type ahead
		// constructs the suggestion engine
		var bloodhoundCohorts = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			limit: 20,
			// use /data/sample-cohorts.json just to start off
			prefetch: '/data/sample-cohorts.json',
		});

		bloodhoundCohorts.initialize();
		 
		$('#cohorts-typeahead .typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
			  name: 'states',
			  displayKey: 'value',
			  source: bloodhoundCohorts.ttAdapter(),
			  templates: {
			    empty: [
			      '<div class="empty-message">',
			      'Unable to find any cohorts that match the current query',
			      '</div>'
			    ].join('\n'),
			    suggestion: Handlebars.compile('<p><strong>{{name}}</strong> – {{description}}</p>')
			  }
			});
		$("#cohorts-typeahead").bind('typeahead:selected', function(obj, datum, name) { 
	        $("#cohorts").val(datum.name);

		});
		
	// focus on input box
	$("#cohorts-typeahead").focus();
});