$(function(){
    var books;
    var user;
    
    $.get("/getuser", function(data){
        user = data;
    })
    
    $.get("/api/allbooks", function(data){
        console.log(data)
        books = data;
        for(var i in data){
            $("#showcase").append("<div class='profile-book'><img src='" + data[i].cover + "' key='" + i +"' style='cursor:pointer'/><p>" + data[i].title + "</p><p>" + data[i].authors + "</p></div>")
        }
        $("img").on("click", coverHandler)
    })
    
   function coverHandler(){
        var key = $(this).attr("key");
        var data = books[key];
        console.log(data)
        $(".modal").addClass("is-active");
        $(".modal .right").html("<img src='" + data.cover + "' style='cursor:pointer'/>")
        $(".modal .left #title").text(data.title)
        $(".modal .left #author").text(data.authors)
        $(".modal .left #pages").text(data.pages)
        $(".modal .left #user").text(data.user)
        $("#submit").on("click", function(){
            data.requestedBy = user.github.username;
            $.post("/api/trade", data)
            window.location.reload()
        })
    }
    
    $(".modal-close").on("click", function(){$(".modal").removeClass("is-active")})
})