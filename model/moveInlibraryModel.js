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
 *紧急入库模型对象
 *物料数据：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 *库位数据：{id:'K',code:'A2-6层-06',codeid:'1934'}
 */
const inlibraryModel = {
	id: "", //物料ID
	code: "", //物料code
	codeid: "", //物料codeid
	totalAmount: 0, //总货物
	storage: null,
	inStorage: null,
	//重置函数
	reset:function(){
		this.id="";
		this.code="";
		this.codeid="";
		this.totalAmount=0;
		this.storage=null;
		this.inStorage= null;
	},
	//设置物料信息
	setMateriaInfo: function(data,flag) {
		console.log("setMateriaInfo入参："+JSON.stringify(data))
		try {
			if(flag){
				this.id = data.id;
				this.code = data.code;
				this.codeid = data.codeid;
				this.totalAmount = this.totalAmount + data.count;
				return true;	
			}
			else{
				this.id = "null";
				this.code = data.MNumber;
				this.codeid = data.MName;
				this.totalAmount = this.totalAmount + data.EndQuan;
				return true;
			}
		} catch (e) {
			return false;
		}

	},
		//判断是否重复扫描统一库位
	judgeCommonStorage: function(data) {
		var result = false;
		try {
			for (var i = 0; i < this.BzBarCodes.length; i++) {
				if (this.BzBarCodes[i] == data.BzBarCode) {
					result = false;
					break; 
				}
			}
		} catch (e) {
			result=true;
		}
		console.log("judgeCommonStorage结果："+result)
		return result;
	},
	//物料出库
	addStorage: function(data) {
		console.log("addStorage:入参:"+JSON.stringify(data))
		if (!data || !data.id || data.id == "") {
			return false;
		}
		try {
			this.storage = new storageModel();
			this.storage.id = data.id;
			this.storage.code = data.code;
			console.log("data:"+data.codeid)
			this.storage.codeid = data.codeid;
			return true;
		} catch (e) {
			return false;
		}
	},
	//物料入库
	addStorages: function(data) {
		if (!data || !data.id || data.id == "") {
			return false;
		}
		try {
			this.inStorage = new storageModel();
			this.inStorage.id = data.id;
			this.inStorage.code = data.code;
			this.inStorage.codeid = data.codeid;
			return true;
		} catch (e) {
			return false;
		}
	
	},
	//生成提交入库model
	generateModel() {
		var model = new Object();
		model.MNumber = this.code;
		model.MoveQuan = this.totalAmount;
		model.OutLocalID = this.storage.codeid;
		model.InLocalID = this.inStorage.codeid;
		return model;
	}
};
//导出对象
export default inlibraryModel;
