import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: true,
        hasLogin: false,
        userName: "",
		password:"",
		userID:""
    },
    mutations: {
        login(state,user) {
			debugger;
			console.log("login.user:"+JSON.stringify(user))
            state.hasLogin = true;
			state.userName = user.userName || '新用户';
			state.password=user.password;
			state.userID=user.userID;
        },
        logout(state) {
            state.userName = "";
			state.password = "";
			state.userID="";
            state.hasLogin =false;
        }
    }
})

export default store
