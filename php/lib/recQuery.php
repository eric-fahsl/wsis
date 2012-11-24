<?php 

include('esSearchHelper.php');

$results = search($_GET);

print json_encode($results);                                                                                                         

?>