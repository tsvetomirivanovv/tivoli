<!-- HEADER -->
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <nav class="navbar navbar-inverse navbar-embossed" role="navigation">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse"
                            data-target="#navbar-collapse-01">
                        <span class="sr-only">Toggle navigation</span>
                    </button>
                    <?php if (!logged_in()) { ?>
                        <a class="navbar-brand" href="index.php">Tivoli</a>
                    <?php } else { ?>
                        <a class="navbar-brand" href="shifts.php">Tivoli</a>
                    <?php } ?>
                </div>
                <div class="collapse navbar-collapse" id="navbar-collapse-01">
                    <ul class="nav navbar-nav navbar-right">
                        <?php if (!logged_in()) { ?>
                            <li><a href="index.php">Home</a></li>
                        <?php } else { ?>
                            <li><a href="shifts.php">Shifts</a></li>
                        <?php if (has_access($user_data['user_id'], 'Manager')) { ?>
                            <li><a href="manage.php">Manage</a></li>
                        <?php } ?>
                            <li><a href="view-all-accounts.php">Users</a></li>
                            <li><a href="profile-page.php?username=<?php echo $user_data['username']; ?>">Profile</a>
                            </li>
                            <li><a href="logout.php">Sign out</a></li>
                        <?php } ?>

                    </ul>
                </div>
            </nav>
        </div>
    </div>
</div>
