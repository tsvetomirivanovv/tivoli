<?php
    session_start();
    $root = getenv('PWD');
    error_reporting(E_ALL);
    require $root . '/core/database/connect.php';
    require $root . '/core/functions/general.php';
    require $root . '/core/users.php';
    require $root . '/vendor/autoload.php';

    $current_file = explode('/', $_SERVER['SCRIPT_NAME']);
    $current_file = end($current_file);

    if (logged_in()){
        $session_user_id = $_SESSION['user_id'];
        change_online_status($session_user_id, 1);
        $user_data = user_data($session_user_id, 'user_id', 'username', 'password', 'first_name', 'last_name', 'email', 'phone', 'address', 'zip_code', 'city', 'cv', 'profile_picture', 'password_recover', 'type' , 'online_status');
        if (!user_active($user_data['username'])){
            session_destroy();
            header('location: index.php');
            exit();
        }
        if ($current_file !== 'change-password.php' && $current_file !== 'logout.php' && $user_data['password_recover'] == 1){
            header('Location: change-password.php');
            exit();
        }
    }
    $errors = '';
?>
