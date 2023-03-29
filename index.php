<?php

// Server name must be localhost
$servername = "sql12.freesqldatabase.com";

// In my case, user name will be root
$username = "sql12609634";

// Password is empty
$password = "detUUKSwu8";

// Creating a connection
$con = mysqli_connect($servername,$username,$password,$username);
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  exit();
}
?>
