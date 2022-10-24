//const session = require("express-session")

function goDoSomething(identifier) {
  var data = $(identifier).data('id');
  console.log("jhsadbfb", data)

  $.ajax({
    url: '/wishlist',
    method: 'post',
    dataType: 'json',
    data: { 'id': data },
    success: function (response) {
      if (response.msg == 'success') {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'product successfully added'
        })
      } else {
        location.href = '/login'
      }

    },

    error: function (response) {
      location.href = '/login'
    }
  });
}


function deleteWhishlist(value) {
  var data = $(value).data('id');
  console.log("hsagda", data);

  $.ajax({
    url: '/wishlist',
    method: 'delete',
    dataType: 'json',
    data: { 'id': data },
    success: function (response) {
      if (response.msg == 'success') {
        $("#whishlist").load(location.href + " #whishlist");

      } else {
        alert('data not get deleted');
      }
    },
    error: function (response) {
      console.log('error whishlist');
    }
  });
}

function shoppingCart(value) {
  var data = $(value).data('id');
  console.log("hsagda", data);

  $.ajax({
    url: '/cart',
    method: 'post',
    dataType: 'json',
    data: { 'id': data },
    success: function (response) {
      if (response.msg == 'success') {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'product successfully added'
        })
      } else {
        location.href = '/login'
      }

    },

    error: function (response) {
      location.href = '/login'
    }
  });
}

function changeCartQty(value) {
  var data = $(value).data('id');
  //var invalue = document.getElementById('cart-in').value;
  var invalue = value.value

  $.ajax({
    url: '/cahngeCartData',
    method: 'post',
    dataType: 'json',
    data: { 'id': data, 'value': invalue },
    success: function (response) {
      if (response.msg == 'success') {
        $("#total").load(location.href + " #total");
        $("#sub-total").load(location.href + " #sub-total");
      } else {
        alert('data not get deleted');
      }
    },
    error: function (response) {
      alert('server error')
    }
  });
}

function coupenApply() {
  var value = document.getElementById('coupen-apply').value;
  console.log("ahah", value);
  $.ajax({
    url: '/checkCoupen',
    method: 'post',
    dataType: 'json',
    data: { 'value': value },
    success: function (response) {
      if (response.msg == 'success') {
        console.log("coupen verified")
        alert('coupen verified Successfully')
        console.log("data", response.data)
        discount_value = response.data[0].Discountprice
        console.log(discount_value);
        total_prize = document.getElementById('total-prize')
        tp = total_prize.textContent;
        console.log(tp, "total prize", total_prize);
        tp = tp - response.data[0].Discountprice
        console.log("finally", tp);
        total_prize.textContent = tp;
        $("div.input_promotion").hide()
        $("div.promotion_applied").show()
        applied.textContent = response.data[0].Discountprice
      } else if (response.msg == 'coupenExist') {
        alert('Coupen already used')
      } else if (response.msg == 'coupennotfound') {
        alert("coupen code is incorrect")
      } else if (response.msg == 'coupenapplied') {
        alert("Coupen already applied")
      }
      else {
        console.log("coupen id is fake")
      }
    },
  });

}


function checkoutfinal() {

  total_prize = document.getElementById('total-prize').textContent
  console.log(total_prize, 'kskjsks');

  $.ajax({
    url: '/finalpayment',
    method: 'post',
    dataType: 'json',
    data: { 'total_prize': total_prize },
    success: function (response) {
      console.log("cod payment");
      if (response.CODstatus) {
        location.href = '/myorders'
      }
      else {
        console.log("payment");
        razorpayPayment(response);
      }
    },
    error: function (response) {
      alert('server error')
    }
  });

}


function razorpayPayment(order) {
  let options = {
    key: "rzp_test_ipNdLgFLTTSQs9", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "USD",
    name: "Play On",
    description: "Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      verifyPayment(response, order);
    },
    prefill: {
      name: "Test name",
      email: "test@email.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  let rzp1 = new Razorpay(options);
  rzp1.open();

  function verifyPayment(payment, order) {
    $.ajax({
      url: "/verifypayment",
      method: "post",
      data: {
        payment,
        order
      }, success: (response) => {
        if (response.status) {
          setTimeout(() => {
            location.href = '/myorders'
          }, 300);
        } else {
          $.ajax({
            url: '/paymentfailed/' + response.orderID,
            method: 'delete',
            success: (response) => {
            }, error: (err) => {
            }
          })
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  rzp1.on("payment.failed", function (response) {
    $.ajax({
      url: '/paymentfailed/' + response.receipt,
      method: 'get',
      success: (response) => {
        // location.href = '/paymentfailed'
        // console.log('payment       failed');
        // alert('payment       failed');
      }
    })

    // alert(response.error.code);
    // alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);
  });
}


function deletecart(value) {
  var data = $(value).data('id');

  $.ajax({
    url: '/cart',
    method: 'delete',
    dataType: 'json',
    data: { 'id': data },
    success: function (response) {
      if (response.msg == 'success') {
        $("#sub-total").load(location.href + " #sub-total");

      } else {
        alert('data not get deleted');
      }
    },
    error: function (response) {
      alert('server error')
    }
  });
}


function deleteaddress(value) {
  var data = $(value).data('id');

  $.ajax({
    url: '/adduseraddress',
    method: 'delete',
    dataType: 'json',
    data: { 'id': data },
    success: function (response) {
      if (response.msg == 'success') {
        $("#address-data").load(location.href + " #address-data");
      }
    },
    error: function (response) {
      alert('server error')
    }
  });
}


function changePaymentStatus(value) {
  var id = $(value).data('id');
  var status = $(value).data('status');
  console.log("ada", id, status);
  $.ajax({
    url: '/admin/orders-management',
    method: 'post',
    dataType: 'json',
    data: { 'id': id, 'status': status },
    success: function (response) {
      if (response.msg == 'success') {
        $("#order-details").load(location.href + " #order-details");
      }
    },
    error: function (response) {
      alert('server error')
    }
  });
}

function placeordermodal() {
  console.log("ka");
  total_prize = document.getElementById('total-prize').textContent;
  discount = document.getElementById('applied').textContent;
  total = document.getElementById('total_old').textContent;
  total_prize_modal.textContent = total_prize;
  applie_modal.textContent = discount;
  total_old_modal.textContent = total
  console.log('vaaaaaaaaa', total_prize, discount);
  $("#place_order").modal("toggle");

}



function loginsubmit() {
  User_Email = document.getElementById('emailin').value;
  Password = document.getElementById('passwordin').value;
  console.log(User_Email, Password)

  if (!validateEmailSign() || !validatePasswordsign()) {
    submitError.style.display = 'block'
    submitError.innerHTML = 'Please fill the form';
    setTimeout(function () { submitError.style.display = 'none' }, 3000)
    return false;
  }
  else {


    $.ajax({
      url: '/',
      method: 'post',
      dataType: 'json',
      data: { 'User_Email': User_Email, 'Password': Password },
      success: function (response) {
        if (response.msg == 'success') {
          console.log('sucess');
          location.href = '/'
        } else {
          console.log("not found");
          document.getElementById('usernotfound').innerText = "Please enter valid user name and password"

        }
      },
      error: function (response) {
        alert('server error')
      }
    });
  }
}


function cancelOrder(id) {
  var id = $(id).data('id');
  Swal.fire({
    text: "You want to cancel tis order",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, cancel it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '/ordercancel/' + id,
        method: 'get',
        dataType: 'json',
        data: {},
        success: function (response) {
          if (response.msg == 'success') {
            console.log('sucess');
            $("#rowmai").load(location.href + " #rowmai");

          }
        },
        error: function (response) {
          alert('server error')
        }
      });
    }
  })
}

function logout() {
  Swal.fire({
    text: "You want to logout",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '/logout',
        method: 'get',
        dataType: 'json',
        data: {},
        success: function (response) {
          if (response.msg == 'success') {
            location.href = '/'
          }
        }
      });
    }
  })
}


function changeUserPassword() {
  oldPassword = document.getElementById('Old_Password').value;
  Password = document.getElementById('Password').value;
  Re_Password = document.getElementById('Re_Password').value;

  // console.log(User_Email, Password)

  if (!validatePassword() || !validateConfirm() || !validateOldPassword()) {
    submitError.style.display = 'block'
    submitError.innerHTML = 'Please fill the form';
    setTimeout(function () { submitError.style.display = 'none' }, 3000)
    return false;
  }
  else {


    $.ajax({
      url: '/changeuserpassword',
      method: 'post',
      dataType: 'json',
      data: { 'oldPassword': oldPassword, 'Password': Password, Re_Password: 'Re_Password' },
      success: function (response) {
        if (response.msg == 'success') {
          console.log('sucess');
          setTimeout(() => {
            location.href = '/viewprofile'
          }, 3000);
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          Toast.fire({
            icon: 'success',
            title: 'Password changed successsfully'
          })
        } else {
          document.getElementById('passwordwrong').innerText = "Please enter valid user name and password"
        }
      },
    });
  }
}



function cancelOrderAdmin(id) {
  var id = $(id).data('id');
  Swal.fire({
    text: "You want to cancel tis order",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, cancel it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '/admin/orderCancel',
        method: 'post',
        dataType: 'json',
        data: { 'id': id },
        success: function (response) {
          if (response.msg == 'success') {
            console.log('sucess');
            location.href = '/admin/orders'
          }
        },
        error: function (response) {
          alert('server error')
        }
      });
    }
  })
}



function logoutAdmin() {
  Swal.fire({
    text: "You want to logout",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '/admin/login',
        method: 'delete',
        dataType: 'json',
        data: {},
        success: function (response) {
          if (response.msg == 'success') {
            location.href = '/admin'
          }
        }
      });
    }
  })
}


