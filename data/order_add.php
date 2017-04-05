<?php
    /*接收客户端提交的订单信息，保存订单，生成订单号，输出执行结果，以JSON格式*/
    header('Content-Type:application/json');
    //接收客户端提交的数据
    @$user_name=$_REQUEST['user_name'];  //接收人姓名
    @$sex=$_REQUEST['sex'];  //性别
    @$phone=$_REQUEST['phone'];  //联系电话
    @$addr=$_REQUEST['addr'];  //收货地址
    @$did=$_REQUEST['did'];  //菜品编号
    @$order_time=time()*1000; //以毫秒为单位的当前系统时间
    //客户端输入的服务器端校验—真正可靠的校验！
    if(!isset($user_name)||!isset($sex)||!isset($phone)||!isset($addr)||!isset($did)){
        $output=[];
        $output["status"]="err";
        $output["msg"]="客户端提交的请求数据不足！";
        echo json_encode($output);
        return;
    }
    //执行数据库操作
    $conn=mysqli_connect('127.0.0.1','root','','kaifanla',3306);
    $sql="SET NAMES UTF8";
    mysqli_query($conn,$sql);
    $sql="INSERT INTO kf_order(oid,user_name,sex,phone,addr,did,order_time) VALUES(NULL,'$user_name','$sex','$phone','$addr','$did','$order_time')";
    $result=mysqli_query($conn,$sql);
    $output=[];
    if($result){  //SQL执行成功
        $output['status']='succ';
        $output['oid']=mysqli_insert_id($conn); //获取最近的一条INSERT语句所生成的自增主键
    }else{  //SQL执行失败
        $output['status']='err';
        $output['msg']="数据库访问失败！SQL:$sql";
    }
    //向客户端返回输出响应消息主体
    $jsonString=json_encode($output);
    echo $jsonString;
?>