$(document).ready(function() {

	// initialize the cohort type ahead, constructs the suggestion engine
    var bloodhoundCohorts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 20,
        // use /data/sample-cohorts.json just to start off
        prefetch: '/data/sample-cohorts.json',
    });
    bloodhoundCohorts.initialize();
    
    // initialize bootstrap data toggle
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });

    // typeahead cohort listener
    $('#cohorts-typeahead .typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    }, {
        name: 'cohorts',
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
    
    // on select a cohort
    $("#cohorts-typeahead").bind('typeahead:selected', function(obj, datum, name) {
        $("#cohorts").val(datum.name);

        $("#cohort-search").slideUp("fast", function() {
        	// set page data
        	angular.element($('#cohort-explorer-main')).scope().showCohort(datum);

        	// show div
            $("#cohort-explorer-main").slideDown("slow");
        });

    });
    
    // go back listener on cohort explorer
    $("#cohort-explorer-back").click(function() {
    	$("#cohort-explorer-main").slideUp("fast", function() {
            $("#cohort-search").slideDown('fast'), function() {
                setTimeout(function(){
                	$("#cohorts-typeahead").focus();
                }, 3000);
            }
        });
    });

    // focus on input box
    setTimeout(function(){
    	$("#cohorts-typeahead").focus();
    }, 3000);
});