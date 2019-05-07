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
 *换货入库模型对象
 *物料数据：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 *库位数据：{id:'K',code:'A2-6层-06',codeid:'1934'}
 */
const exchangeOutlibraryModel = {
	id: "", //物料ID
	code: "", //物料code
	codeid: "", //物料codeid
	totalAmount: 0, //总货物
	goods: [], //物料入库货物
	storage: null,
	//重置函数
	reset: function() {
		this.id = "";
		this.code = "";
		this.codeid = "";
		this.totalAmount = 0;
		this.goods = [];
		this.storage = null;
	},
	//设置物料信息
	setMateriaInfo: function(data) {
		if (!data || !data.id || data.id == "") {
			return false;
		}
		try {
			this.id = data.id;
			this.code = data.code;
			this.codeid = data.codeid;
			this.totalAmount = this.totalAmount + data.count;
			this.goods.push(data.count);
			return true;

		} catch (e) {
			return false;
		}

	},
	//物料入库
	addStorage: function(data) {
		if (!data || !data.id || data.id == "") {
			return false;
		}
		try {
			this.storage = new storageModel();
			this.storage.id = data.id;
			this.storage.code = data.code;
			this.storage.codeid = data.codeid;
			return true;
		} catch (e) {
			return false;
		}

	},
	//修改数量
	modifierNumber: function(index, number) {
		console.log("当前索引："+index);
		console.log("当前数字："+number);
		try{
			var adds=(number - this.goods[index]);
			console.log("相加的值："+adds);
			this.totalAmount =this.totalAmount+adds; //物料总数
		    this.goods[index] = number;
            console.log("改变值后的totalAmount："+this.totalAmount)
		}catch(e){
			console.log("异常："+JSON.stringify(e));
		}
		console.log("新的值："+this.goods[index]);
	},
	//生成提交入库model
	generateModel() {
		var model = new Object();
		model.MNumber = this.code;
		model.Quan = this.totalAmount;
		model.LocalID = this.storage.codeid;
		return model;
	}
}
//导出对象
export default exchangeOutlibraryModel;
