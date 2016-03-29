var user;
var results = []

$(function() {
    $.get("/getuser", function(user) {
        if (user !== undefined) {
            $("#username").text(user.github.username)
            $("#display").empty();
            for(var i in user.books){
                $("#display").append("<img src='" + user.books[i].cover + "' style='cursor:pointer'/>")
            }
        }
    })
    
    function convertAuthors(arr){
        return arr.join(",")
    }
    
    function getBooks(e){
        if(e.which === 13 || e.which === 1){
          $.get("https://www.googleapis.com/books/v1/volumes?q=" + $("#query").val(), function(data) {
            console.log(data);
            $(".modal").addClass("is-active")
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
                    $("#results").append("<img class='book' src='" + book.imageLinks.thumbnail + "' key='" + count + "' style='cursor:pointer'/>")
                    count++
                }
            }
            console.log(results)
              $(".book").on("click", function(){
                var data = results[$(this).attr("key")];
                console.log(data)
                $.post("/api/addbook", data);
                $.post("/api/allbooks", data)
            })
          })
        }
    }
    
    $("#search").on("click", getBooks)
    $("#query").on("keyup", getBooks);
    
    $(".modal-close").on("click", function(){$(".modal").removeClass("is-active")})
})