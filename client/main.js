$("#myBtn").click(function() {
    var str = $("#icon-reco-text").val();
    getFromServer(str);
});

function getFromServer(reco) {
    //  alert('Term is ' + reco);
    $.ajax({
        type: 'POST',
        url: '/server/icon_recommendation/getRecommendation',
        contentType: 'application/json;charset=UTF-16',
        data: JSON.stringify({
            "text_for_recommendation": reco
        }),
        success: function(serverData) {
            $('#recoFromServer').text(JSON.stringify(serverData.data.items[0]));
        },
        error: function(error) {
            $('#recoFromServer').text(error);
            //  alert("Error received from Server :" + error);
        }
    });
};