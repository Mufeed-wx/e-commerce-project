// user blocking
function blockUser(identifier) {
    var id = $(identifier).data('id');
    Swal.fire({
        text: "You want to block this user",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, block!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/user-management',
                method: 'post',
                dataType: 'json',
                data: { 'id': id },
                success: function (response) {
                    if (response.status == '200') {
                        $("#userManagement").load(location.href + " #userManagement");

                    }
                },
                error: function (response) {
                    alert('server error')
                }
            });
        }
    })
}
//active user

function activeUser(identifier) {
    var id = $(identifier).data('id');
    Swal.fire({
        text: "You want to active this user",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, active!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/user-management',
                method: 'put',
                dataType: 'json',
                data: { 'id': id },
                success: function (response) {
                    if (response.status == '200') {
                        $("#userManagement").load(location.href + " #userManagement");

                    }
                },
                error: function (response) {
                    alert('server error')
                }
            });
        }
    })
}


$(document).ready(function () {
    $('#uploadForm').submit(function () {
        $(this).ajaxSubmit({
            error: function (xhr) {
            },
            success: function (response) {
                console.log(response);
            }
        });
        return false;
    });
});



function deleteProduct(identifier) {
    var id = $(identifier).data('id');
    Swal.fire({
        text: "You want to delete this product",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/product-management',
                method: 'delete',
                dataType: 'json',
                data: { 'id': id },
                success: function (response) {
                    if (response.status == '200') {
                        $("#productManagement").load(location.href + " #productManagement");
                    }
                },
                error: function (response) {
                    alert('server error')
                }
            });
        }
    })
}



function deleteCategory(identifier) {
    var id = $(identifier).data('id');
    Swal.fire({
        text: "You want to delete this Category",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/category-management',
                method: 'delete',
                dataType: 'json',
                data: { 'id': id },
                success: function (response) {
                    if (response.status == '200') {
                        $("#categoryTable").load(location.href + " #categoryTable");

                    }
                },
                error: function (response) {
                    alert('server error')
                }
            });
        }
    })
}
var Category_Name;
function getValue(e) {
    Category_Name = e.value;
    console.log('name', Category_Name);
}
function editCategory(identifier) {
    var id = $(identifier).data('id');

    $.ajax({
        url: '/admin/category-management',
        method: 'put',
        dataType: 'json',
        data: { 'id': id, 'Category_Name': Category_Name },
        success: function (response) {
            if (response.status == '200') {
                $("#categoryTable").load(location.href + " #categoryTable");
            } else {
                location.href = '/login'
            }

        },

        error: function (response) {
            location.href = '/login'
        }
    });
}

function deleteSubCategory(identifier) {
    var id = $(identifier).data('id');
    Swal.fire({
        text: "You want to delete this sub category",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/sub-category',
                method: 'delete',
                dataType: 'json',
                data: { 'id': id },
                success: function (response) {
                    if (response.status == '200') {
                        $("#categoryTable").load(location.href + " #categoryTable");

                    }
                },
                error: function (response) {
                    alert('server error')
                }
            });
        }
    })
}


function deleteCoupon(identifier) {
    var id = $(identifier).data('id');
    Swal.fire({
        text: "You want to delete this coupon",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/admin/coupon-management',
                method: 'delete',
                dataType: 'json',
                data: { 'id': id },
                success: function (response) {
                    if (response.status == '200') {
                        $("#couponManagement").load(location.href + " #couponManagement");
                    }
                },
                error: function (response) {
                    alert('server error')
                }
            });
        }
    })
}
