import Vue from 'vue'
import Vuex from 'vuex'
import {getUserInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
	userInfo: {
		avatar: 'default.jpg'
	},
}

const mutations = {
    saveUserInfo(state, userInfo){
		state.userInfo = userInfo;
	},
    deleteUserInfo(state) {
        state.userInfo = {}
    }
}

const actions = {
	setUserInfo({commit, data}) {
	    commit('saveUserInfo', data)
    },
    deleteUserInfo({commit}) {
	    commit('deleteUserInfo')
    }
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})
