/**
 *拣货单模型对象
 *案例：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 */
// "{TlJpdID:'5',OperBillNum:'MDB2019217-3',BillNum:'PGC2019221-16795',MNumber:'1001040002-B12',MName:'后悬置支架总成',OutPackage:'12',Qty:'24'}",
function pickModel(option) {
	debugger;
	this.TlJpdID = "";
	this.OperBillNum = "";
	this.BillNum = "";
	this.MNumber = "";
	this.MName = "";
	this.OutPackage = "";
	this.Qty = "";
	this.init = function(option) { //构造一个函数实例
		debugger;
		if (option.TlJpdID || option.TlJpdID != "") {
			this.TlJpdID = option.TlJpdID;
		}
		if (option.OperBillNum || option.OperBillNum != "") {
			this.OperBillNum = option.OperBillNum;
		}
		if (option.BillNum || option.BillNum != "") {
			this.BillNum = option.BillNum;
		}
		if (option.MNumber || option.MNumber != "") {
			this.MNumber = option.MNumber;
		}
		if (option.MName || option.MName != "") {
			this.MName = option.MName;
		}
		if (option.OutPackage || option.OutPackage != "") {
			this.OutPackage = option.OutPackage;
		}
		if (option.Qty || option.Qty != "") {
			this.Qty = option.Qty;
		}
		this.amount = 0;
	}
    if(option){
		this.init(option);
	}
}
/**
 *货架模型对象
 *案例：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 */
function materialModel(option) {
	debugger;
	this.id = "";
	this.code = "";
	this.codeid = '';
	this.addStorage = [];
	this.amount = 0;
	this.init = function(option) { //构造一个函数实例
		if (option.id || option.id != "") {
			this.id = option.id;
		}
		if (option.code || option.code != "") {
			this.code = option.code;
		}
		if (option.codeid || option.codeid != "") {
			this.codeid = option.codeid;
		}
		this.amount = 0;
	}
	if(option){
		this.init(option);
	}
}

/**
 *物料入库模型对象
 *案例：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 */
function pickMaterialModel(option) {
	this.pickModel = new pickModel(option);
	this.materialModel = new materialModel();
	this.finishPick = false; //是否拣货完成
	//增加拣货单
	this.addPick = function(material) { //？？
		debugger;
		let addStorage = new materialModel(option);
		storage.amount = material.count;
		this.pickModel = new pickModel(option);
		return {
			"success": true,
			"message": "新增成功"
		}
	}
	//增加拣货
	this.addStorage = function(storage) {
		this.addStorage.id = storage.id;
		this.addStorage.code = storage.code;
		this.addStorage.codeid = storage.codeid;
	}
}

const outlibraryModel = {
	material: pickModel,
	addStorage: materialModel,
	pickMaterial: pickMaterialModel,
	pickMaterialModels: [],
	waitOutlibraryPick: {
		code: 36,
		index: 0
	}, //当前等待入库的物料
	//新增物料入库模型对象
	addNew: function(data) {
		debugger;
		this.pickMaterialModels.push(new this.pickMaterial(data));
		this.waitOutlibraryPick = {
			code: data.code,
			index: this.pickMaterialModels.length - 1
		}
	},
	//叠
	addPick: function(index, data) {
		this.pickMaterialModels[index].addPick(data)
		this.waitOutlibraryPick = {
			code: data.code,
			index: index
		}
	},
	// 入库
	addStorage: function(data) {
		console.log('123' + this.pickMaterialModels.length);
		console.log('123' + this.waitOutlibraryPick.index);
		this.pickMaterialModels[this.waitOutlibraryPick.index].addStorage(data); //
		this.waitOutlibraryPick = null;
	}
};
//到处对象
export default outlibraryModel;
