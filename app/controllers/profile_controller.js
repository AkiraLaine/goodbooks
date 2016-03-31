var userInfo;
var results = []
var notifications = [];
var trades = []

$(function() {
    $.get("/getuser", function(user) {
        if (user !== undefined) {
            userInfo = user;
            $("#username").text(user.github.username)
            $("#display").empty();
            $("#notifications").empty()
            for(var i in user.books){
                $("#display").append("<div class='profile-book'><img src='" + user.books[i].cover + "' style='cursor:pointer'/><p>" + user.books[i].title + "</p><p>" + user.books[i].authors + "</p></div>")
            }
            if(user.notifications.length !== 0){
                for(var i in user.notifications){
                    notifications.push(user.notifications[i])
                    $("#notifications").append("<div class='notification'>" + user.notifications[i].requestedBy + " wants to trade " + user.notifications[i].title + ".<br><a class='button is-success is-small accept' key='" + i + "'>Accept</a><a class='button is-danger is-small decline' key='" + i + "'>Decline</a></div>");
                }
            } else {
                $("#notifications").html("<em><p class='subtitle'>None.</p></em>")
            }
            if(user.trades.length !== 0){
                for(var i in user.trades){
                    trades.push(user.trades[i])
                    $("#trades").append("<div class='notification'><button class='delete' key='" + i + "'></button>Your trade request for " + user.trades[i].title + " has been " + user.trades[i].trade + ".</div>");
                }
            } else {
                $("#trades").html("<em><p class='subtitle'>None.</p></em>")
            }
            $(".accept").on("click", acceptTrade);
            $(".decline").on("click", declineTrade)
            $(".delete").on("click", removeTrade)
        }
    })
    
    
    function convertAuthors(arr){
        return arr.join(",")
    }
    
    function getBooks(e){
        if(e.which === 13 || e.which === 1){
          $.get("https://www.googleapis.com/books/v1/volumes?q=" + $("#query").val(), function(data) {
            console.log(data);
            $(".books").addClass("is-active")
            $("#results").empty();
            results = [];
            var count = 0;
            for(var i in data.items){
                var book = data.items[i].volumeInfo;
                if(book.title !== undefined && book.authors !== undefined && book.description !== undefined && book.pageCount !== undefined && book.imageLinks !== undefined){
                    results.push({title: data.items[i].volumeInfo.title, authors: convertAuthors(data.items[i].volumeInfo.authors), 
                        desc: data.items[i].volumeInfo.description, pages: data.items[i].volumeInfo.pageCount, 
                        cover: data.items[i].volumeInfo.imageLinks.thumbnail
                    })
                    $("#results").append("<img class='book' src='" + book.imageLinks.thumbnail + "' key='" + count + "' style='cursor:pointer;margin: 5px 5px 0'/>")
                    count++
                }
            }
            console.log(results)
              $(".book").on("click", function(){
                var data = results[$(this).attr("key")];
                data.user = userInfo.github.username;
                console.log(data)
                $.post("/api/addbook", data)
                $.post("/api/allbooks", data)
                $(".modal").removeClass("is-active")
                window.location.reload();
             })
          })
        }
    }
    
    function acceptTrade(){
        var key = $(this).attr("key")
        var data = notifications[key];
        console.log(data);
        $.post("/api/trade/accept", data)
        window.location.reload();
    }
    
    function declineTrade(){
        var key = $(this).attr("key")
        var data = notifications[key];
        console.log(data);
        $.post("/api/trade/decline", data)
        window.location.reload();
    }
    
    function removeTrade(){
        var key = $(this).attr("key")
        var data = trades[key];
        console.log(data);
        $.post("/api/trade/remove", data)
        window.location.reload();
    }
    
    $("#search").on("click", getBooks)
    $("#query").on("keyup", getBooks);
    
    $("#settings").on("click", function(){
        $(".settings").addClass("is-active")    
    });
    
    $("#submit").on("click", function() {
        var data = {fullName: $("#full-name").val(), city: $("#city").val(), state: $("#state").val()};
        $.post("/api/user/info", data)
        $(".modal").removeClass("is-active")
    })
    
    $(".modal-close").on("click", function(){$(".modal").removeClass("is-active")})
})