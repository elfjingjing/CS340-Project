function updateCategory(id){
    var nameVal = document.getElementById('category' + id).value;
    $.ajax({
        url: '/categories/' + id,
        type: 'PUT',
        data: {id: id, name: nameVal},
        success: function(result){
            window.location.replace("./categories");
        }
    })
};

function deleteCategory(id){
    $.ajax({
        url: '/categories/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("./categories");
        }
    })
};