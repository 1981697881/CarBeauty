/**
 * 接口列表文件
 */
export default {
	/** 初始化 ↓ **/
	init: {
		url: 'index/init',
		auth: false,
		method: 'GET',
		// desc: '初始化数据',
	},
	storesForm: {
		url: 'store/storesForm',
		auth: false,
		method: 'GET',
		// desc: '获取门店',
	},
	posterList:{
		url: 'applet/api/posterList',
		auth: false,
		method: 'POST',
		// desc: '获取广告轮播',
	},
	menuList:{
		url: 'applet/api/menuList',
		auth: false,
		method: 'POST',
		// desc: '获取菜单',
	},
	/** 上传图片 ↓ **/
	upload: {
		url: 'index/upload',
		auth: true,
		method: 'POST',
		// desc: '上传',
	},

	/** 上传Base64图片 ↓ **/
	uploadBase64: {
		url: 'index/uploadBase64',
		auth: false,
		method: 'POST',
		// desc: '上传Base64位图片',
	},

	/** 消息订阅模板 ↓ **/
	messageIds: {
		url: 'notification/template',
		auth: true,
		method: 'GET',
		// desc: '订阅消息模板ids',
	},

	/** 模板信息 ↓ **/
	template: {
		url: 'index/template',
		auth: false,
		method: 'GET',
		// desc: '模板信息',
	},
	/** 自定义模板页面 ↓ **/
	custom: {
		url: 'index/custom',
		auth: false,
		method: 'GET',
		// desc: '自定义模板页面',
	},

	/** 直播 ↓ **/
	live: {
		url: 'live',
		auth: false,
		method: 'GET',
		// desc: '直播列表',
	},
	/** 微信Jssdk ↓ **/
	wechat: {
		jssdk: {
			url: 'wechat/jssdk',
			auth: false,
			method: 'POST',
			// desc: '微信Jssdk',
		},
	},
	/** 签到 ↓ **/
	user_sign: {
		index: {
			url: 'user_sign/index',
			auth: true,
			method: 'GET',
			// desc: '签到记录',
		},
		sign: {
			url: 'user_sign/sign',
			auth: true,
			method: 'POST',
			// desc: '签到',
		}
	},
	/** 开单 ↓ **/
	bill: {
		findOrdersByStatus: {
			url: 'orderCar/findOrdersByStatus',
			auth: true,
			method: 'POST',
			// desc: '订单列表',
		},addOrder: {
			url: 'orderCar/addOrder',
			auth: true,
			method: 'POST',
			// desc: '开单',
		},updateOrder: {
			url: 'orderCar/updateOrder',
			auth: true,
			method: 'POST',
			// desc: '结算',
		},employeeList: {
			url: 'applet/employeeList',
			auth: true,
			method: 'PUT',
			// desc: '职员列表',
		},projectForm: {
			url: 'projectCar/projectForm',
			auth: true,
			method: 'POST',
			// desc: '项目列表',
		},selectVipList: {
			url: 'vipCar/selectVipList',
			auth: true,
			method: 'POST',
			// desc: '会员卡列表',
		},licensePlateRecognition: {
			url: 'huaWei/licensePlateRecognition',
			auth: true,
			method: 'POST',
			// desc: '车牌识别',
		},increaseRecharge: {
			url: 'vipCar/increaseRecharge',
			auth: true,
			method: 'POST',
			// desc: '充值',
		},playList: {
			url: 'applet/api/playList',
			auth: true,
			method: 'POST',
			// desc: '精品套餐列表',
		},playMessage: {
			url: 'applet/api/playMessage',
			auth: true,
			method: 'POST',
			// desc: '精品套餐详情',
		},
	},
	/** 同步路由 ↓ **/
	dev: {
		asyncLink: {
			url: 'index/asyncLink',
			auth: false,
			method: 'POST',
			// desc: '路由表',
		},
		asyncDecorateScreenShot: {
			url: 'index/asyncDecorateScreenShot',
			auth: false,
			method: 'POST',
			// desc: '更新店铺装修截图',
		},
		asyncBannerBgColor: {
			url: 'index/asyncBannerBgColor',
			auth: false,
			method: 'POST',
			// desc: '路由表',
		},
		debug: {
			url: 'index/debugLog',
			auth: false,
			method: 'POST',
		}
	},

	/** 富文本  ↓ **/
	richtext: {
		url: 'index/richtext',
		auth: false,
		method: 'GET',
		// desc: '富文本数据',
	},

	/** 三级分类 ↓ **/
	category: {
		url: 'category',
		auth: false,
		method: 'GET',
		// desc: '三级分类',
	},
	/** 二级分类 ↓ **/
	categoryGoods: {
		url: 'category/goods',
		auth: false,
		method: 'GET',
		// desc: '点餐用',
	},

	/** 积分商城 ↓ **/
	score: {
		list: {
			url: 'score_goods_sku_price/index',
			auth: false,
			method: 'GET',
			// desc: '积分商品列表',
		},
		detail: {
			url: 'score_goods_sku_price/detail',
			auth: false,
			method: 'GET',
			// desc: '积分详情',
		},
	},

	/** 票夹 ↓ **/
	wallet:{
		lists: {
			url: 'memberTicket/userTicketForm',
			auth: true,
			method: 'POST',
			// desc: '票劵列表',
		},
		detail: {
			url: 'FH/getTicketInfo',
			auth: true,
			method: 'POST',
			// desc: '票劵详情',
		},
	},
	/** 用户 ↓ **/
	user: {
		info: {
			url: 'user',
			auth: true,
			method: 'GET',
			// desc: '用户信息',
		},isUseJurisdiction: {
			url: 'applet/isUseJurisdiction',
			auth: true,
			method: 'POST',
			// desc: '用户权限',
		},getMiniAuth: {
			url: 'V8/getMiniAuth',
			auth: true,
			method: 'GET',
			// desc: '获取智科公众号id',
		},getCustomerList: {
			url: 'V8/getCustomerList',
			auth: true,
			method: 'POST',
			// desc: '获取智科公众号id',
		},balance: {
			url: 'V8/Balance',
			auth: true,
			method: 'POST',
			// desc: '用户余额',
		},balance2: {
			url: 'V8/Balance2',
			auth: true,
			method: 'POST',
			// desc: '用户余额',
		},memberBindSimple: {
			url: 'V8/memberBindSimple',
			auth: true,
			method: 'POST',
			// desc: '用户绑卡',
		},createMember: {
			url: 'V8/createMember',
			auth: true,
			method: 'POST',
			// desc: '成为会员',
		},deduction: {
			url: 'V8/Deduction',
			auth: true,
			method: 'POST',
			// desc: '用户余额操作',
		},
		getCustPayQrCode: {
			url: 'V8/getCustPayQrCode',
			auth: true,
			method: 'POST',
			// desc: '用户二维码（v8）',
		},
		recharge: {
			url: 'V8/Recharge',
			auth: true,
			method: 'POST',
			// desc: 'v8用户充值',
		},payRecharge: {
			url: 'WeChat/payRechargeMoney',
			auth: true,
			method: 'POST',
			// desc: '用户充值生成预付订单',
		},
		member: {
			url: 'member/loginMember',
			auth: true,
			method: 'POST',
			// desc: '用户信息',
		},
		transactionLogDorRList: {
			url: 'transactionLog/transactionLogDorRList',
			auth: true,
			method: 'POST',
			// desc: '用户钱包账单列表',
		},

		profile: {
			url: 'user/profile',
			auth: true,
			method: 'POST',
			// desc: '修改用户信息',
		},

		changemobile: {
			url: 'user/changemobile',
			auth: true,
			method: 'POST',
			// desc: '修改手机号',
		},

		changepwd: {
			url: 'user/changepwd',
			auth: true,
			method: 'POST',
			// desc: '修改密码',
		},

		resetpwd: {
			url: 'user/resetpwd',
			auth: false,
			method: 'POST',
			// desc: '重置密码',
		},

		mobileLogin: {
			url: 'user/mobileLogin',
			auth: false,
			method: 'POST',
			// desc: '手机验证码登录',
		},

		accountLogin: {
			url: 'user/accountLogin',
			auth: false,
			method: 'POST',
			// desc: '账号密码登录',
		},

		getWxMiniProgramSessionKey: {
			url: 'weChat/memberAuthorize',
			auth: false,
			method: 'POST',
			// desc: '获取用户session_key',
		},
		getWxMiniPhoneNumber: {
			url: 'phone/phoneNumber',
			auth: false,
			method: 'POST',
			// desc: '获取用户手机号码',
		},

		wxMiniProgramLogin: {
			url: 'weChat/memberLogin',
			auth: false,
			method: 'POST',
			// desc: '微信小程序登录',
		},

		wxOpenPlatformLogin: {
			url: 'user/wxOpenPlatformLogin',
			auth: false,
			method: 'POST',
			// desc: '微信APP登录',
		},

		register: {
			url: 'user/register',
			auth: false,
			method: 'POST',
			// desc: '用户注册',
		},
		forgot: {
			url: 'user/forgot',
			auth: false,
			method: 'POST',
			// desc: '忘记密码',
		},
		cdKeyList: {
			url: 'cdkey/cdKeyList',
			auth: true,
			method: 'POST',
			//desc: '团体票列表',
		},cdKeysList: {
			url: 'memberCdkey/CdKeys',
			auth: true,
			method: 'POST',
			//desc: '已购买团体票列表',
		},CdKeyDetails: {
			url: 'memberCdkeyDetail/CdKeyDetails',
			auth: true,
			method: 'POST',
			//desc: '团体票详情',
		},
		exchangeCdKey: {
			url: 'memberCdkeyDetail/exchangeCdKey',
			auth: true,
			method: 'POST',
			//desc: '团体票兑换',
		},
		payCdKeyMoney: {
			url: 'WeChat/payCdKeyMoney',
			auth: true,
			method: 'POST',
			//desc: '团体票购买',
		},
	},

	/** 分享 ↓ **/
	share: {
		add: {
			url: 'share/add',
			auth: false,
			method: 'POST',
			// desc: '添加分享记录',
		}
	},

	/** 位置 ↓ **/
	address: {
		area: {
			url: 'address/area',
			auth: false,
			method: 'GET',
			// desc: '省市区',
		},
		list: {
			url: 'address',
			auth: true,
			method: 'GET',
			// desc: '地址列表',
		},
		edit: {
			url: 'address/edit',
			auth: true,
			method: 'POST',
			// desc: '修改地址',
		},
		defaults: {
			url: 'address/defaults',
			auth: true,
			method: 'GET',
			// desc: '默认地址',
		},
		info: {
			url: 'address/info',
			auth: true,
			method: 'GET',
			// desc: '地址详情',
		},
		del: {
			url: 'address/del',
			auth: true,
			method: 'POST',
			// desc: '删除',
		},
	},

	/** 短信 ↓ **/
	sms: {
		send: {
			url: 'sms/send',
			auth: false,
			method: 'POST',
			// desc: '发送短信',
		},
	},

	/** 常见问题 ↓ **/
	faq: {
		list: {
			url: 'faq',
			auth: false,
			method: 'GET',
			// desc: '常见问题列表',
		},
		About: {
			url: 'app/api/About',
			auth: false,
			method: 'POST',
			// desc: '用户协议',
		},
	},

	/** 意见反馈 ↓ **/
	feedback: {
		type: {
			url: 'feedback/type',
			auth: true,
			method: 'GET',
			// desc: '意见反馈类型',
		},
		add: {
			url: 'feedback/add',
			auth: true,
			method: 'POST',
			// desc: '提交意见',
		},
	},


	/** 支付 ↓ **/
	pay: {
		prepay: {
			url: 'WeChat/payMoney',
			auth: true,
			method: 'POST',
			// desc: '发起支付',
		},
	},

	/** 提现 ↓ **/
	user_wallet_apply: {
		apply: {
			url: 'user_wallet_apply/apply',
			auth: true,
			method: 'POST',
			// desc: '申请提现',
		},
		rule: {
			url: 'user_wallet_apply/rule',
			auth: true,
			method: 'GET',
			// desc: '体现规则',
		}

	},

	/** 钱包明细 ↓ **/
	user_wallet_log: {
		url: 'user_wallet_log',
		auth: true,
		method: 'GET',
		// desc: '钱包明细',
	},

	/** 银行卡 ↓ **/
	user_bank: {
		info: {
			url: 'user_bank/info',
			auth: true,
			method: 'GET',
			// desc: '银行卡信息',
		},
		edit: {
			url: 'user_bank/edit',
			auth: true,
			method: 'POST',
			// desc: '编辑银行卡信息',
		}
	},

	/** 评论 ↓ **/
	comment: {
		submit: {
			url: 'comment/submit',
			auth: true,
			method: 'POST',
			// desc: '提交评论',
		},
		list: {
			url: 'comment/list',
			auth: true,
			method: 'GET',
			// desc: '评论列表',
		}
	},

	/** 优惠券 ↓ **/
	coupons: {
		list: {
			url: 'memberCouponDetail/list',
			auth: true,
			method: 'POST',
			// desc: '个人中心优惠券列表',
		},
		couponIssueList: {
			url: 'couponIssue/couponIssueList',
			auth: true,
			method: 'POST',
			// desc: '个人中心可领取优惠券',
		},
		lists: {
			url: 'coupons/lists',
			auth: false,
			method: 'GET',
			// desc: '首页优惠券',
		},
		get: {
			url: 'memberCouponDetail/getCoupon',
			auth: true,
			method: 'POST',
			// desc: '领取',
		},
		detail: {
			url: 'coupons/detail',
			auth: true,
			method: 'GET',
			// desc: '购物券详情',
		},
		goods: {
			url: 'coupons/goods',
			auth: true,
			method: 'GET',
			// desc: '适用商品',
		}
	},


};
