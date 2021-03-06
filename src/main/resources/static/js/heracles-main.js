var activeFilter = undefined;
jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
    return this.each(function() {
        var select = this;

        $(textbox).bind('change keyup', function() {
            //var options = $(select).empty().data('options');
            var search = $(this).val().trim();
            var regex = new RegExp(search, "gi");
            var shown = [];
            $(select).find("label").each(function() {
                // child = <label><input type='checkbox .../></label>
                var child = $(this);
                /*
                if (child.hasClass("toggle-parent-label")) {
                	return;
                }
                */
                var childText = child.find("input").attr("value");
                if (childText && childText.match(regex) !== null) {
                    child.show();
                    var parent = child.find("input").attr("parent");
                    if (parent && shown.indexOf(parent) < 0) {
                        shown.push(parent);
                    }
                } else {
                    child.hide();
                }
            });
            // make sure parents are shown even if they text doesn't match
            $.each(shown, function() {
                $(".toggle-parent-label[key='" + this + "']").show();
            });
        });
    });
};
jQuery.fn.multiselect = function() {
    $(this).each(function() {
        var checkboxes = $(this).find(".toggle-checkbox-item");
        checkboxes.each(function() {
            var checkbox = $(this);
            // Highlight pre-selected checkboxes
            if (checkbox.attr("checked")) checkbox.parent().addClass("multiselect-on");
            // Highlight checkboxes that the user selects
            checkbox.click(function() {
                if (checkbox.attr("checked")) checkbox.parent().addClass("multiselect-on");
                else checkbox.parent().removeClass("multiselect-on");
            });
        });
    });
};

function getWebApiUrl() {
	return $("#webapi-url").val();
}

function isDemoMode() {
	return ($("#demo-mode").val() === "true");
}

function toggleVisibleReports(checked, selector) {
    $(selector).find("input[type='checkbox']:visible").prop('checked', checked);
}

// regular functions
function split(val) {
    return val.split(/,\s*/);
}

$(document).ready(function() {
	
	var cohortDefUrl;
	if (isDemoMode()) {
		cohortDefUrl = '/data/sample-cohorts.json';
	} else {
		cohortDefUrl = getWebApiUrl() + '/cohortdefinition';
	}

	// initialize the cohort type ahead, constructs the suggestion engine
    var bloodhoundCohorts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('COHORT_DEFINITION_NAME'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 10,
        // if we get to have a lot of cohorts, prefetch may not work, and we'll have to use remote
        prefetch: cohortDefUrl
    });
    
    bloodhoundCohorts.initialize();
    
    // initialize bootstrap data toggle
    $("body").tooltip({ selector:'[data-toggle=tooltip]' });

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
            suggestion: Handlebars.compile('<p><strong>{{COHORT_DEFINITION_NAME}}</strong> – {{COHORT_DEFINITION_DESCRIPTION}}</p>')
        }
    });
    
    // on select a cohort
    $("#cohorts-typeahead").bind('typeahead:selected', function(obj, datum, name) {
        $("#cohorts").val(datum.cohortDefinitionName);

        $(".page-one").slideUp("fast", function() {
        	// set page data
        	angular.element($('#cohort-explorer-main')).scope().showCohort(datum);

        	// show div
            $("#cohort-explorer-main").slideDown("slow");
        });

    });
    
    // go back listener on cohort explorer
    $("#cohort-explorer-back").click(function() {
    	$("#cohort-explorer-main").slideUp("fast", function() {
            $(".page-one").slideDown('fast'), function() {
                setTimeout(function(){
                	$("#cohorts-typeahead").focus();
                }, 3000);
            }
        });
    });
    
    // set up auto checkbox filters
    //setup select/clear filters events
    $(".auto-filter-check-list-select").click(function() {
        toggleVisibleReports(true, ".multiselect[filter-key='" + $(this).attr("filter-key") + "']");
        return false;
    });
    $(".auto-filter-check-list-clear").click(function() {
        toggleVisibleReports(false, ".multiselect[filter-key='" + $(this).attr("filter-key") + "']");
        return false;
    });
    // trigger parent click
    $(".toggle-parent-label").click(function() {
    	  var checked = $(this).prop("checked");
          $("input[parent='" + $(this).val() + "']:visible").prop("checked", checked);
    });

    // add event listeners to show multiselect divs
    $(".auto-filter-check-list-input")
	    .focus(function() {
	    	// hide all then show active 
	    	activeFilter = $(this).attr("filter-key");
	    	// hide up other active filters
	    	$(".multiselect-wrapper[filter-key!='" + activeFilter + "']:visible").slideUp("slow");
	    	// show current active filters
	    	$(".multiselect-wrapper[filter-key='" + activeFilter + "']").slideDown("slow");
	    	
	    });
    
    $("body").click(function(e) {
    	// if click outside the active filter, then hide that div
    	var hideFilter = true;
    	var click = $(e.target);
    	// look at self
    	if (click.attr("filter-key") && click.attr("filter-key") === activeFilter) {
    		hideFilter = false;
    	}
    	// look at parents
    	var clickParentFilter = (click.parents(".multiselect-wrapper").attr("filter-key"));
		if (clickParentFilter && clickParentFilter === activeFilter) {
			hideFilter = false;
		}
	
    	if (hideFilter) {
    		if (activeFilter) {
    			$(".multiselect-wrapper[filter-key='" + activeFilter + "']").slideUp("slow");
    			activeFilter = undefined;
    		}
    	} 
    })

    // focus on input box
    setTimeout(function(){
    	$("#cohorts-typeahead").focus();
    }, 3000);
});

// init multiselect w/ checkboxes
$(function() {
    $(".multiselect").multiselect();
});
// init filters
$(function() {
	$(".multiselect").each(function() {
		var filterKey = $(this).attr("filter-key");
		$(this).filterByText($(".auto-filter-check-list-input[filter-key='" + filterKey + "']"), true);
	});
});