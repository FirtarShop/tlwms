/**
 *平面库出库模型对象
 *物料数据：{id:'W',code:'1001030001-B12',codeid:'1',count:12}
 */
const outlibraryModel = {
	id:"",//物料ID
	code:"",//物料code
	codeid:"",//物料codeid
	totalAmount:0,//总货物
	goods:[],//物料入库货物
	
	TlJpdID :"",//拣货码ID
	Status :"",//已出库/未出库
	OperBillNum :'',//需求单号
	BillNum : '',//拣货码条码内容
	MNumber :'',//当前拣货码物料编码
	MName :'',//当前拣货码物料名称
	LocalName :'',//当前出库库位
	LocalID :'',//库位ID
	OutPackage :'',//出库单包装数量
	Qty : '',//当前拣货码对应数量
	
	//重置函数
	reset:function(){
		this.id="";
		this.code="";
		this.codeid="";
		this.totalAmount=0;
		this.goods=[];
		
		this.TlJpdID="";
		this.Status="";
		this.OperBillNum="";
		this.BillNum="";
		this.MNumber="";
		this.MName="";
		this.LocalName="";
		this.LocalID="";
		this.OutPackage="";
		this.Qty="";
	},
	//设置物料信息
	setMateriaInfo: function(data) {
		if(!data||!data.id||data.id==""){
			return false;
		}
			try {
		this.id=data.id;
		this.code=data.code;
		this.codeid=data.codeid;
		this.totalAmount=this.totalAmount+data.count;
		this.goods.push(data.count);
			return true;
		
		} catch (e) {
			return false;
		}
	},
	//物料入库
	setPackege: function(data) {
		this.TlJpdID = data.TlJpdID;
		this.Status = data.Status;
		this.OperBillNum = data.OperBillNum;
		this.BillNum = data.BillNum;
		this.MNumber = data.MNumber;
		this.MName = data.MName;
		this.LocalName = data.LocalName;
		this.LocalID = data.LocalID;
		this.OutPackage = data.OutPackage;
		this.Qty = data.Qty;
	},
	//生成提交入库model
	generateModel(){
		var model=new Object();
		model.BillNum=this.BillNum;
		model.MNumber=this.code;
		return model;
	}
};
//导出对象
export default outlibraryModel;
