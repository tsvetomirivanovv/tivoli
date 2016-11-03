<?php
include 'core/init.php';
if (empty($_POST) === false) {
    $username = $_POST['login-name'];
    $password = $_POST['login-pass'];

    if (empty($username) === true) {
        $errors[] = 'You need to enter a username';
    } else if (empty($password) === true) {
        $errors[] = 'You need to enter a password';
    } else if (user_exists($username) === false) {
        $errors[] = 'Username not found';
    } else if (user_active($username) === false) {
        $errors[] = 'You haven\'t activated your account';
    } else {
        if (strlen($password) > 32) {
            $errors[] = 'Password is too long';
        }
        $login = login($username, $password);
        if ($login === false) {
            $errors[] = 'That username/password combination is incorrect';
        } else {
            $_SESSION['user_id'] = $login;
            header('location: index.php');
            exit();
        }
    }
} else {
    $errors[] = 'No data received';
}

include 'views/shared/index-header.php';


if (empty($errors) === false) {
?>
    <button onclick="api_type('danger', '<?php echo output_errors($errors) ?>')">Notify</button>
<?php
}
include 'views/shared/index-footer.php';
?>