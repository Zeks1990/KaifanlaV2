<?php
    /*根据菜名编号，返回该菜品的详情，以JSON格式输出*/
    header('Content-Type:application/json');
    //接收客户端提交的数据
    @$did=$_REQUEST['did'];//待查询的菜品编号
    if(!isset($did)){
        echo '{}';
        return; //若客户端未提交did，则返回空的JSON对象
    }
    //执行数据库操作
    $conn=mysqli_connect('127.0.0.1','root','','kaifanla',3306);
    $sql="SET NAMES UTF8";
    mysqli_query($conn,$sql);
    $sql="SELECT did,name,price,material,img_lg,detail FROM kf_dish WHERE did=$did";
    $result=mysqli_query($conn,$sql);
    $row=mysqli_fetch_assoc($result); //根据编号查询，最多只能获得一条数据
    //向客户端返回输出响应消息主体
    $jsonString=json_encode($row);
    echo $jsonString;
?>