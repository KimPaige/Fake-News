var temp = false;
$(document).keypress(function(e) {
    if(e.which == 13) {
        if (temp) {
            $("#image").attr("src",'home-page.png');
        } else {
            $("#image").attr("src","home-page-2.png");
        }
        temp = !temp;
    }
});