function updateItem(id){
    var nameVal = document.getElementById('item' + id).value;
    var priceVal = document.getElementById('price' + id).value;
    var categoryVal = document.getElementById('category' + id).value;
    $.ajax({
        url: '/items/' + id,
        type: 'PUT',
        data: {id: id, name: nameVal, price: priceVal, categoryId:categoryVal},
        success: function(result){
            window.location.replace("./items");
        }
    })
};

function deleteItem(id){
    $.ajax({
        url: '/items/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("./items");
        }
    })
};