/**
 * @description 不规则接口返回json转化为对象
 */
export const parseForRule = (data) => {
	debugger;
	console.log("入参：" + data)
	try {
		return eval('(' + data + ')')
	} catch (e) {
		try {
			console.log("parse转化前：" + JSON.stringify(data))
			return JSON.parse(data)
		} catch (e) {
			console.log("json 转化为js 错误：" + JSON.stringify(e))
			return null;
		}
	}
}

/**
 * @description 判断是否为空对象
 */
export const isEmptyObject =(data) => {
	var result=true;//默认是空对象
	try{
		for (var i in data) {
			result=false;
		}
	}catch(e){
		console.log("isEmptyObject异常："+JSON.stringify(e))
		result=true;
	}
	console.log("isEmptyObject结果："+result)
	return result;
}


/**
 * @description 库位码转换函数
 */
export const parseWarehouseCode = (code) => {
	console.log(code);
	var result = null;
	if(code&&code.indexOf(":")!=-1){
		return result;
	}
	try {
		var arr = code.replace("{", "").replace("}", "").split(",");
		if (arr.length <= 4) {
			result = {};
			result["id"] = arr[0].replace("'", "").replace("'", "");
			result["code"]= arr[1].replace("'", "").replace("'", "");
			result["codeid"]= arr[2].replace("'", "").replace("'", "");
		} else {}
	} catch (e) {
		result = null;
	}
	return result;
}



/**
 * @description 检测是否授权，如果没有授权，跳转到登录界面
 */
export const authAccount = (hasLogin, forcedLogin, userName) => {
	if (!hasLogin) {
		uni.showModal({
			title: '未登录',
			content: '您未登录，需要登录后才能继续',
			showCancel: false,
			success: res => {
				if (res.confirm) {
					// 如果需要强制登录，使用reLaunch方式
					if (forcedLogin) {
						uni.reLaunch({
							url: '../login/login'
						});
					} else {
						uni.navigateTo({
							url: '../login/login'
						});
					}
				}
			}
		});
	}
}


/**
 * @传入当前登陆用户
 */
export const addUserParam = (data,userName,password,userID) =>{
	console.log("addUserParam.data:"+JSON.stringify(data));
	console.log("addUserParam.userName:"+userName);
	console.log("addUserParam.password:"+password);
	console.log("addUserParam.userID:"+userID);
	var result=false;//默认不是是对象
	try{
		if((typeof data=='string')&&data.constructor==String){
			result=false;
		}
		else{
			result=true;
		}
	}catch(e){
		result=false;
	}
	console.log("data是否是对象："+result)
	if(result){
		data.UserName=userName;
		data.Password=password;
		data.UserID=userID;
	}
	else{
		data=data+"&UserName="+userName;
		data=data+"&Password="+password;
		data=data+"&UserID="+userID;
	}
	console.log("addUserParam结束后的出参："+JSON.stringify(data));
	return data;
}