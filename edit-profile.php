<?php
include 'core/init.php';
protect_page();
include 'views/shared/header.php';
?>

    <!-- CONTENT -->
    <div class="container">
        <div class="row">
            <?php
            include 'views/login/edit-profile.php';
            include 'views/login/logged-in.php';
            ?>
        </div>
    </div>

<?php include 'views/shared/footer.php'; ?>