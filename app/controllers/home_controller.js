$(function(){
    $.get("/getuser", function(req,res){
        if(req.github !== undefined){
            $(".toggle").before('<a class="header-tab" href="/browse">Browse</a>')
            $(".toggle").attr("href", "/profile").text("Profile");
            $(".toggle").after('<a class="header-tab" href="/logout">Logout</a>')
        }
    })
})