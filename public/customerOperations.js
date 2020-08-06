function updateCustomer(id){
    var firstnameVal = document.getElementById('customerf' + id).value;
    var lastnameVal = document.getElementById('customerl' + id).value;
    var emailVal = document.getElementById('customerEmail' + id).value;
    $.ajax({
        url: '/customers/' + id,
        type: 'PUT',
        data: {id: id, firstName: firstnameVal, lastName: lastnameVal, email: emailVal},
        success: function(result){
            window.location.replace("./customers");
        }
    })
};

function deleteCustomer(id){
    $.ajax({
        url: '/customers/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.replace("./customers");
        }
    })
};