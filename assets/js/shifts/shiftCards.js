$.ajax('core/functions/profile/permissions/is-manager.php', {
    type: 'POST',
    dataType: 'json',
})
    .done(function (response1) {
        var USER_ID  = document.getElementById("my_shifts_id").getAttribute("data-value");
        sessionStorage.setItem("user_id",USER_ID);
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
                            "                       <strong><a class='a_link_tivoli_location' href='#'>Tivoli Hotel &amp; Congress Center</a> <br> <span class='beginDate'>" + parseTimestamp(shiftData['begin']) + "</span></strong>" +
                            "                   </div>" +
                            "                   <div class='mat_small mat_booked participants_count'> " + shiftData['participants'] + " out of <span class='maxPart'>" + shiftData['max_participants'] + "</span> participants  </div>" +
                            "                       <div class='progress_bar_margin'>" +
                            "                           <div class='progress'>" +
                            "                               <div class='progress-bar " + progress_bar_color + "' style='width: " + shiftData['participants_perc'] + "%;'></div>" +
                            "                           </div>" +
                            "                       </div>" +
                            "                       <span class='mat_small mat_booked closing_date col-xs-10'>Closing date: <span class='closeDate'>" + parseTimestamp(shiftData['close']) + "</span></span>" +
                            "                           <div class='mat_event_infoline duty_manager col-xs-8'>" +
                            "                               <span class='mat_small'>" +
                            "                               <span>Duty manager: <span class='dutyMngr'>" + shiftData['duty_manager'] + "</span> - </span>Category: <span class='category'>" + shiftData['category'] + "</span> </span>" +
                            "                           </div>";

                        if (!response1.success) {
                            shifts += "                   </div>" +
                                "               </div>" +
                                "                   <div style='clear:both'></div>" +
                                "       </div>" +
                                "   </div>" +
                                "</li>";
                        } else {
                            shifts +="                     <div class='buttonsWrapper'> " +
                                "                       <a class='edit_shift_glyphicon openUpdateShift' data-toggle='modal' data-target='#updateShift'>" +
                                "                           <div class='glyphicon glyphicon-edit'></div>" +
                                "                       </a>" +
                                cancelBtn +
                                "                    </div>   " +
                                "                   </div>" +
                                "               </div>" +
                                "                   <div style='clear:both'></div>" +
                                "       </div>" +
                                "   </div>" +
                                "</li>";
                        }
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
                    fetchMyShifts(USER_ID);
                } else {
                    console.error('Shifts unsuccessfully fetched');
                }
            });
    });

// FETCH MY SHIFTS
function fetchMyShifts(userid) {
    $.ajax({

        type: "POST",
        url: 'core/functions/shifts/myShifts.php',
        data:{
            user_id: userid
        },
        dataType: "json"  //expect json to be returned
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
                    shifts += "<li style='list-style-type: none' id='" + shiftData['shift_id'] + "'>" +
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
                        "               <h4 class='h4_shift_link'><a class='a_link_title_color' href='#' id='" + shiftData['shift_id'] + "'>" + shiftData['title'] + "</a></h4>" +
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
                        "                       <a class='cancel_my_shift cancel_shift_glyphicon' data-toggle='modal' data-target='#cancelBookingModal'  href='#' id='" + shiftData['shift_id'] + "'>" +
                        "                           <div class='glyphicon glyphicon-remove-circle'></div>" +
                        "                       </a>" +
                        "                   </div>" +
                        "               </div>" +
                        "                   <div style='clear:both'></div>" +
                        "       </div>" +
                        "   </div>" +
                        "</li>";
                });
                $("#myShiftContainer").append(shifts);
                
            } else {
                console.error('Shifts unsuccessfully fetched');
            }
        });
}
$(document).on('click', '.cancel_my_shift', function () {
    myShiftId = $(this).attr('id');
});


// ON CLICK CANCEL BUTTON SEND AJAX REMOVE BOOKING
$(document).on('click', '#cancelBookingButton', function (e) {

    $.ajax('core/functions/shifts/cancel-user-booking.php', {
        type: 'POST',
        dataType: 'json',
        data: {
            user_id: sessionStorage.getItem("user_id"),
            shift_id: myShiftId
        }
    })
        .done(function (response) {
            if (response.success) {
                $('li').filter("[id=" + myShiftId + "]").remove();
                $.growl.notice({title: "Success", message: response.message});
            } else {
                $.growl.error({title: "Error", message: response.message});
            }
        })
});

