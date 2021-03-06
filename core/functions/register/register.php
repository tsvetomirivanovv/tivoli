<?php
include '../../init.php';
    $errors = "";

    $passwordErr = "";
    $usernameErr = "";
    $cvErr = "";
    $imageErr = "";
    $emailErr = "";

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $conn = getConnection();
        // CHECK IF THERE IS ERROR
        if ($conn->connect_error) {
            die('Connection failed: ' . $conn->connect_error);
        }

        if (isset($_POST)) {
            //upload CV
            $cvFileOk = 1;

            //upload picture
            $pictureFileOk = 1;


            $username = $_POST['username'];
            $first_name = $_POST['firstname'];
            $last_name = $_POST['lastname'];
            $email = $_POST['email'];
            $password = $_POST['password'];
            $verifyPassword = $_POST['verifyPassword'];
            $phone = $_POST['phone'];
            $address = $_POST['address'];
            $zip = $_POST['zip'];
            $city = $_POST['city'];
            $cv = $_POST['upload_cv'];
            $picture = $_POST['upload_picture'];

            $active = 0;
            $conn = getConnection();
            $sql = "SELECT username FROM users WHERE username='$username'";
            $result = $conn->query($sql);

            $emailSql = "SELECT email FROM users WHERE email='$email'";
            $emailResult = $conn->query($emailSql);

            $connectionOk = 1;
            if ($password != $verifyPassword) {
                $passwordErr = "Passwords not the same";
                $connectionOk = 0;
            }
            if (strlen($password) >= 20 || strlen($password) <= 5) {
                $passwordErr = "Password should contain minimum 5 characters and maximum 15";
                $connectionOk = 0;
            }
            if ($result->num_rows > 0) {
                $usernameErr = "Name already used";
                $connectionOk = 0;
            }
            if ($emailResult->num_rows > 0) {
                $emailErr = "Email already used";
                $connectionOk = 0;
            }

            if ($connectionOk == 1) {
                if(strlen($picture)) {
                    $sql = "INSERT INTO users (username, password, first_name, last_name, email, phone, address, zip_code, city, cv, profile_picture, active) VALUES ('$username', '" . MD5($password) . "', '$first_name', '$last_name', '$email', '$phone', '$address', '$zip', '$city', '$cv', '$picture', $active)";
                } else {
                    $sql = "INSERT INTO users (username, password, first_name, last_name, email, phone, address, zip_code, city, cv, active) VALUES ('$username', '" . MD5($password) . "', '$first_name', '$last_name', '$email', '$phone', '$address', '$zip', '$city', '$cv', $active)";
                }
                $conn->query($sql);
            } else {
                function form_errors() {
                    $output = "";
                        $output .= "<div class=\"error\">";
                        $output .= "Account not created. Please fix the following errors";
                        $output .= "</div>";

                    return $output;

                }
                echo form_errors();
            }
        }
}

?>
