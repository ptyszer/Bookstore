$(function() {
    var $bookAddForm = $('#bookAdd');
    var $bookList = $('#booksList');
    var $bookEditSelect = $('#bookEditSelect');
    var $bookEditForm = $('#bookEdit');
    var $bookAddAuthor = $bookAddForm.find('#author_id');
    var $bookEditAuthor = $bookEditForm.find('#author_id_edit');

    //get book list
    $.get('../rest/rest.php/book')
        .done(function( data ) {
             console.log('get data', data);
            if (data.success && data.success.length > 0) {
                data.success.forEach(function(book) {
                    createNewBook(book);
                })
            }
        });

    //get authors list
    $.get('../rest/rest.php/author')
        .done(function( data ) {
            //console.log('get data', data);
            if (data.success && data.success.length > 0) {
                data.success.forEach(function(author) {
                    //console.log(author);
                    let $authorOption = $('<option>');
                    $authorOption.val(author.id);
                    $authorOption.text(author.name + ' ' + author.surname);

                    $authorOption.appendTo($bookAddAuthor);
                    $authorOption.clone().appendTo($bookEditAuthor);
                })
            }
        });

    //add new book
    $bookAddForm.on('submit', function (event) {
        event.preventDefault();

        $.post('../rest/rest.php/book', $(this).serialize())
            .done(function( data ) {
                 console.log('submit', data)
                if (data.success && data.success.length > 0) {
                    createNewBook(data.success[0]);
                    showModal('Dodano książkę');
                }
            }).fail(function() {
                showModal('Wystąpił błąd podczas dodawania książki');
            })
    });

    //description display
    $bookList.on('click', '.btn-book-show-description', function () {
        let $bookDescription = $(this).parent().parent().find('.book-description');
        $.get('../rest/rest.php/book/' + $(this).data('id'))
            .done(function( data ) {
                //console.log('get data', data)
                if (data.success && data.success.length > 0) {
                    let book = data.success[0];
                    $bookDescription.toggle().html(book.description)
                }
            })
    });

    //delete book
    $bookList.on('click', '.btn-book-remove', function () {
        let $me = $(this);
        $.ajax({
            url: '../rest/rest.php/book/' + $(this).data('id'),
            type: "DELETE",
            dataType: "json"
        }).done(function(data) {
            //console.log(data.success);
            $me.parent().parent().parent().remove();
            $bookEditSelect.find('option[value=' + $me.data('id') + ']').remove();
            showModal('Usunięto książkę');
        }).fail(function() {
            showModal('Wystąpił błąd podczas usuwania książki');
        })

    })

    //select input - display edit form
    $bookEditSelect.on('change', function () {
        if($(this).val()){
            $.get('../rest/rest.php/book/' + $(this).val())
                .done(function( data ) {
                    //console.log('get data', data)
                    if (data.success && data.success.length > 0) {
                        let book = data.success[0];
                        $bookEditForm.css('display', 'block');
                        $bookEditAuthor.val(book.author.id);
                        $bookEditForm.find('#id').val(book.id);
                        $bookEditForm.find('#title').val(book.title);
                        $bookEditForm.find('#description').val(book.description);
                    }
                })
        } else {
            $bookEditForm.css('display', 'none');
        }

    })

    //book update
    $bookEditForm.on('submit', function (event) {
        event.preventDefault();
        let bookId = $(this).find('#id').val();
        $.ajax({
            url: '../rest/rest.php/book/' + bookId,
            data: $(this).serialize(),
            type: "PATCH",
            dataType: "json"
        }).done(function(data) {
            let book = data.success[0];
            let bookTitle = book.title + ' (' + book.author.name + ' ' + book.author.surname + ')';

            $bookEditForm.css('display', 'none');
            $bookEditSelect.val('');
            $bookList.find('[data-id='+bookId+']')
                .siblings('.bookTitle')
                .text(bookTitle);
            $bookEditSelect.find('option[value='+bookId+']')
                .text(bookTitle);
            showModal('Edycja zakończona pomyślnie');
        }).fail(function() {
            showModal('Wystąpił błąd podczas edycji książki');
        })

    });


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
    let $bookEditSelect = $('#bookEditSelect');
    let $bookEditOption = $('<option>');
    let title = book.title + ' (' + book.author.name + ' ' + book.author.surname + ')';

    $bookTitle.text(title);
    $bookDescription.text(book.description);
    $buttonRemove.attr('data-id', book.id);
    $buttonShowDescription.attr('data-id', book.id);
    $bookEditOption.val(book.id);
    $bookEditOption.text(title);

    $heading.append($bookTitle).append($buttonRemove).append($buttonShowDescription);
    $panel.append($heading).append($bookDescription);
    $li.append($panel);
    $booksList.append($li);
    $bookEditSelect.append($bookEditOption)
}