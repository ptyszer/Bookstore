$(function() {
    var $authorAddForm = $('#authorAdd');
    var $authorsList = $('#authorsList');
    var $authorEditSelect = $('#authorEditSelect');
    var $authorEditForm = $('#authorEdit');

    //get authors list
    $.get('../rest/rest.php/author')
        .done(function( data ) {
            console.log('get data', data);
            if (data.success && data.success.length > 0) {
                data.success.forEach(function(elm) {
                    createNewAuthor(elm)
                })
            }
        });

    //add new author
    $authorAddForm.on('submit', function (event) {
        event.preventDefault();

        $.post('../rest/rest.php/author', $(this).serialize())
            .done(function( data ) {
                console.log('submit', data)
                if (data.success && data.success.length > 0) {
                    createNewAuthor(data.success[0]);
                    showModal('Dodano autora');
                }
            }).fail(function() {
            showModal('Wystąpił błąd podczas dodawania autora');
        })
    });

    //delete author
    $authorsList.on('click', '.btn-author-remove', function () {
        let $me = $(this);

        $.ajax({
            url: '../rest/rest.php/author/' + $(this).data('id'),
            type: "DELETE",
            dataType: "json"
        }).done(function(data) {
            console.log(data.success);
            $me.parent().parent().parent().remove();
            $authorEditSelect.find('option[value=' + $me.data('id') + ']').remove();
            showModal('Usunięto autora');
        }).fail(function() {
            showModal('Wystąpił błąd podczas usuwania autora');
        });
    });

    //select input - display edit form
    $authorEditSelect.on('change', function () {
        if($(this).val()){
            $.get('../rest/rest.php/author/' + $(this).val())
                .done(function( data ) {
                    //console.log('get data', data)
                    if (data.success && data.success.length > 0) {
                        $authorEditForm.css('display', 'block');
                        $authorEditForm.find('#id').val( data.success[0]['id'] );
                        $authorEditForm.find('#name').val( data.success[0]['name'] );
                        $authorEditForm.find('#surname').val( data.success[0]['surname'] );
                    }
                })
        } else {
            $authorEditForm.css('display', 'none');
        }
    });

    //author update
    $authorEditForm.on('submit', function (event) {
        event.preventDefault();
        let authorId = $(this).find('#id').val();
        $.ajax({
            url: '../rest/rest.php/author/' + authorId,
            data: $(this).serialize(),
            type: "PATCH",
            dataType: "json"
        }).done(function(data) {
            let authorTitle = data.success[0]['name'] + ' ' + data.success[0]['surname'];
            //console.log(data);
            $authorEditForm.css('display', 'none');
            $authorEditSelect.val('');
            $authorsList.find('[data-id='+authorId+']')
                .siblings('.authorTitle')
                .text(authorTitle);
            $authorEditSelect.find('option[value='+authorId+']')
                .text(authorTitle);
            showModal('Edycja zakończona pomyślnie');
        }).fail(function() {
            showModal('Wystąpił błąd podczas edycji autora');
        })
    });

})

let createNewAuthor = (author) => {
    let $authorsList = $('#authorsList');
    let $li = $('<li>', {class: 'list-group-item'});
    let $panel = $('<div>', {class: 'panel panel-default'});
    let $heading = $('<div>', {class: 'panel-heading'});
    let $authorTitle = $('<span>', {class: 'authorTitle'});
    let $buttonRemove = $('<button class="btn btn-danger pull-right btn-xs btn-author-remove"><i class="fa fa-trash"></i></button>');
    let $authorEditSelect = $('#authorEditSelect');
    let $option = $('<option>');

    $authorTitle.text(author.name + ' ' + author.surname);
    $buttonRemove.attr('data-id', author.id);
    $option.val(author.id);
    $option.text(author.name + ' ' + author.surname);

    $heading.append($authorTitle).append($buttonRemove);
    $panel.append($heading);
    $li.append($panel);
    $authorsList.append($li);
    $authorEditSelect.append($option)
}