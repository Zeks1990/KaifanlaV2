angular.module('kaifanla',['ng','ngTouch']).controller('parentCtrl',function($scope){
  $scope.jump=function(url,trans){
    if(!trans){
      trans='slide';
    }
    //不能使用ng提供的跳转，必须使用jQM的跳转方案
    $.mobile.changePage(url,{transition:trans});

    //监听jQM新page beforeshow事件（已挂载到DOM树）—使用AngularJS
    angular.element('body').on('pagebeforeshow',function(event){
      //console.log('新的page被挂载到DOM树啦！');
      //console.log(event);
      //event.target就是刚被挂载进来的DOM片段
      //启用AngularJS的编译机制，编译一遍这个DOM片段
      var newPageScope=angular.element(event.target).scope();//获取新的代码片段
      angular.element(event.target).injector().invoke(function($compile){
        var fn=$compile(angular.element(event.target));
        fn(newPageScope);  //重新编译新的DOM片段，并链接入其所需要的模型数据
        newPageScope.$digest(); //启动$digest队列的轮询
      });
    });
  };
}).controller('startCtrl',function($scope){

}).controller('mainCtrl',function($scope,$http){
  //page初始化时从服务器端获取数据
  //$.mobile.loading('show');
  $scope.hasMore=true;
  $http.get('../data/dish_listbypage.php').success(function(data){
    console.log(data);
    $scope.dishList=data;
  });
  $scope.loadMore=function(){
    $http.get('../data/dish_listbypage.php?start='+$scope.dishList.length).success(function(data){
      if(data.length<5){
        $scope.hasMore=false;
      }
      //if($scope.dishList.length>200){$scope.dishList.shift(...)}
      $scope.dishList=$scope.dishList.concat(data);
    });
  }
  //监听model数据kw的改变
  $scope.$watch('kw',function(to,from){
    if(!to){
      return;
    }
    $http.get('../data/dish_listbykw.php?kw='+to).success(function(data){
      $scope.dishList=[];  //服务器反馈了查询结果，则清除之前的所有数据
      if(data.length==0){
        $scope.hasMore=false;
        return;
      }
      $scope.hasMore=true;
      $scope.dishList=data;
    });
  });
}).controller('detailCtrl',function($scope,parseSearch,$http){
  //读取上一个页面传递的did
  //console.log($location.search());  //不能注入$location服务—它会修改地址栏中的URL
  //console.log($.mobile.path.parseLocation());
  //console.log(window.location);
  //console.log($.mobile.path.parseUrl(window.location.search));
  var did=parseSearch(location.search).did;
  //根据上一个页面提交的菜品编号，查询菜品信息
  $http.get('../data/dish_listbydid.php?did='+did).success(function (data){
    $scope.dish=data;
  });
}).controller('orderCtrl',function($scope,parseSearch,$http){
  $scope.order={};
  $scope.order.did=parseSearch(location.search).did;
  $scope.$watch('sex',function(){
    console.log('ff'+$scope.sex);
  })
}).controller('myorderCtrl',function($scope){

}).service('parseSearch',function(){
  /*讲一个形如'?did=2&pno=3&uname=tom&loc=bj'转换为一个对象*/
  return function(search){ //可以在所有的Controller中使用的一个函数—Service
    var result={};
    search=search.substring(1);
    var arr=search.split('&');  //['did=3',
    angular.forEach(arr,function(v,k){
      var kv= v.split('=');
      result[kv[0]]=kv[1];
    });
    return result;
  }
});