var user;

$(function() {
    $.get("/getuser", function(user) {
        if (user !== undefined) {
            $("#username").text(user.github.username)
        }
    })
    
    function getBooks(e){
        if(e.which === 13 || e.which === 1){
          $.get("https://www.googleapis.com/books/v1/volumes?q=" + $("#query").val(), function(data) {
            console.log(data);
            $(".modal").addClass("is-active")
            $("#results").empty();
            for(var i in data.items){
                $("#results").append("<img src='" + data.items[i].volumeInfo.imageLinks.thumbnail + "' style='cursor:pointer'/>")
            }
          })
        }
    }
    
    $("#search").on("click", getBooks)
    $("#query").on("keyup", getBooks);
    
    $(".modal-close").on("click", function(){$(".modal").removeClass("is-active")})
})