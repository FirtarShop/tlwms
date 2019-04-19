/**
 *物料对象
 *案例：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 */
function pickingModel(option) {
	this.TlJpdID = '';
	this.OperBillNum = '';
	this.BillNum = '';
	this.MNumber = '';
	this.MName = '';
	this.OutPackage = '';
	this.LocalName = ''
	this.Qty = '';
	//初始化
	this.init = function(option) {
		this.TlJpdID = option.TlJpdID;
		this.OperBillNum = option.OperBillNum;
		this.BillNum = option.BillNum;
		this.MNumber = option.MNumber;
		this.MName = option.MName;
		this.OutPackage = option.OutPackage;
		this.LocalName = option.LocalName
		this.Qty = option.Qty;
	};
	if (option) {
		this.init(option)
	}
}
/**
 *紧急出库模型对象
 *物料数据：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 *车辆码数据：{id:'C',code:'浙G23408',codeid:'1',count:1}
 */
const outlibraryModel = {
	materials: [], //所有的物料
	vehicleCode: '', //车辆码
	//重置函数
	reset: function() {
		this.materials = [];
		this.vehicleCode = "";
	},
	setPackege: function(result) {
		this.addNewPicking(result);

	},
	//添加新物料
	addNewPicking: function(data) {
		this.materials.push(new pickingModel(data));
	},
	//设置拣货信息
	setMaterial: function(data) {
		var index = -1;
		for (var i = 0; i < this.materials.length; i++) {
			index = i;
			break;
		}
	},
	//设置车辆码
	setVehicleCode: function(codeid) {
		console.log('result' + JSON.stringify(codeid));
		this.vehicleCode = codeid;
	},
	//判断是否重复扫描拣货
	judgeCommonPackege: function(data) {
		console.log('judgeCommonPackege.data:' + data);
		var result = true;
		try {
			for (var i = 0; i < this.materials.length; i++) {
				if (this.materials[i].BillNum == data) {
					result = false;
					break;
				}
			}
		} catch (e) {
			result = true;
		}
		console.log("judgeCommonStorage结果：" + result)
		return result;
	},
	generateModel: function() {
		var model = new Object();
		model.BillNums = "";
		if (this.materials.length > 0) {
			for (let item of this.materials) {
				model.BillNums = model.BillNums + item.BillNum + "|";
			}
		}
		model.BillNums = model.BillNums.trim("").substr(0, model.BillNums.length - 1)
		model.VehiCodeID = this.vehicleCode;
		return model;
	}
}
//导出对象
export default outlibraryModel;
