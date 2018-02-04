$(function() {
    var $bookAddForm = $('#bookAdd');
    var $bookList = $('#booksList');

    $.get('../rest/rest.php/book')
        .done(function( data ) {
             console.log('get data', data);
            if (data.success && data.success.length > 0) {
                data.success.forEach(function(elm) {
                    createNewBook(elm)
                })
            }
        });

    $bookAddForm.on('submit', function (event) {
        event.preventDefault()

        $.post('../rest/rest.php/book', $(this).serialize())
            .done(function( data ) {
                 //console.log('submit', data)
                if (data.success && data.success.length > 0) {
                    createNewBook(data.success[0])
                }
            })
    });

    $bookList.on('click', '.btn-book-show-description', function () {
        var $bookDescription = $(this).parent().parent().find('.book-description');
        $.get('../rest/rest.php/book/' + $(this).data('id'))
            .done(function( data ) {
                //console.log('get data', data)
                if (data.success && data.success.length > 0) {
                    var description = data.success[0]['description'];
                    $bookDescription.toggle().html(description)
                }
            })
    });

    $bookList.on('click', '.btn-book-remove', function () {
        $me = $(this);
        $.ajax({
            url: '../rest/rest.php/book/' + $(this).data('id'),
            type: "DELETE",
            dataType: "json"
        }).done(function(data) {
            console.log(data.success);
            $me.parent().parent().parent().remove();
        })

    })


})

let createNewBook = (book) => {
    let $booksList = $('#booksList');
    let $li = $('<li>', {class: 'list-group-item'});
    let $panel = $('<div>', {class: 'panel panel-default'});
    let $heading = $('<div>', {class: 'panel-heading'});
    let $bookTitle = $('<span>', {class: 'bookTitle'});
    let $buttonRemove = $('<button class="btn btn-danger pull-right btn-xs btn-book-remove"><i class="fa fa-trash"></i></button>');
    let $buttonShowDescription = $('<button class="btn btn-primary pull-right btn-xs btn-book-show-description"><i class="fa fa-info-circle"></i></button>');
    let $bookDescription = $('<div>', {class: 'panel-body book-description'});

    $bookTitle.text(book.title);
    $bookDescription.text(book.description);
    $buttonRemove.attr('data-id', book.id);
    $buttonShowDescription.attr('data-id', book.id);

    $heading.append($bookTitle).append($buttonRemove).append($buttonShowDescription);
    $panel.append($heading).append($bookDescription);
    $li.append($panel);
    $booksList.append($li)
}