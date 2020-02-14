<template>
<div
    class="sidebar"
    @mouseenter="isMenuOver=true"
    @mouseleave="isMenuOver=false"
    @touchstart="isMenuOver=true"
  >
    <div class="main-menu">
      <vue-perfect-scrollbar class="scroll" :settings="{ suppressScrollX: true, wheelPropagation: false }" >
        <ul class="list-unstyled">

          <!-- Single Menu -->
          <template v-for="link in navigation">
            <router-link
              v-if="link.name === 'Dashboard'"
              tag="li"
              :class="{ active : selectedParentMenu===toPascalCase(link.name)+'s' }"
              :to="`${link.path}`"
              @click.native="changeSelectedParentHasNoSubmenu(toPascalCase(link.name)+'s')"
              :key="'main-'+link.id">
              <a>
                <i :class="link.icon"/>
                <span>{{ link.name }}</span>
              </a>
            </router-link>

            <router-link
              v-else-if="link.name === 'Food Cost'"
              tag="li"
              :class="{ active : selectedParentMenu===toPascalCase(link.name) }"
              :to="`${link.path}/${link.module_id}`"
              @click.native="changeSelectedParentHasNoSubmenu(toPascalCase(link.name))"
              :key="'main-'+link.id">
              <a>
                <i :class="link.icon"/>
                <span>{{ link.name }}</span>
              </a>
            </router-link>

            <li
              v-else-if="link.nav_sub.length > 0"
              :class="{ active : selectedParentMenu === toPascalCase(link.name)}"
              :key="'main-'+link.id"
            >
              <a
                @click.prevent="openSubMenu($event, toPascalCase(link.name))"
                :href="`#${toPascalCase(link.name)}`"
              >
                <i :class="link.icon"/>
                <span>{{ link.name }}</span>
              </a>
            </li>

            <router-link
              v-else
              tag="li"
              :class="{ active : selectedParentMenu===toPascalCase(link.name) }"
              :to="`${link.path}${Number(link.module_id) !== 0 ? '/' + link.module_id : ''}`"
              @click.native="changeSelectedParentHasNoSubmenu(link.name)"
              :key="link.id">
              <a>
                <i :class="link.icon"/>
                <span>{{ link.name }}</span>
              </a>
            </router-link>

          </template>

        </ul>
      </vue-perfect-scrollbar>
    </div>

      <div class="sub-menu">
        <vue-perfect-scrollbar class="scroll" :settings="{ suppressScrollX: true, wheelPropagation: false }" >
          <template v-for="(link, index) in navigation">
            <ul
              class="list-unstyled"
              :data-link="toPascalCase(link.name)"
              :class="{'d-block':selectedParentMenu===toPascalCase(link.name)}"
              :key="'sub-'+index"
            >
              <router-link
                v-for="(subLink, index) in link.nav_sub"
                tag="li"
                :to="`${filterSubRoute(subLink.sub_route, link.path, link.module_id)}`"
                :key="'sub-item-'+index">
                <a>
                  <i class="iconsminds-arrow-inside"></i>
                  <span>{{ subLink.sub_name  === 'Categoria vendita' ? 'Classificazione' : subLink.sub_name }}</span>
                </a>
              </router-link>
            </ul>
          </template>
        </vue-perfect-scrollbar>
      </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { menuHiddenBreakpoint, subHiddenBreakpoint } from '@/constants/config'

export default {
  data () {
    return {
      selectedParentMenu: '',
      isMenuOver: false.moduleId,
      clickCounter: 0
    }
  },
  mounted () {
    this.selectMenu()
    window.addEventListener('resize', this.handleWindowResize)
    document.addEventListener('click', this.returnSelectedMenu)
    this.handleWindowResize()
  },
  beforeDestroy () {
    document.removeEventListener('click', this.returnSelectedMenu)
    window.removeEventListener('resize', this.handleWindowResize)
  },

  methods: {
    ...mapMutations(['changeSideMenuStatus', 'addMenuClassname', 'changeSelectedMenuHasSubItems', 'removeSideMenuSubs']),
    filterSubRoute (subRoute, path, moduleId) {
      if (subRoute.includes('Tutti')) {
        return path + '/' + moduleId
      } else if (subRoute) {
        return subRoute.replace('{path}', path).replace('{module_id}', moduleId)
      } else {
        return subRoute
      }
    },
    toPascalCase (str) {
      return str.toLowerCase().replace(/ /g, '-')
    },
    selectMenu () {
      const currentParentUrl = this.$route.path.split('/').filter(x => x !== '')[1]
      if (currentParentUrl !== undefined || currentParentUrl !== null) {
        this.selectedParentMenu = currentParentUrl.toLowerCase()
      } else {
        this.selectedParentMenu = 'dashboards'
      }
    },
    changeSelectedParentHasNoSubmenu (parentMenu) {
      this.selectedParentMenu = parentMenu
      this.changeSelectedMenuHasSubItems(false)
      this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
    },
    openSubMenu (e, selectedParent) {
      this.changeSelectedMenuHasSubItems(true)

      const currentClasses = this.menuType ? this.menuType.split(' ').filter(x => x !== '') : ''

      if (!currentClasses.includes('menu-mobile')) {
        if (this.menuClickCount === 3) {
          this.selectedParentMenu = selectedParent
          this.changeSideMenuStatus({ step: this.menuClickCount + 1, classNames: this.storeMenuType })
          return
        }
        if (
          currentClasses.includes('menu-sub-hidden') &&
            (this.menuClickCount === 2 || this.menuClickCount === 0)
        ) {
          this.changeSideMenuStatus({ step: 3, classNames: this.menuType })
        } else if (
          currentClasses.includes('menu-hidden') &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
        ) {
          this.changeSideMenuStatus({ step: 2, classNames: this.menuType })
        } else if (
          currentClasses.includes('menu-default') &&
            !currentClasses.includes('menu-sub-hidden') &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
        ) {
          this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
        }
      } else {
        if (this.storeMenuType.includes('sub-show-temporary')) {
          this.selectedParentMenu = selectedParent
          this.removeSideMenuSubs()
          return
        }
        this.addMenuClassname({ classname: 'sub-show-temporary', currentClasses: this.menuType })
      }
      this.selectedParentMenu = selectedParent
    },
    addEvents () {
      document.addEventListener('click', this.handleDocumentClick)
    },
    removeEvents () {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    returnSelectedMenu () {
      if (!this.isMenuOver) {
        this.selectMenu()
      }
    },
    handleDocumentClick (e) {
      if (!this.isMenuOver) {
        let cont = true
        e.path.map(p => {
          if (p.nodeName !== 'svg' && p.className !== undefined && p.className.indexOf('menu-button') > -1) {
            cont = false
          }
        })
        if (cont) {
          this.toggle()
        }
      }
    },
    toggle () {
      const currentClasses = this.menuType.split(' ').filter(x => x !== '')
      if (currentClasses.includes('menu-sub-hidden') && this.menuClickCount === 3) {
        this.changeSideMenuStatus({ step: 2, classNames: this.menuType })
      } else if (currentClasses.includes('menu-hidden') || currentClasses.includes('menu-mobile')) {
        this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
      }
    },
    // Resize
    handleWindowResize (event) {
      if (event && !event.isTrusted) {
        return
      }
      let nextClasses = this.getMenuClassesForResize(this.menuType)
      this.changeSideMenuStatus({ step: 0, classNames: nextClasses.join(' ') })
    },
    getMenuClassesForResize (classes) {
      let nextClasses = classes.split(' ').filter(x => x !== '')
      const windowWidth = window.innerWidth

      if (windowWidth < menuHiddenBreakpoint) {
        nextClasses.push('menu-mobile')
      } else if (windowWidth < subHiddenBreakpoint) {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          !nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses.push('menu-sub-hidden')
        }
      } else {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses = nextClasses.filter(x => x !== 'menu-sub-hidden')
        }
      }
      return nextClasses
    },
    // Change Default Menu Type
    changeDefaultMenuType (containerClassnames) {
      let nextClasses = this.getMenuClassesForResize(containerClassnames)
      this.changeSideMenuStatus({ step: 0, classNames: nextClasses.join(' ') })
    }
  },
  computed: {
    ...mapGetters({
      storeMenuType: 'getMenuType',
      menuClickCount: 'getMenuClickCount'
    }),
    isPeakFood () {
      if (location.hostname === 'localhost') {
        return true
      }
      if (location.hostname === 'peakfood.condivision.cloud') {
        return true
      } else {
        return false
      }
    },
    subNavs () {
      return this.navigation.filter(link => link.nav_sub.length > 0)
    },
    ...mapGetters({
      navigation: 'getNavigation',
      modules: 'getModules',
      menuType: 'getMenuType',
      menuClickCount: 'getMenuClickCount',
      selectedMenuHasSubItems: 'getSelectedMenuHasSubItems'
    })
  },
  watch: {
    menuType: function (val) {
      if (val.indexOf('show-temporary') > -1) {
        this.addEvents()
      } else {
        this.removeEvents()
      }
    },
    '$route' (to, from) {
      if (to.path !== from.path) {
        this.changeSideMenuStatus({ step: 0, classNames: this.menuType })
        this.selectMenu()
        window.scrollTo(0, top)
      }
    }
  }
}
</script>
