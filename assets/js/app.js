function timeLeadingZeros(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}
function parseTimestamp(date) {
    var now = new Date(date);
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    var day = days[now.getDay()];
    var month = months[now.getMonth()];
    var h = now.getHours();
    var m = now.getMinutes();

    return day + ", " + now.getDate() + ". " + month + " " +  now.getFullYear() + " - " + timeLeadingZeros(now.getHours()) + ":" + timeLeadingZeros(now.getMinutes());
}
$(document).ready(function () {
    // AJAX TO GET THE DATA FROM THE PHP AND ON SUCCESS TO PUT IT INTO THE HTML shiftContaier
    $.ajax({
        type: "POST",
        url: 'core/functions/shifts/shiftCards.php',
        dataType: "json",   //expect json to be returned
    })
        .done(function (response) {
            // GET ALL THE DATA FROM THE PHP FILE AND PUTS IT INTO THE PAGE CONTAINER

            if (response.success) {
                var shifts = "";
                var evenOdd = 1;
                response.shifts.forEach(function (shiftData) {

                    var bgStyle;
                    if (evenOdd % 2 == 1){
                        bgStyle = 'mat_single_odd';
                    } else bgStyle = '';
                    evenOdd++;

                    shifts +=
                        "<li style='list-style-type: none'>"+
                        "<div class='current'>" +
                    "<div class='mat_single_event_holder "+bgStyle+"'>" +
                     "<div class='mat_single_event_holder_inner'>" +
                      "<div class='mat_event_image'>" +
                       "<div class='mat_event_image_inner'>" +
                        "<a title='Brasserie - Breakfast' href='#'>" +
                        "<img src='../../assets/images/logo.png' border='0'>"+
                        "</a>"+
                        "</div>"+
                        "</div>"+
                        "<div class='mat_event_content'>"+
                        "<div class='mat_event_content_inner'>"+
                        "<h4 class='h4_shift_link'><a class='a_link_title_color' href='#'>" + shiftData['title'] + "</a></h4>"+
                        "<div class='mat_event_location'>"+
                        "<strong><a class='a_link_tivoli_location' href='#'>Tivoli Hotel &amp; Congress Center</a> " + parseTimestamp(shiftData['begin']) +"</strong></div>"+
                    "<div class='mat_small mat_booked participants_count'> 3 out of "+shiftData['participants']+" participants  </div>"+
                    "<div class='progress_bar_margin'>"+
                     "   <div class='progress'>"+
                      "  <div class='progress-bar' style='width: 45%;'></div>"+
                       " </div>"+
                       "</div>"+
                        "<span class='mat_small mat_booked closing_date col-xs-10'>Closing date:"+parseTimestamp(shiftData['close'])+"</span>"+
                    "<div class='mat_event_infoline duty_manager col-xs-8'>"+
                        "<span class='mat_small'>"+
                        "<span>Duty manager: "+shiftData['duty_manager']+" - </span>Category: "+shiftData['category']+" </span>"+
                    "</div>"+
                    "<a class='edit_shift_glyphicon' href='#'>"+
                        "<div class='glyphicon glyphicon-edit'></div>"+
                        "</a>"+
                        "<a class='cancel_shift_glyphicon' href='#'>"+
                        "<div class='glyphicon glyphicon-remove-circle'></div>"+
                        "</a>"+
                        "</div>"+
                        "</div>"+
                        "<div style='clear:both'></div>"+
                        "</div>"+
                        "</div>"+
                        "</div>" +
                    "</li>"

                });

                $("#shiftContainer").append(shifts);
                $("#shiftContainer").easyPaginate({
                    paginateElement: 'li',
                    elementsPerPage: 3,
                    effect: 'climb',
                    firstButton: false,
                    prevButtonText: 'Prev',
                    nextButtonText: 'Next',
                    lastButton: false

                });
            } else {
                console.error('Shifts unsuccessfuly fetched');
            }
        });
    // 'form' - INDICATES THE TYPE OF THE HTML ELEMENT
    // '#createShiftForm' - IS THE ID OF THE FORM THAT IS RESETED
    $('#createShiftForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: 'core/functions/shifts/createShift.php',
            data: $('form').serialize(),
            success: function () {
                $('#createShiftForm')[0].reset();
                $.growl.notice({title: "Success", message: "You successfully created the shift!"});
            }
        });
    });

    $('#loginButton').click(function () {
        $.ajax('core/functions/login/login.php', {
            type: 'POST',
            dataType: 'json',
            data: {
                login_name: $('#login-name').val(),
                login_pass: $('#login-pass').val()
            }
        })
            .done(function (response) {
                if (response.success) {
                    $.growl.notice({title: "Success", message: response.message});
                    // delay with 5s to let the notification be displayed
                    window.setTimeout(function () {
                        window.location.href = "";
                    }, 3000);
                } else {
                    $.growl.error({title: "Error", message: response.message});
                }
            })
    });
    $('#changePassword').click(function () {
        $.ajax('core/functions/login/change-password.php', {
            type: 'POST',
            dataType: 'json',
            data: {
                current_pass: $('#current-pass').val(),
                new_pass: $('#new-pass').val(),
                confirm_pass: $('#confirm-pass').val()
            }
        })
            .done(function (response) {
                if (response.success) {
                    $.growl.notice({title: "Success", message: response.message});
                    window.setTimeout(function () {
                        window.location.href = "index.php";
                    }, 5000);
                } else {
                    $.growl.error({title: "Error", message: response.message});
                }
            })
    });
    $('#recoverButton').click(function () {
        $.ajax('core/functions/login/recover.php', {
            type: 'POST',
            dataType: 'json',
            data: {
                email_address: $('#email-address').val()
            }
        })
            .done(function (response) {
                if (response.success) {
                    $.growl.notice({title: "Success", message: response.message});
                    window.setTimeout(function () {
                        window.location.href = "index.php";
                    }, 5000);
                } else {
                    $.growl.error({title: "Error", message: response.message});
                }
            })
    });
    $('#updateAccount').click(function () {
        $.ajax('core/functions/login/edit-profile.php', {
            type: 'POST',
            dataType: 'json',
            data: {
                edit_first_name: $('#edit-first-name').val(),
                edit_last_name: $('#edit-last-name').val(),
                edit_email: $('#edit-email').val(),
                edit_phone: $('#edit-phone').val(),
                edit_address: $('#edit-address').val(),
                edit_zip_code: $('#edit-zip-code').val(),
                edit_city: $('#edit-city').val(),
                edit_cv: $('#edit-cv').val(),
                edit_profile_picture: $('#edit-profile-picture').val()
            }
        })
            .done(function (response) {
                if (response.success) {
                    $.growl.notice({title: "Success", message: response.message});
                    window.setTimeout(function () {
                        window.location.href = "index.php";
                    }, 5000);
                } else {
                    $.growl.error({title: "Error", message: response.message});
                }
            })
    });
    $('#cancelUpdateAccount').click(function () {
        window.location.href = "index.php";
    });
    $('.date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        sideBySide: true
    });
});
