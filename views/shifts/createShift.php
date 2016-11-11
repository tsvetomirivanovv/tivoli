<?php
include 'manageShiftMenu.php';
?>

<form id="createShiftForm">

    <div class="form-group row">
        <label class="col-xs-2 text-center">Title:*</label>
        <div class="col-xs-3">
            <input  class="form-control" type="text" placeholder="200 characters" name="shiftTitle" required>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-xs-2 text-center">Begin date:*</label>
        <div class="col-xs-3">
            <div class='input-group date'>
                <input id="2" class="form-control" type="text" name="shiftBeginDate" required >
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-xs-2 text-center">End date:*</label>
        <div class="col-xs-3">
            <div class='input-group date'>
                <input  class="form-control" type="text" name="shiftEndDate" required >
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-xs-2 text-center">Closing booking date:*</label>
        <div class="col-xs-3">
            <div class='input-group date'>
                <input  class="form-control" type="text" name="shiftClosingDate" required >
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
            </div>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-xs-2 text-center">Duty manager:*</label>
        <div class="col-xs-3">
            <input  class="form-control" type="text" placeholder="Name of the manager" name="shiftDutyManager"  required >
        </div>
    </div>

    <div class="form-group row">
        <label class="col-xs-2 text-center">Category:*</label>
        <div class="col-xs-3">
            <select  class="form-control" name="shiftCategory">
                <option>A-Waiter</option>
                <option>B-Waiter</option>
            </select>
        </div>
    </div>

    <div class="form-group row">
        <label class="col-xs-2 text-center">Maximum participants:*</label>
        <div class="col-xs-3">
            <input  class="form-control" type="number" minlength="1" maxlength="3" max="100" placeholder="1-100" name="shiftParticipants"  required >
        </div>
    </div>

    <div>
        <div class="col-xs-3 text-center">
            <input id="submitButton" class="btn btn-default btn-wide " type="submit" name="submit" value="Create">
        </div>
    </div>

</form>
