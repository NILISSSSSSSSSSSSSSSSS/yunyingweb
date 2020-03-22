var root = process.env.VUE_APP_URL;//基础接口
var root_sso = process.env.VUE_APP_SSO_URL;//用户
var root_oss = process.env.VUE_APP_OSS_URL;//阿里云
var websocket_url = process.env.VUE_APP_WS_URL;

export default {
	esSearch:'https://es5.hbbclub.com/haobbchk/asks/_search',//es问题查询
	esWordSearch:'https://es5.hbbclub.com/haobbchk/_analyze',//es分词查询
	shops: root + '/srv/shop/shops',
	loginByPwd: root_sso + '/user/idpasswd/login',//帐号密码登录
	changePwd: root_sso + '/user/idpasswd/changepasswd',//修改密码
	getUserRoles: root_sso + '/user/me',//用户读取自己的信息（包含登录信息和角色信息）
	getAllRoles: root_sso + '/role/roles',//获取所有角色
	ossUpload: root_oss + '/oss/upload',//阿里云小文件上传
	getMerchant: root + '/yyapi/dianzhu/dianzhus',//店主列表
	addMerchant: root + '/yyapi/dianzhu/dianzhu',//新增店主
	editMerchant: root + '/yyapi/dianzhu/dianzhu/',//编辑店主
	changeMerchantStu: root + '/yyapi/dianzhu/usestatus/',//停启用店主 :id/:usestatus
	// checkWxInfo: root + '/yyapi/dianzhu/regstatus/',//服务号审核 :id/:regstatus
	setWxInfoKey: root + '/yyapi/dianzhu/wxinfo/',//提交微信，服务号相关key
	getMiniProgramById: root + '/yyapi/dianzhu/wxinfo/',//根据申请资料id更新小程序申请资料
	getWxInfoBydz: root + '/yyapi/dianzhu/reginfo/',//根据店主id 获取服务号，小程序申请资料
	addWxInfo: root + '/yyapi/dianzhu/service',//提交服务号申请资料
	setWxInfo: root + '/yyapi/dianzhu/service/',//更新服务号申请资料
	setMiniProgram: root + '/yyapi/dianzhu/program',//小程序资料提交

	getDefaultShop: root + '/yyapi/dianzhu/default',//获取默认门店
	getShops: root + '/yyapi/dianzhu/dianpus',//店铺列表

	getGroup: root + '/yyapi/group/groups',//组列表
	addGroup: root + '/yyapi/group/group',//新增组
	editGroup: root + '/yyapi/group/group/',//新增组

	addSpecia: root + '/yyapi/doctor/doctor',//新增专家
	editSpecia: root + '/yyapi/doctor/doctor/',//编辑专家
	getSpecia: root + '/yyapi/doctor/doctors',//专家列表
	changeSpeciaStu: root + '/yyapi/doctor/status/',//停启用专家

	addCourse: root + '/yyapi/kejian/kejian',//新增课件信息
	editCourse: root + '/yyapi/kejian/kejian/',//put编辑课件 get获取课件详情
	courseItem: root + '/yyapi/kejian/item/',//新增或更新课件内容:id
	getCourse: root + '/yyapi/kejian/kejians',//课件列表
	changeCourseStu: root + '/yyapi/kejian/status/',//停启用课件 :id/:status

	addDaYi: root + '/yyapi/dayi/dayi',//新增答疑
	editDaYi: root + '/yyapi/dayi/dayi/',//put编辑答疑 get获取答疑详情 :id
	getDaYi: root + '/yyapi/dayi/dayis',//答疑列表
	changeDaYiStu: root + '/yyapi/dayi/status/',//停启用答疑 :id/:status
	useDaYi: root + '/yyapi/dayi/use/',//采纳答疑 :id


	kefu: root + '/yyapi/kefu/kefus',
	addKefu: root + '/yyapi/kefu/kefu',
	kefuGroup: root + '/yyapi/kefu/groups',
	editKefu: root + '/yyapi/kefu/kefu/',
	statusKefu: root + '/yyapi/kefu/status/',
	editKefuGroup: root + '/yyapi/kefu/group/',
	deleteKefuGroup: root + '/yyapi/kefu/group/',
	addKefuGroup: root + '/yyapi/kefu/group',
	byIdedietKefu: root + '/yyapi/kecheng/kefus/',
	defaultDianpu: root + '/yyapi/dianzhu/default',

	addVerbalTrick: root + '/yyapi/huashu/huashu',//新增话术
	editVerbalTrick: root + '/yyapi/huashu/huashu/',//put编辑话术 get获取话术详情 :id
	getVerbalTrick: root + '/yyapi/huashu/huashus',//话术列表
	changeVBTStu: root + '/yyapi/huashu/status/',//停启用话术 :id/:status

	createHuibo: root + '/yyapi/kecheng/huibo',
	editHuibo: root + '/yyapi/kecheng/huibo/',
	editHuiboKefu: root + '/yyapi/kecheng/kefus/',
	huiBoDetail: root + '/yyapi/kecheng/detail/', //查看回播
	createZhibo: root + '/yyapi/kecheng/zhibo',
	courseDetail: root + '/yyapi/kecheng/kecheng/', //课程详情
	collection: root + '/yyapi/dayi/dayi ', //收藏
	customerSerChat: root + '/yyapi/parsedmsg/kefu/msgs', //客服自己聊天记录
	imUserList: root + '/yyapi/parsedmsg/kefu/users', //im用户列表


	getClassList: root + '/yyapi/kecheng/kechengs',//课程列表 zb 直播课 | hb 回播课
	delClass: root + '/yyapi/kecheng/kecheng/',//删除课程:id
	changeClass: root + '/yyapi/kecheng/status/',//更改课程状态 :id/:status
	dzClass: root + '/yyapi/kecheng/dzkcs/',//店主的课程:id 店主id
	kcShops: root + '/yyapi/kecheng/dianpus/',//课程下的店铺:kechengId 课程id

	//我的所有接口
	getAccessToken: root + '/yyapi/wx/access_token',//获取 access_token
	addUserClient: root + '/yyapi/wx/kf/invite',//添加微信客户
	sendMsg: root + '/yyapi/wx/send_msg', //发送消息
	uploadFileImg: root + '/yyapi/wx/upload', //上传图片到微信服务器
	getUserList: root + '/yyapi/parsedmsg/xcx/users', //用户列表
	getMsgDetails: root + '/yyapi/parsedmsg/xcx/msgs', //消息详情
	getCustomerServiceList: root + '/yyapi/wx/kf/kflist', //获取客服列表
	deleteCustomerService: root + '/yyapi/wx/kf/del', //删除客服列表

	getBaseData: root + '/yyapi/data/base', //数据统计基本数据
	getLineData: root + '/yyapi/data/period', //数据统计走势图
	getShopTopData: root + '/yyapi/data/top/dianpu', //数据统计店铺top10
	getCourseTopData: root + '/yyapi/data/top/kejian', //数据统计课件top10
	// websocket
	wsSocketUrl: websocket_url,

	// 腾讯im
	newImUser: root + '/yyapi/tx/user', // 新建im用户
	getUserSign: root + '/yyapi/tx/sign', // 获取用户签名

	// 直播间
	broadcast: root + '/yyapi/zbj/huibo/msg/boardcast', // 发送广播消息
	replyMsg: root + '/yyapi/zbj/huibo/msg/reply', // 回复用户
	msgDetail: root + '/yyapi/parsedmsg/im/msg/' // 跟据消息id查询消息详情
	 
}
