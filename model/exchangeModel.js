function exchangeModel() {
	this.code = "";//物料名称
	this.TotalAmount = 0;//物料总数
	this.goods = [];//物料个数
	this.codeid = "";//物料ID
	this.id = "";//物料货架
	//首次新增物料
	this.setMaterial = function(data) {
			this.code = data.code;//物料名称赋值
			this.TotalAmount = data.count;//物料总数
			this.goods.push(data.count)//物料个数
			this.codeid = data.codeid;//物料ID
	};
	//物料相加
	this.addGoods = function(number) {
        this.goods.push(number);//物料个数
		this.TotalAmount = this.TotalAmount + number; //总数相加
	}
	this.setInlibrary=function(name){
		this.id=name.id;
	}
		this.modifierNumber = function(index,number){
		this.TotalAmount =this.TotalAmount+ (parseInt(number)-this.goods[index]) ;//物料总数
		this.goods[index]=parseInt(number);
	}
}

	
const exchangeModels = new exchangeModel();
export default exchangeModels;