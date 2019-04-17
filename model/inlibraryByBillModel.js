/**
 *货架模型对象
 *案例：{'K':'A2-6层-06','1934','1'}
 */
function storageModel() {
	this.id = "";
	this.code = "";
	this.codeid = '';
}

/**
 *包装模型对象
 *案例：{BarCID:'484',BillNum:'ASN2019320-1',BzBarCode:'TMLSHZL2019320-484',MNumber:'1001030001-B12',MName:'后悬置总成',InPackage:'12',BzQty:'12',IsScan:'1'}
 */
function packageModel(option) {
	
	this.BzBarCode = ""; //对应ID号	
	this.BillNum = ""; //送货单
	this.BzBarCode = ""; //条码内容
	this.MNumber = ""; //当前物料编码
	this.MName = ""; //当前物料名称
	this.InPackage = ""; //入库单包装数量
	this.BzQty = ""; //当前包装数量
	this.IsScan = ""; //当前条码是否扫描标志 1标识已扫描，0标识未扫描
	this.init = function(option) {
		this.BzBarCode = option.BzBarCode; //对应ID号	
		this.BillNum = option.BillNum; //送货单
		this.BzBarCode = option.BzBarCode; //条码内容
		this.MNumber = option.MNumber; //当前物料编码
		this.MName = option.MName; //当前物料名称
		this.InPackage = option.InPackage; //入库单包装数量
		this.BzQty = option.BzQty; //当前包装数量
		this.IsScan = option.IsScan; //当前条码是否扫描标志 1标识已扫描，0标识未扫描
	}
	if (option) {
		this.init(option);
	}
}

/**
 *包装码入库模型对象
 *包装码数据：{BarCID:'484',BillNum:'ASN2019320-1',BzBarCode:'TMLSHZL2019320-484',MNumber:'1001030001-B12',MName:'后悬置总成',InPackage:'12',BzQty:'12',IsScan:'1'}
 *库位数据：{id:'K',code:'A2-6层-06',codeid:'1934'}
 */
const inlibraryModel = {
	BillNum: "", //送货单
	BzBarCodes: [], //所有条码
	MNumber: "", //当前物料编码
	MName: "", //当前物料名称
	totalAmount: 0, //总货物
	packages: [], //所有包装
	storage: null,
	//重置函数
	reset: function() {
		this.BillNum = "";
		this.BzBarCodes = [];
		this.MNumber = "";
		this.MName = "";
		this.totalAmount = 0;
		this.packages = [];
		this.storage = null;
	},
	//判断是否是相同的送货单和相同的物料
	judgePackege: function(data) {
		var result = false;
		if (this.BillNum == "") {
			result = true;
		} else {
			if (this.BillNum == data.BillNum && this.MNumber == data.MNumber) {
				result = true;
			} else {
				result = false;
			}
		}
		console.log("judgePackege:" + result)
		return result;
	},
	//判断是否重复扫描统一包装码
	judgeCommonPackege: function(data) {
		var result = false;
		try {
			for (var i = 0; i < this.BzBarCodes.length; i++) {
				if (this.BzBarCodes[i] == data.BzBarCode) {
					result = true;
					break; 
				}
			}
		} catch (e) {
			result=false;
		}
		console.log("judgeCommonPackege结果："+result)
		return result;
	},
	//设置物料信息
	addPackege: function(data) {
		if (!data || !data.BillNum || data.BillNum == "") {
			return false;
		}
		this.BillNum = data.BillNum;
		this.BzBarCodes.push(data.BzBarCode);
		this.MNumber = data.MNumber;
		this.MName = data.MName;
		this.totalAmount = this.totalAmount + parseInt(data.BzQty);
		this.packages.push(new packageModel(data));
		return true;
	},
		//修改数量
	modifierNumber: function(index, number) {
		console.log("当前索引："+index);
		console.log("当前数字："+number);
		try{
			var adds=(number - this.packages[index].BzQty);
			console.log("相加的值："+adds);
			this.totalAmount =this.totalAmount+adds; //物料总数
		    this.packages[index].BzQty = number;
	        console.log("改变值后的totalAmount："+this.totalAmount)
		}catch(e){
			console.log("异常："+JSON.stringify(e));
		}
		console.log("新的值："+this.packages[index].BzQty );
	},
	//物料入库
	addStorage: function(data) {
		if (!data || !data.id || data.id == "") {
			return false;
		}
		this.storage = new storageModel();
		this.storage.id = data.id;
		this.storage.code = data.code;
		this.storage.codeid = data.codeid;
		return true;
	},
	//生成提交入库model
	generateModel() {
		console.log("this:"+JSON.stringify(this));
		var tempBzBarCodes = "";
		var BzQtys="";
		var model = new Object();
		model.BillNum = this.BillNum;
		model.MNumber = this.MNumber;
		model.Quan = this.totalAmount;
		model.LocalID = this.storage.codeid;
		if (this.BzBarCodes.length > 0) {
			for (let item of this.BzBarCodes) {
				tempBzBarCodes = tempBzBarCodes + item + "|";
			}
			model.BzBarCodes = tempBzBarCodes.trim("").substr(0, tempBzBarCodes.length - 1);
		} else {
			model.BzBarCodes = "";
		}
		
		
		for (let item of this.packages) {
			BzQtys = BzQtys + item.BzQty + "|";
		}
		model.BzQtys = BzQtys.trim("").substr(0, BzQtys.length - 1);
		var result="";
		result="&BillNum="+model.BillNum+"&MNumber="+model.MNumber+"&Quan="+model.Quan+"&LocalID="+model.LocalID +"&BzBarCodes="+model.BzBarCodes+"&BzQtys="+model.BzQtys;
		return result;
	}
};
//导出对象
export default inlibraryModel;
