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
	//设置物料信息
	// 	this.addGoods = function(data) {
	// 		this.totalAmount = this.totalAmount + parseInt(data.count);
	// 		this.goods.push(parseInt(data.count));
	// 	};
	if (option) {
		this.init(option)
	}
}
const zhongtaiModel = {
	materials: [], //所有的拣货码
	BillNum: '',
	reset: function() {
		this.materials = [];
		this.BillNum = '';
	},
	picking: function(result) {
		this.addNewPicking(result);
		this.BillNum = result.BillNum;
	},
	addNewPicking: function(data) {
		this.materials.push(new pickingModel(data));
	},
	//修改数量
	modifierNumber: function(index, number) {
		console.log("当前索引："+index);
		console.log("当前数字："+number);
		try{
		    this.materials[index].Qty= number;
		}catch(e){
			console.log("异常："+JSON.stringify(e));
		}
	},
	//生成提交入库model
	generateModel() {
		var model = new Object();
		console.log("BillNum:" + this.BillNum)
		model.BillNum = this.BillNum;
		model.ShQty = this.materials[0].Qty;
		return model;
	}
}
export default zhongtaiModel;
