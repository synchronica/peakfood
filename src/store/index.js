import Vue from "vue";
import Vuex from "vuex";
import { localHost } from "@/constants/config";
import { instance } from "@/axiosInstance";
import app from "../main";
import menu from "./modules/menu";
import user from "./modules/user";
import router from "@/router";
import axios from "axios";

// import chat from './modules/chat'
// import todo from './modules/todo'
// import survey from './modules/survey'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    modulesManager: {},
    loading: true,
    tenantInfo: {},
    error: false,
    moduleId: null,
    host: "",
    navigation: [],
    initIsLoad: false,
    preloader: false,
    selectedPlan: null,
    axios: null
  },
  getters: {
    getAxios: state => {
      return state.axios;
    },
    getModules: state => {
      return state.modulesManager;
    },
    getLoading: state => {
      return state.loading;
    },
    getTenantInfo: state => {
      return state.tenantInfo;
    },
    getError: state => {
      return state.error;
    },
    getModuleId: state => {
      return state.moduleId;
    },
    getHost: state => {
      return state.host;
    },
    getNavigation: state => {
      return state.navigation;
    },
    getInitIsLoad: state => {
      return state.initIsLoad;
    }
  },
  mutations: {
    setSelectedPlan(state, payload) {
      state.selectedPlan = payload;
    },
    changeLang(state, payload) {
      app.$i18n.locale = payload;
      localStorage.setItem("currentLanguage", payload);
    },
    SET_PRELOADER(state, payload) {
      state.preloader = payload;
    },
    SET_MODULES_MANAGER(state, payload) {
      state.modulesManager = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_TENANT_INFO(state, payload) {
      state.tenantInfo = payload;
      if (localStorage.getItem("themeColor") !== payload.tenant_default_theme) {
        // location.reload()
        localStorage.setItem("themeColor", payload.tenant_default_theme);
        console.log("set");
        location.reload();
      }
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
    SET_MODULE_ID(state, payload) {
      state.moduleId = payload;
    },
    SET_HOST(state, payload) {
      state.host = payload;
    },
    SET_NAVIGATION(state, payload) {
      state.navigation = payload;
    },
    SET_INIT_IS_LOAD(state, payload) {
      state.initIsLoad = payload;
    },
    SET_AXIOS(state) {
      const baseURL =
        location.hostname === "localhost"
          ? `https://${localHost}`
          : `${location.protocol}//${location.hostname}`;
      const token = localStorage.getItem("userToken");

      let headers = {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      };

      const instance = axios.create({
        baseURL,
        timeout: 10000,
        headers: headers
      });
      state.axios = instance;
    }
  },
  actions: {
    setModuleId({ commit }, id) {
      commit("SET_MODULE_ID", id);
    },
    setLang({ commit }, payload) {
      commit("changeLang", payload);
    },
    getModuleManager({ state, rootState, commit }, id) {
      const formData = new FormData();
      formData.set("id", id);
      rootState.axios
        .post("/api/ModuleManager", formData)
        .then(response => {
          console.log("moduleManagerResponse", response);
          const modulesManager = response.data.data[0];
          commit("SET_MODULES_MANAGER", modulesManager);
        })
        .catch(error => {
          console.error(error);
          commit("SET_ERROR", error);
        });
    },
    getNavigation({ commit, rootState }) {
      rootState.axios
        .post(
          "/api/GetNav",
          {},
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
          }
        )
        .then(response => {
          let data = response.data.data;
          commit("SET_NAVIGATION", data);
          commit("SET_INIT_IS_LOAD", true);
        })
        .catch(error => {
          console.error(error);
          commit("SET_ERROR", error);
        });
    },
    getInitialData({ dispatch, commit, rootState }) {
      const protocol =
        location.hostname === "localhost" ? "https:" : location.protocol;
      const host =
        location.hostname === "localhost" ? localHost : location.hostname;
      // const tenantInfoEndpoint = `${protocol}//${host}/api/TenantInfo`

      commit("SET_AXIOS");
      // console.log('rootState', rootState)

      rootState.axios
        .get("/api/TenantInfo")
        .then(response => {
          console.log("tenantInfoResponse: ", response);
          const tenantInfo = response.data.data;

          commit("SET_TENANT_INFO", tenantInfo);
          commit("SET_HOST", host);

          // console.log('rootState', rootState)
          if (rootState.user.currentUser) {
            dispatch("getNavigation");
          } else {
            console.log("r", router);
            if (router.history.current.path !== "/user/login") {
              router.push("/user/login");
            }
            commit("SET_INIT_IS_LOAD", true);
          }

          // dispatch('getNavigation', { protocol, host })
          let link =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
          link.type = "image/x-icon";
          link.rel = "shortcut icon";
          link.href = tenantInfo.tenant_icon;
          document.getElementsByTagName("head")[0].appendChild(link);
          document.title = tenantInfo.tenant_name;
        })
        .catch(error => {
          console.error(error);
          commit("SET_ERROR", error);
        });
    }
  },
  modules: {
    menu,
    user
  }
});
