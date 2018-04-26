$(document).ready(function(){
    var apiUrl = tx.shopUrl + "api.v1/app/",
        form = $(".tx"),
        fromField = form.find(".from select"),
        toField = form.find(".to select"),
        dpField = $(".date input").datepicker({ dateFormat: "yy-mm-dd" });

    // fetch departure stations on page load

    $.get({
        url : apiUrl + "Station.findStartStations",
        success : function(stations) {
            fromField.prop("disabled", false);
            stations.forEach(function(station){
                fromField.append($("<option>").attr("value", station.id).text(station.name));
            });
        }
    });

    // fetch destination stations when a start station is selected

    fromField.on("change", function(){
        toField.prop("disabled", true);

        $.get({
            url : apiUrl + "Station.findDestinationStations?request=" + parseInt(fromField.val(), 10),
            success : function(stations) {
                toField
                    .prop("disabled", !stations.length)
                    .val("0")
                    .find("option:not(.placeholder)").remove();

                stations.forEach(function(station){
                    toField.append($("<option>").attr("value", station.id).text(station.name));
                });
            }
        });
    });


    form.on('submit', function(ev){
        // instead of submitting the form, we must collect the values and create a redirect.
        ev.preventDefault();

        var request = {
            from : parseInt(fromField.val(), 10),
            to : parseInt(toField.val(), 10),
            days: [ dpField.val() ] // yes, this has to be an array
        };

        try {
            if (!request.from)
                throw new Error("Please select a departure station.");

            if (!request.to)
                throw new Error("Please select a destination station.");

            if (!request.days[0])
                throw new Error("Please select a date.");

            // redirect to Tixys shop
            location.href = tx.shopUrl + "#!?" + JSON.stringify(request);
        }
        catch (error)
        {
            window.alert(error.message);
        }
    });
});
