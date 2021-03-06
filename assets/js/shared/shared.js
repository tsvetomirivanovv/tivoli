$('[data-toggle="tooltip"]').tooltip();

$(document).on('click', '.date', function(e) {
    $('.date').datetimepicker({
        format: 'YYYY-MM-DD HH:mm',
        sideBySide: true
    });
});

// Global vars
var selectedShiftToCancel = 0;
var selectedShiftToUpdate = 0;
var storageAccountId = 0;
var approveTable = '';
var participantsTable = '';
var accountId = 0;
var myShiftId = 0;
var userID = 0;

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

function parseTimestampParticipants(date) {
    var now = new Date(date);
    var h = now.getHours();
    var m = now.getMinutes();

    return timeLeadingZeros(now.getDate()) + "-" + timeLeadingZeros(now.getMonth()+1) +"-" + now.getFullYear() + ", " + timeLeadingZeros(now.getHours()) + ":" + timeLeadingZeros(now.getMinutes());
}

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
