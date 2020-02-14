<template>
<b-row>
  <b-colxx>
    <b-row>
      <b-colxx xxs="12">
        <h1 v-if="isLoad" v-html="module.module_name" />
        <!-- <h1>{{ $t('menu.data-list') }}</h1> -->
        <div class="top-right-button-container">
          <b-button
            @click="openModal('createmodal')"
            variant="primary"
            size="lg"
            class="top-right-button"
          >{{ $t('pages.add-new') }}</b-button>
          <b-button-group>
            <b-dropdown split right @click="selectAll(true)" class="check-button" variant="primary">
              <label
                class="custom-control custom-checkbox pl-4 mb-0 d-inline-block"
                slot="button-content"
              >
                <input
                  class="custom-control-input"
                  type="checkbox"
                  :checked="isSelectedAll"
                  v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}"
                  @shortkey="keymap"
                >
                <span
                  :class="{
                'custom-control-label' :true,
                'indeterminate' : isAnyItemSelected
              }"
                />
              </label>
              <!-- <b-dropdown-item @click="multipleDeletes">{{$t('pages.delete')}}</b-dropdown-item> -->
            </b-dropdown>
          </b-button-group>
        </div>

        <piaf-breadcrumb v-if="isLoad"/>
        <div class="mb-2 mt-2">
          <b-button
            variant="empty"
            class="pt-0 pl-0 d-inline-block d-md-none"
            v-b-toggle.displayOptions
          >
            {{ $t('pages.display-options') }}
            <i class="simple-icon-arrow-down align-middle"/>
          </b-button>
          <b-collapse id="displayOptions" class="d-md-block">
            <div class="d-block d-md-inline-block mb-2">
              <span v-if="this.displayModeOptions.length > 0" class="mr-1 mb-2 d-inline-block float-md-left">
                <template v-for="option in displayModeOptions">
                  <a
                    :class="{'mr-2 view-icon':true,'active': displayMode===option}"
                    @click="changeDisplayMode(option)"
                    :key="option"
                  >
                    <component v-bind:is="(option === 'list' ? 'data': option) + '-list-icon'"/>
                  </a>
                </template>
              </span>
              <div class="search-sm d-inline-block float-md-left mr-1 align-top mb-2">
                <b-input :placeholder="$t('menu.search')" v-model.lazy="search"/>
              </div>

              <b-dropdown
                id="ddown1"
                :text="`${$t('pages.orderby')} ${sort.label}`"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(order,index) in sortOptions"
                  :key="index"
                  @click="changeOrderBy(order)"
                >{{ order.label }}</b-dropdown-item>
              </b-dropdown>

              <b-dropdown
                id="ddown2"
                :text="`${ascValue}`"
                variant="outline-dark"
                class="mr-1 float-md-left btn-group"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(asc,index) in ascOptions"
                  :key="index"
                  @click="changeAsc(asc)"
                >{{ asc }}</b-dropdown-item>
              </b-dropdown>

              <div class="d-inline-block float-md-left mr-1 align-top">
                <b-button
                  v-b-modal.filtermodal
                  variant="outline"
                  class="btn-outline-dark btn-xs pr-2">
                  <span>Filtri</span>
                  <i class="iconsminds-filter-2"/>
                </b-button>
              </div>

              <div class="d-inline-block d-md-none">
                <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
                <b-dropdown
                  id="ddown2"
                  right
                  :text="`${perPage}`"
                  variant="outline-dark"
                  class="d-inline-block"
                  size="xs">
                  <b-dropdown-item
                    v-for="(size,index) in pageSizes"
                    :key="index"
                    @click="changePageSize(size)"
                  >{{ size }}</b-dropdown-item>
                </b-dropdown>
              </div>

            </div>
            <div class="float-md-right d-none d-md-block">
              <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
              <b-dropdown
                id="ddown2"
                right
                :text="`${perPage}`"
                variant="outline-dark"
                class="d-inline-block"
                size="xs"
              >
                <b-dropdown-item
                  v-for="(size,index) in pageSizes"
                  :key="index"
                  @click="changePageSize(size)"
                >{{ size }}</b-dropdown-item>
              </b-dropdown>
            </div>
          </b-collapse>
        </div>
        <div class="separator mb-5"/>
      </b-colxx>
    </b-row>
    <template v-if="isLoad">
      <b-row v-if="displayMode === 'list'" key="list">
        <b-row v-if="items.length < 1" class="justify-content-center w-100">
          <h2>Nessun elemento trovato</h2>
        </b-row>
        <b-colxx xxs="12" class="mb-3" v-for="(item, index) in items" :key="index" :id="item.id">
          <users-list-item
            :index="index"
            :key="item.id"
            :data="item"
            :columns="Number(module.columns)"
            :options="selectOptions"
            :fields="fieldsFilter"
            :selected-items="selectedItems"
            :actions="actions"
            @toggle-item="toggleItem"
            @modify-item="openModifyModal"
            @copy-item="copyItem"
            @delete-item="deleteItem"/>
        </b-colxx>
      </b-row>
      <b-row v-if="lastPage > 1">
        <b-colxx xxs="12">
          <b-pagination-nav
            :number-of-pages="lastPage"
            :link-gen="linkGen"
            v-model="page"
            :per-page="perPage"
            align="center">
            <template v-slot:next-text>
              <i class="simple-icon-arrow-right"/>
            </template>
            <template v-slot:prev-text>
              <i class="simple-icon-arrow-left"/>
            </template>
            <template v-slot:first-text>
              <i class="simple-icon-control-start"/>
            </template>
            <template v-slot:last-text>
              <i class="simple-icon-control-end"/>
            </template>
          </b-pagination-nav>
        </b-colxx>
      </b-row>
    </template>
    <template v-else-if="isLoad === false">
      <div class="loading"></div>
    </template>
    <template v-else-if="items.length < 1">
      <b-container class="d-flex h-100 flex-column justify-content-center align-items-center">
        <i style="font-size: 40px;" class="simple-icon-close text-muted"/>
        <h1 class="text-muted">Nessun elemento trovato</h1>
      </b-container>
    </template>
  </b-colxx>

  <!-- START MODALS -->
  <filter-modal
    :item='filterForm'
    :fields='fieldsManager'
    :selectOptions="selectOptions"
    @handle-submit="onFilter"
    @hide-modal="hideModal" />
  <create-modal
    :item='newItem'
    :fields='fieldsManager'
    :tabs="tabs"
    :selectOptions="selectOptions"
    @create-submit="addNewItem"
    @hide-modal="hideModal" />
  <modify-modal
    :item='modifiedItem'
    :fields='fieldsManager'
    :tabs="tabs"
    :selectOptions="selectOptions"
    @modify-submit="updateItem"
    @hide-modal="hideModal" />
  <!-- END MODALS -->
  </b-row>
</template>
<script>
import { DataListIcon, ThumbListIcon, ImageListIcon } from '@/components/Svg'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { listMixin } from '@/mixins/listMixin'

import UsersListItem from '@/components/Listing/UsersListItem'

import Switches from 'vue-switches'
import InputTag from '@/components/Form/InputTag'
import { instance } from '@/axiosInstance'

export default {
  props: ['parent'],
  mixins: [listMixin],
  components: {
    DataListIcon,
    ThumbListIcon,
    ImageListIcon,
    vSelect,
    UsersListItem,
    Switches,
    InputTag,
    ModifyModal: () => import('@/components/Modals/ModifyModal'),
    CreateModal: () => import('@/components/Modals/CreateModal'),
    FilterModal: () => import('@/components/Modals/FilterModal')
  },
  data () {
    return {
      moduleId: null,
      modifyModalShow: false,
      dibaId: null,
      dibaItem: null,
      ascValue: 'DESC',
      ascOptions: ['ASC', 'DESC'],
      fieldsManager: [],
      dataProvider: [],
      isLoad: false,
      displayMode: 'list',
      displayModeOptions: [],
      sort: { column: 'id', label: 'ID' },
      page: 1,
      perPage: 20,
      search: '',
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      pageSizes: [20, 40, 80],
      selectedItems: [],
      actions: [],
      newItem: {},
      deleteLink: null,
      selectOptions: [],
      filterForm: {},
      plans: []
    }
  },
  computed: {
    host () {
      return this.$store.getters.getHost
    },
    isSelectedAll () {
      return this.selectedItems.length >= this.items.length
    },
    isAnyItemSelected () {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      )
    }
  },
  methods: {
    async getPlans () {
      this.isBusy = true

      try {
        const response = await instance.post('/api/GetPlans')
        console.log('getPlansResponse', response)
        if (response.data.data) {
          this.items = response.data.data
        }
        this.isBusy = false
      } catch (error) {
        const type = 'error filled'
        const title = "C'è stato un problema"
        const message = error.message
        this.$notify(type, title, message, {
          duration: 3000,
          permanent: false
        })

        this.isBusy = false
      }

      // try {
      //   const response = await axios.get(
      //     `https://${host}/v3.0/?get_plans&token=1`
      //   )
      //   console.log('plans', response)
      //   if (response.data.data) {
      //     this.items = response.data.data
      //   }
      //   this.isBusy = false
      // } catch (error) {
      //   const type = 'error filled'
      //   const title = "C'è stato un problema"
      //   const message = error.message
      //   this.$notify(type, title, message, {
      //     duration: 3000,
      //     permanent: false
      //   })

      //   this.isBusy = false
      // }
      // this.isBusy = false
    },
    keymap (event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.selectedItems = []
          break
      }
    },
    getIndex (value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i
        }
      }
      return -1
    },
    toggleItem (event, itemId) {
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.items
        var start = this.getIndex(itemId, itemsForToggle, 'id')
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          'id'
        )
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        )
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
            return item.id
          })
        )
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId)
        } else this.selectedItems.push(itemId)
      }
    }
  },
  created () {
    this.getPlans()
  }
}
</script>

<style>
.filter-btn {
  padding: .25em .5em !important;
  color: white !important;
  border: none !important;
}

.modify-modal {
  padding: 0 !important;
}

.loading {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0,0,0,.2 );
  border-radius: 50%;
  border-top-color: rgba(0,0,0,.4 );
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
  left: calc(50%);
  top: calc(50%);
  position: fixed;
  z-index: 1;
}
</style>
