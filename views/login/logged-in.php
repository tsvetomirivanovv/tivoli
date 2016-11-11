<div class="col-xs-3">
    <h3>Hello, <?php echo $user_data['first_name']; ?>!</h3>
    <ul>
        <li>
            <a href="/logout.php">Log out</a>
        </li>
        <li>
            <a href="change-password.php">Change Password</a>
        </li>
        <li>
            <a href="edit-profile.php">Edit Profile</a>
        </li>
    </ul>

    <h3>Users</h3>
    <?php
        $user_count = user_count();
        $suffix = ($user_count != 1) ? 's' : '';
    ?>
    We currently have <?php echo user_count(); ?> registered user<?php echo $suffix; ?>.

</div>