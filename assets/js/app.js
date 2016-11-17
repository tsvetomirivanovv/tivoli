// Global vars
var selectedShiftToCancel = 0;

function timeLeadingZeros(value) {
    if (value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

function parseTimestamp(date) {
    var now = new Date(date);
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var day = days[now.getDay()];
    var month = months[now.getMonth()];
    var h = now.getHours();
    var m = now.getMinutes();

    return day + ", " + now.getDate() + ". " + month + " " + now.getFullYear() + " - " + timeLeadingZeros(now.getHours()) + ":" + timeLeadingZeros(now.getMinutes());
}
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: 'core/functions/register/register.php',
            data: $('form').serialize(),
            success: function () {
                $.growl.notice({title: "Success", message: "Your account was successfully created!"});
                window.setTimeout(function () {
                    window.location.href = "index.php";
                }, 3000);
            },
            error: function (resp) {
                $.growl.error({title: "Failure", message: "Your account was not created!"});
                console.log($('#usernameErr').val());

                $("#registerForm").append($('#username').val());
            }
        });

    });
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
                    if (evenOdd % 2 == 1) {
                        bgStyle = 'mat_single_odd';
                    } else bgStyle = '';
                    evenOdd++;

                    // progress bar color
                    var progress_bar_color = 'progress-bar-success';
                    if (shiftData['participants_perc'] > 50 && shiftData['participants_perc'] <= 70) {
                        progress_bar_color = 'progress-bar-warning';
                    } else if (shiftData['participants_perc'] > 70) {
                        progress_bar_color = 'progress-bar-danger';
                    }

                    // check if shift is canceled
                    var status = "";
                    var cancelBtn = "";
                    if(parseInt(shiftData['canceled']) === 1) {
                        status = "<span class='canceledShift'>(Canceled)</span>";
                    } else {
                        cancelBtn = "                       <a class='cancel_shift_glyphicon cancel_shift' data-toggle='modal' data-target='#cancelShift'>" +
                                    "                           <div class='glyphicon glyphicon-remove-circle'></div>" +
                                    "                       </a>";
                    }

                    shifts += "<li style='list-style-type: none'>" +
                        "   <div class='mat_single_event_holder " + bgStyle + "'>" +
                        "       <div class='mat_single_event_holder_inner'>" +
                        "           <div class='mat_event_image'>" +
                        "               <div class='mat_event_image_inner'>" +
                        "                   <a title='" + shiftData['title'] + "' href='#'>" +
                        "                       <img src='https://cdn.filestackcontent.com/FzeNGjAET2KXi936O7Lt' border='0'>" +
                        "                   </a>" +
                        "               </div>" +
                        "           </div>" +
                        "       <div class='mat_event_content'>" +
                        "           <div class='mat_event_content_inner'>" +
                        "               <h4 class='h4_shift_link'><a class='a_link_title_color shiftId' href='fullShiftDetails.php' id='" + shiftData['shift_id'] + "'>" + shiftData['title'] + "</a>" + status + "</h4>" +
                        "                   <div class='mat_event_location'>" +
                        "                       <strong><a class='a_link_tivoli_location' href='#'>Tivoli Hotel &amp; Congress Center</a> <br> " + parseTimestamp(shiftData['begin']) + "</strong>" +
                        "                   </div>" +
                        "                   <div class='mat_small mat_booked participants_count'> " + shiftData['participants'] + " out of " + shiftData['max_participants'] + " participants  </div>" +
                        "                       <div class='progress_bar_margin'>" +
                        "                           <div class='progress'>" +
                        "                               <div class='progress-bar " + progress_bar_color + "' style='width: " + shiftData['participants_perc'] + "%;'></div>" +
                        "                           </div>" +
                        "                       </div>" +
                        "                       <span class='mat_small mat_booked closing_date col-xs-10'>Closing date: " + parseTimestamp(shiftData['close']) + "</span>" +
                        "                           <div class='mat_event_infoline duty_manager col-xs-8'>" +
                        "                               <span class='mat_small'>" +
                        "                               <span>Duty manager: " + shiftData['duty_manager'] + " - </span>Category: " + shiftData['category'] + " </span>" +
                        "                           </div>" +
                        "                       <a class='edit_shift_glyphicon' href='#'>" +
                        "                           <div class='glyphicon glyphicon-edit'></div>" +
                        "                       </a>" +
                                            cancelBtn +
                        "                   </div>" +
                        "               </div>" +
                        "                   <div style='clear:both'></div>" +
                        "       </div>" +
                        "   </div>" +
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
                console.error('Shifts unsuccessfully fetched');
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


    $('body').on('click', '.cancel_shift', function(e) {
        // Get parent element for the cancel button and find the closest element that has shift id.
        selectedShiftToCancel = parseInt(e.target.offsetParent.getElementsByClassName('shiftId')[0].getAttribute('id'));
    });

    $('body').on('click', '.cancelShiftButton', function(e) {
        console.info('To be canceled', selectedShiftToCancel);

        $.ajax({
            type: "POST",
            url: 'core/functions/shifts/cancelShift.php',
            dataType: "json",
            data: {
                shift_id: selectedShiftToCancel
            }
        })
        .done(function (response) {
            if (response.success) {
                var id = '#' + selectedShiftToCancel;
                // Add cancel label next to the title
                $(id).append("<span class='canceledShift'>(Canceled)</span>");
                // Remove 'Cancel' button
                $(id).parents('.mat_event_content')[0].getElementsByClassName('cancel_shift')[0].remove();
                console.info('Success');
            } else {
                $.growl.error({title: "Error", message: response.message});
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
        $.ajax('core/functions/profile/edit-profile.php', {
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
                edit_profile_picture: $('#edit-profile-picture').val(),
                edit_user_type: $('#edit-user-type').val()
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
    $.ajax({
        type: "POST",
        url: 'core/functions/profile/approve-accounts.php',
        dataType: "json",
    })
        .done(function (response) {
            if (response.success) {
                var approve_accounts = '';
                response.accounts.forEach(function (accountData) {
                    approve_accounts += '<tr id="' + accountData['user_id'] + '">' +
                        '   <th>' +
                        '       <div>' +
                        '           <span>' +
                        '               <a href="profile-page.php?username=' + accountData['username'] + '">' +
                        '                   <img class="avatarSize" src="' + accountData['profile_picture'] + '">' +
                        '               </a>' +
                        '           </span>' +
                        '       </div>' +
                        '   </th>' +
                        '   <td> ' + accountData['first_name'] + ' ' + accountData['last_name'] + '</td>' +
                        '   <td>' + accountData['email'] + '</td>' +
                        '   <td><span><a class="cvLink" href="' + accountData['cv'] + '" target="_blank">CV</a></span>' +
                        '       <div class="updateButtonPos"><a class="approve_button" type="button" data-toggle="modal" data-target="#approveUserModal" id="' + accountData['user_id'] + '"><span class="glyphicon glyphicon-ok" style="margin-right: 15px;"></span></a>' +
                        '       <div class="updateButtonPos"><a class="reject_button" type="button" data-toggle="modal" data-target="#rejectUserModal" id="' + accountData['user_id'] + '"><span class="glyphicon glyphicon-remove" style="margin-right: 15px;"></span></a>' +
                        '   </td>' +
                        '</tr>';
                });
                $("#tableBodyApprove").append(approve_accounts);

            } else {
                console.error('Accounts unsuccessfully fetched');
            }
            approveTable = $('#approveTable').DataTable();
        });

    $(document).on('click', '.approve_button', function () {
        storageAccountId = $(this).attr('id');
    });
    $(document).on('click', '.reject_button', function () {
        accountId = $(this).attr('id');
    });
    $('#approveButton').click(function () {
        $.ajax('core/functions/profile/approve.php', {
            type: 'POST',
            dataType: 'json',
            data: {
                account_id: storageAccountId
            }
        })
            .done(function (response) {
                if (response.success) {
                    var row = approveTable.row($('tr').filter("[id=" + storageAccountId + "]"));
                    row.remove().draw(false);
                    updateUserCount();
                    $.growl.notice({title: "Success", message: response.message});
                } else {
                    $.growl.error({title: "Error", message: response.message});
                }
            })
    });
    $('#rejectUserModal').click(function () {
        $.ajax('core/functions/profile/reject-user.php', {
            type: 'POST',
            dataType: 'json',
            data: {
                account_id: accountId
            }
        })
            .done(function (response) {
                if (response.success) {
                    var row = approveTable.row($('tr').filter("[id=" + accountId + "]"));
                    row.remove().draw(false);
                    updateUserCount();
                    $.growl.notice({title: "Success", message: response.message});

                } else {
                    $.growl.error({title: "Error", message: response.message});
                }
            })
    });
    // WHEN CLICK ON TITLE, SET SESSION STORAGE TITLE AND ID VAR
    $(document).on('click', '.a_link_title_color', function () {
        var titleID = $(this).attr('id');
        var titleName = $(this).text();
        sessionStorage.setItem("titleID", titleID);
        sessionStorage.setItem("titleName", titleName)
    });

    // VAR TO RETRIEVE SES. STORAGE ID
    var storageID = sessionStorage.getItem("titleID");

    $.ajax({
        type: "POST",
        url: 'core/functions/shifts/shiftDetails.php',
        dataType: "json",
        data: {
            shift_id_value: storageID
        }
    })
        .done(function (response) {
            if (response.success) {
                response.shifts.forEach(function (shiftData) {
                    shift_begin_id = shiftData['begin'];
                    shift_end_id = shiftData['end'];
                    shift_close_id = shiftData['close'];
                    shift_manager_id = shiftData['duty_manager'];
                    shift_category_id = shiftData['category'];
                    shift_participants_id = shiftData['max_participants'];
                });
                $("#shift_begin_id").append(shift_begin_id);
                $("#shift_end_id").append(shift_end_id);
                $("#shift_close_id").append(shift_close_id);
                $("#shift_organizer_id").append("Alex Petersen");
                $("#shift_manager_id").append(shift_manager_id);
                $("#shift_category_id").append(shift_category_id);
                $("#shift_participants_id").append(shift_participants_id);
            }
        });

    $('.titleClass').html(sessionStorage.getItem("titleName"));

    $.ajax({
        type: "POST",
        url: 'core/functions/users/view-all-accounts.php',
        dataType: "json",
    })
        .done(function (response) {
            if (response.success) {
                var accounts = '';
                var oddOrEven = 1;
                var oddOrEvenText = '';
                response.accounts.forEach(function (accountData) {
                    if (oddOrEven % 2 == 1) {
                        oddOrEvenText = 'odd';
                    } else {
                        oddOrEvenText = 'even';
                    }
                    accounts += '<tr role="row" class="' + oddOrEvenText + '">' +
                        '   <th class="sorting_1">' +
                        '       <div>' +
                        '           <span>' +
                        '               <a href="profile-page.php?username=' + accountData['username'] + '">' +
                        '                   <img class="avatarSize" src="' + accountData['profile_picture'] + '">' +
                        '               </a>' +
                        '           </span>' +
                        '       </div>' +
                        '   </th>' +
                        '   <td> ' + accountData['first_name'] + ' ' + accountData['last_name'] + '</td>' +
                        '   <td>' + accountData['email'] + '</td>' +
                        '   <td><span class="' + accountData['dotColor'] + '"><span class="' + accountData['dotClass'] + '"></span>' + accountData['isOnline'] + '</span>' +
                        '       <a href="edit-profile.php?username=' + accountData['username'] + '"><span class="glyphicon glyphicon-edit updateButtonPos"></span></a>' +
                        '   </td>' +
                        '</tr>';
                    oddOrEven++;
                });
                $("#tableBody").append(accounts);

            } else {
                console.error('Accounts unsuccessfully fetched');
            }
            $('#usersTable').DataTable();
        });
    $('.date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        sideBySide: true
    });

});

function getFileLink(url, elementId) {
    var inputId = '#' + elementId;
    var linkId = '#' + elementId + '-link';
    $(inputId).val(url);
    $(linkId).text(url);
}
function updateUserCount() {
    var x = Number($('#pendingUsers').text()) - 1;
    var suffix = '';
    if (x != 1) {
        suffix = 's';
    }
    $('#pendingUsers').text(x);
    $('#suffix_id').text(suffix);
}
