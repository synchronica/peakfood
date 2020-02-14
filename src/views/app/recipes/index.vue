<template>
<b-row>
  <b-colxx>
    <b-row>
      <b-colxx xxs="12">
        <h1 v-if="isLoad" v-html="module.module_name" />
        <div class="top-right-button-container">
          <!-- <b-button
          variant="primary"
          size="lg"
          class="top-right-button">AQUISICI RICETTA</b-button> -->
          <!-- <b-button
            @click="openModal('createmodal')"
            variant="primary"
            size="lg"
            class="top-right-button"
          >{{ $t('pages.add-new') }}</b-button> -->
          <!-- <b-button-group>
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
              <b-dropdown-item @click="multipleDeletes">{{$t('pages.delete')}}</b-dropdown-item>
            </b-dropdown>
          </b-button-group> -->
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
                id="ddown5"
                :text="`${filter}`"
                size="xs"
                variant="outline-dark"
                class="mr-1 mb-1">
                <b-dropdown-item
                  v-for="({ label, id }) in categoriaRicettaOptions"
                  @click="handleFilter(label)" :key="`sub-${id}`">{{ label }}</b-dropdown-item>
              </b-dropdown>

              <!-- <b-dropdown
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
                  class="btn-outline-dark btn-xs pr-2"
                >
                  <span>Filtri</span>
                  <i class="iconsminds-filter-2"/>
                </b-button>
              </div> -->

              <div class="d-inline-block d-md-none">
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
        <template v-else>
          <!-- <b-colxx  sm="6" lg="4" xl="3" class="mb-5" v-for="(item,index) in items"   :key="index"  :id="item.id"> -->
          <b-colxx
            sm="6"
            lg="4"
            xl="3"
            v-for="(item, index) in items"
            :id="item.id"
            class="mb-3"
            :key="index">
            <recipes-image-list-item
              :index="index"
              :key="item.id"
              :data="item"
              :columns="Number(module.columns)"
              :options="selectOptions"
              :fields="fieldsManager"
              :selected-items="selectedItems"
              :actions="actions"
              @ingredients-loading="ingredientsLoading = true"
              @ingredients-fetch="setIngredients"
              @handle-set-recipe="onSetRecipe"
              @toggle-item="toggleItem"
              @handle-favorite="handleFavorite"
              @modify-item="openModifyModal"
              @copy-item="copyItem"
              @open-diba-modal='openDiba'
              @delete-item="deleteItem" />
          </b-colxx>
        </template>
      </b-row>

      <b-row v-if="lastPage>1">
        <b-colxx xxs="12">
          <b-pagination-nav
            :number-of-pages="lastPage"
            :link-gen="linkGen"
            v-model="page"
            :per-page="perPage"
            align="center"
          >
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
    @hide-modal="hideModal"
  />

  <create-modal
    :item='newItem'
    :fields='fieldsManager'
    :tabs="tabs"
    :selectOptions="selectOptions"
    @create-submit="addNewItem"
    @hide-modal="hideModal"
  />
  <modify-modal
    :item='modifiedItem'
    :fields='fieldsManager'
    :tabs="tabs"
    :selectOptions="selectOptions"
    @modify-submit="updateItem"
    @hide-modal="hideModal"
  />
  <distinta-base-modal :id="dibaId" :item="dibaItem" @update-diba-field="insertUpdate"/>

  <b-modal
    :id="`set-recipe-modal`"
    :ref="`set-recipe-modal`"
    title="Acquisisci Ricetta"
    size="sm"
    footer-class="py-3 pr-3"
    class="ma-0 pa-0 pl-0 pr-0 text-center">
    <b-container>
      <b-row class="justify-content-center">
        <b-form @submit.prevent="onAcquistaRicetta">
          <p>Seleziona una categoria a cui associare la tua nuova ricetta</p>
          <b-form-group class="mt-2">
            <b-form-radio-group size="lg" stacked v-model="selectedCategory">
              <b-form-radio v-for="({ label, id }) in categories" :value="label" :key="`radio-${id}`">{{ label }}</b-form-radio>
            </b-form-radio-group>
          </b-form-group>
          <span v-if="validated === false" style="color: red" class="small">Devi scegliere una categoria</span>
          <button class="d-none" type="submit" ref="setRecipeSubmit"></button>
        </b-form>
      </b-row>
    </b-container>
    <template v-slot:modal-footer>
      <b-row>
        <b-container class="d-flex justify-content-center">
          <b-btn @click="onSubmitCategory" variant="primary">Procedi</b-btn>
        </b-container>
      </b-row>
    </template>
  </b-modal>
    <b-modal id="modal-1" title="Ingredienti" hide-footer>
      <p></p>
      <b-row v-if="ingredientsLoading">
        <b-col class="text-center">
          <b-spinner variant="primary"/>
        </b-col>
      </b-row>
      <b-row v-else-if="noIngredients && ingredientsLoading === false">
        <b-col class="text-center">
          <p>Nessun elemento trovato</p>
        </b-col>
      </b-row>
      <ul v-else>
        <li v-for="(ingredient, index) in ingredients" :key="index">{{ ingredient }}</li>
      </ul>
    </b-modal>
  <!-- END MODALS -->
  </b-row>
</template>
<script>
import { DataListIcon, ThumbListIcon, ImageListIcon } from '@/components/Svg'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import axios from 'axios'

import RecipesImageListItem from '@/components/Listing/RecipesImageListItem'
import { listMixin } from '@/mixins/listMixin'

import Switches from 'vue-switches'
import InputTag from '@/components/Form/InputTag'
import CreateModal from '@/components/Modals/CreateModal'
import ModifyModal from '@/components/Modals/ModifyModal'

import { instance } from '@/axiosInstance'

export default {
  props: ['parent'],
  mixins: [listMixin],
  components: {
    RecipesImageListItem,
    DataListIcon,
    ThumbListIcon,
    ImageListIcon,
    vSelect,
    Switches,
    InputTag,
    ModifyModal,
    CreateModal,
    FilterModal: () => import('@/components/Modals/FilterModal'),
    DistintaBaseModal: () => import('@/components/Modals/DistintaBaseModal')
  },
  data () {
    return {
      selectedCategory: null,
      recipeId: null,
      moduleId: null,
      modifyModalShow: false,
      dibaId: null,
      dibaItem: null,
      ascValue: 'DESC',
      ascOptions: ['ASC', 'DESC'],
      fieldsManager: [],
      dataProvider: [],
      isLoad: false,
      apiBase: '',
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
      modifiedItem: {},
      deleteLink: null,
      selectOptions: [],
      favorites: [],
      filterForm: {},
      boxOne: '',
      validated: null,
      filter: 'Tutti',
      ingredients: [],
      noIngredients: false,
      ingredientsLoading: true
    }
  },
  computed: {
    categories () {
      return this.selectOptions.filter(option => option.label !== 'Tutti')
    },
    categoriaRicettaOptions () {
      return this.selectOptions.filter(option => option.listMaster === 'categoria_ricetta')
    }
  },
  methods: {
    setIngredients (ingredients) {
      console.log('h', ingredients)
      if (ingredients.length > 0) {
        this.noIngredients = false
        this.ingredients = []
        this.ingredients = ingredients
        this.ingredientsLoading = false
      } else {
        this.ingredients = []
        this.noIngredients = true
        this.ingredientsLoading = false
      }
    },
    handleFilter (option) {
      let query = {
        categoria_ricetta: option
      }

      if (query.categoria_ricetta === 'Tutti') {
        this.filterQuery = ''
        this.loadItems()
      } else {
        this.loadItems(query)
      }
      this.filter = query.categoria_ricetta

      console.log(query)
    },
    log () {
      console.log('clicked')
    },
    async onAcquistaRicetta () {
      const formData = new FormData()
      formData.set('ricetta_id', this.recipeId)
      formData.set('categoria_ricetta', this.selectedCategory)
      formData.set('acquista_ricetta', this.moduleId)

      try {
        const response = await instance.post(
          '/api/AcquistaRicetta',
          formData
        )
        console.log('acquistaTicettaResponse', response)
        this.showMsgBoxOne(response.data.status, response.data.message)
        const index = this.items.findIndex(item => item.id === this.recipeId)
        this.items[index].acquisita = String(response.data.data.acquisita)
      } catch (error) {
        console.log(error)
      }

      // axios
      //   .post(`${this.apiBase}?acquista_ricetta=${this.moduleId}&token=1`,
      //     formData,
      //     {
      //       headers: {
      //         'Content-Type': 'multipart/form-data'
      //       }
      //     }
      //   )
      //   .then(response => {
      //     this.showMsgBoxOne(response.data.status, response.data.message)
      //     console.log('acquista_ricetta response', response)
      //     const index = this.items.findIndex(item => item.id === this.recipeId)
      //     this.items[index].acquisita = String(response.data.data.acquisita)
      //     console.log('index', index)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   })
    },
    onSubmitCategory () {
      if (this.selectedCategory === null) {
        this.validated = false
        return
      }
      this.$refs.setRecipeSubmit.click()
      this.selectedCategory = null
      this.validated = null
    },
    onSetRecipe (recipeId) {
      this.recipeId = recipeId
      this.openModal('set-recipe-modal')
    },
    showMsgBoxOne (status, message) {
      this.hideModal('set-recipe-modal')
      this.boxOne = ''
      const messageBox = status ? [
        <b-container class="d-flex flex-column align-items-center">
          <i style="font-size:60px; color: green;" class="simple-icon-check mb-3"/>
          <h1 class="text-center">{message}</h1>
        </b-container>
      ] : [
        <b-container class="d-flex flex-column align-items-center">
          <i style="font-size:60px; color: red;" class="simple-icon-close mb-3"/>
          <h1 class="text-center">{message}</h1>
        </b-container>
      ]
      this.$bvModal.msgBoxOk(messageBox)
        .then(value => {
          this.boxOne = value
        })
        .catch(err => {
          // An error occurred
        })
    }
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
