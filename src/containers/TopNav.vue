<template>
  <nav class="navbar fixed-top">
    <div class="d-flex align-items-center navbar-left">
      <a
        v-if="isMain"
        href="#"
        class="menu-button d-none d-md-block"
        @click.prevent="
          changeSideMenuStatus({
            step: menuClickCount + 1,
            classNames: menuType
          })
        "
      >
        <menu-icon />
      </a>
      <a
        v-if="isMain"
        href="#"
        class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        @click.prevent="changeSideMenuForMobile(menuType)"
      >
        <mobile-menu-icon />
      </a>

      <router-link class="d-none d-xs-block ml-4" tag="a" to="/">
        <b-img
          class="d-none d-xs-block"
          :src="tenantInfo.tenant_logo"
          height="40px"
          alt="Responsive image"
        ></b-img>
      </router-link>
      <router-link class="ml-4" tag="a" to="/">
        <b-img
          class="d-block d-xs-none"
          :src="tenantInfo.tenant_logo"
          width="120px"
          alt="Responsive image"
        ></b-img>
      </router-link>
    </div>

    <div v-show="isMain" class="navbar-right">
      <div class="header-icons d-inline-block align-middle">
        <div class="position-relative d-none d-sm-inline-block ">
          <div class="btn-group">
            <b-button
              variant="empty"
              class="header-icon btn-sm"
              @click="toggleFullScreen"
            >
              <i
                :class="{
                  'd-inline-block': true,
                  'simple-icon-size-actual': fullScreen,
                  'simple-icon-size-fullscreen': !fullScreen
                }"
              />
            </b-button>
          </div>
        </div>
      </div>
      <div class="user d-inline-block">
        <b-dropdown
          class="dropdown-menu-right"
          right
          variant="empty"
          toggle-class="p-0"
          menu-class="mt-3"
          no-caret
        >
          <template slot="button-content">
            <!-- <span v-if="isPeak && currentUser.displayName" class="name mr-1">{{
              currentUser.displayName
            }}</span> -->
            <span class="name mr-1">{{
              currentUser.name || tenantInfo.tenant_admin_name
            }}</span>
            <span>
              <img :alt="currentUser.currentUser" src="/assets/img/pino.png" />
            </span>
          </template>
          <!-- <b-dropdown-item>Account</b-dropdown-item>
          <b-dropdown-item>Features</b-dropdown-item>
          <b-dropdown-item>History</b-dropdown-item>
          <b-dropdown-item>Support</b-dropdown-item>
          <b-dropdown-divider /> -->
          <b-dropdown-item @click="logout">Sign out</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { MenuIcon, MobileMenuIcon } from "@/components/Svg";

import notifications from "@/data/notifications";
import {
  searchPath,
  menuHiddenBreakpoint,
  localeOptions,
  buyUrl,
  defaultColor
} from "@/constants/config";
import { getDirection, setDirection } from "@/utils";
export default {
  components: {
    MenuIcon,
    MobileMenuIcon
  },
  data() {
    return {
      selectedParentMenu: "",
      searchKeyword: "",
      isMobileSearch: false,
      isSearchOver: false,
      fullScreen: false,
      menuHiddenBreakpoint,
      searchPath,
      localeOptions,
      buyUrl,
      notifications,
      isDarkActive: false
    };
  },
  methods: {
    ...mapMutations(["changeSideMenuStatus", "changeSideMenuForMobile"]),
    ...mapActions(["setLang", "signOut"]),
    search() {
      this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`);
      this.searchKeyword = "";
    },
    searchClick() {
      if (window.innerWidth < this.menuHiddenBreakpoint) {
        if (!this.isMobileSearch) {
          this.isMobileSearch = true;
        } else {
          this.search();
          this.isMobileSearch = false;
        }
      } else {
        this.search();
      }
    },
    handleDocumentforMobileSearch() {
      if (!this.isSearchOver) {
        this.isMobileSearch = false;
        this.searchKeyword = "";
      }
    },

    changeLocale(locale, direction) {
      const currentDirection = getDirection().direction;
      if (direction !== currentDirection) {
        setDirection(direction);
      }

      this.setLang(locale);
    },
    logout() {
      this.signOut().then(() => {
        this.$router.push("/user/login");
      });
    },

    toggleFullScreen() {
      const isInFullScreen = this.isInFullScreen();

      var docElm = document.documentElement;
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
      this.fullScreen = !isInFullScreen;
    },
    getThemeColor() {
      return localStorage.getItem("themeColor")
        ? localStorage.getItem("themeColor")
        : defaultColor;
    },
    isInFullScreen() {
      return (
        (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null)
      );
    }
  },
  computed: {
    isMain() {
      if (
        this.$route.path === "/terms" ||
        this.$route.path === "/plans" ||
        this.$route.path === "/cart"
      ) {
        return false;
      } else {
        return true;
      }
    },
    isPeak() {
      if (this.$store.getters.getHost === "peakfood.condivision.cloud") {
        return true;
      } else {
        return false;
      }
    },
    currentUser() {
      return this.$store.user.currentUser;
    },
    ...mapGetters({
      currentUser: "currentUser",
      menuType: "getMenuType",
      menuClickCount: "getMenuClickCount",
      tenantInfo: "getTenantInfo"
    })
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleDocumentforMobileSearch);
  },
  created() {
    const color = this.getThemeColor();
    this.isDarkActive = color.indexOf("dark") > -1;
  },
  watch: {
    "$i18n.locale"(to, from) {
      if (from !== to) {
        this.$router.go(this.$route.path);
      }
    },
    isDarkActive(val) {
      let color = this.getThemeColor();
      let isChange = false;
      if (val && color.indexOf("light") > -1) {
        isChange = true;
        color = color.replace("light", "dark");
      } else if (!val && color.indexOf("dark") > -1) {
        isChange = true;
        color = color.replace("dark", "light");
      }
      if (isChange) {
        localStorage.setItem("themeColor", color);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    },
    isMobileSearch(val) {
      if (val) {
        document.addEventListener("click", this.handleDocumentforMobileSearch);
      } else {
        document.removeEventListener(
          "click",
          this.handleDocumentforMobileSearch
        );
      }
    }
  }
};
</script>

<style>
.navbar .navbar-logo {
  width: fit-content;
  height: fit-content;
}
</style>
