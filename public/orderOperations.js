function addOrder() {
    $.ajax({
        url: '/orders/',
        type: 'POST',
        data: $('#addorder').serialize(),
        success: function(result){
            window.location.replace("./orders");
        }
    })
};

function deleteOrder(id){
    $.ajax({
        url: '/orders/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("./orders");
        }
    })
};