<template>
  <b-row>
    <!-- <b-colxx class="disable-text-selection"> -->
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
              >{{ $t("pages.add-new") }}</b-button
            >
            <b-button-group>
              <b-dropdown
                split
                right
                @click="selectAll(true)"
                class="check-button"
                variant="primary"
              >
                <label
                  class="custom-control custom-checkbox pl-4 mb-0 d-inline-block"
                  slot="button-content"
                >
                  <input
                    class="custom-control-input"
                    type="checkbox"
                    :checked="isSelectedAll"
                    v-shortkey="{ select: ['ctrl', 'a'], undo: ['ctrl', 'd'] }"
                    @shortkey="keymap"
                  />
                  <span
                    :class="{
                      'custom-control-label': true,
                      indeterminate: isAnyItemSelected
                    }"
                  />
                </label>
                <b-dropdown-item @click="multipleDeletes">{{
                  $t("pages.delete")
                }}</b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </div>

          <piaf-breadcrumb v-if="isLoad" />
          <div class="mb-2 mt-2">
            <b-button
              variant="empty"
              class="pt-0 pl-0 d-inline-block d-md-none"
              v-b-toggle.displayOptions
            >
              {{ $t("pages.display-options") }}
              <i class="simple-icon-arrow-down align-middle" />
            </b-button>
            <b-collapse id="displayOptions" class="d-md-block">
              <div class="d-block d-md-inline-block mb-2">
                <span
                  v-if="this.displayModeOptions.length > 0"
                  class="mr-1 mb-2 d-inline-block float-md-left"
                >
                  <template v-for="option in displayModeOptions">
                    <a
                      :class="{
                        'mr-2 view-icon': true,
                        active: displayMode === option
                      }"
                      @click="changeDisplayMode(option)"
                      :key="option"
                    >
                      <component
                        v-bind:is="
                          (option === 'list' ? 'data' : option) + '-list-icon'
                        "
                      />
                    </a>
                  </template>
                </span>
                <div
                  class="search-sm d-inline-block float-md-left mr-1 align-top mb-2"
                >
                  <b-input
                    :placeholder="$t('menu.search')"
                    v-model.lazy="search"
                  />
                </div>

                <b-dropdown
                  id="ddown1"
                  :text="`${$t('pages.orderby')} ${sort.label}`"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(order, index) in sortOptions"
                    :key="index"
                    @click="changeOrderBy(order)"
                    >{{ order.label }}</b-dropdown-item
                  >
                </b-dropdown>

                <b-dropdown
                  id="ddown2"
                  :text="`${ascValue}`"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(asc, index) in ascOptions"
                    :key="index"
                    @click="changeAsc(asc)"
                    >{{ asc }}</b-dropdown-item
                  >
                </b-dropdown>

                <div
                  v-if="id !== '4'"
                  class="d-inline-block float-md-left mr-1 align-top"
                >
                  <b-button
                    v-b-modal.filtermodal
                    variant="outline"
                    class="btn-outline-dark btn-xs pr-2"
                  >
                    <span>Filtri</span>
                    <i class="iconsminds-filter-2" />
                  </b-button>
                </div>

                <!-- Settings Icon -->
                <!-- <div v-if="isPeak" class="d-inline-block float-md-left ml-2 align-top">
                <a @click="openModal('menusettingsmodal')">
                  <i style="font-size:24px" class=" align-self-center text-muted simple-icon-settings"/>
                </a>
              </div> -->

                <div class="d-inline-block d-md-none">
                  <span class="text-muted text-small mr-1 mb-2"
                    >{{ from }}-{{ to }} of {{ total }}</span
                  >
                  <b-dropdown
                    id="ddown2"
                    right
                    :text="`${perPage}`"
                    variant="outline-dark"
                    class="d-inline-block"
                    size="xs"
                  >
                    <b-dropdown-item
                      v-for="(size, index) in pageSizes"
                      :key="index"
                      @click="changePageSize(size)"
                      >{{ size }}</b-dropdown-item
                    >
                  </b-dropdown>
                </div>
              </div>
              <div class="float-md-right d-none d-md-block">
                <span class="text-muted text-small mr-1 mb-2"
                  >{{ from }}-{{ to }} of {{ total }}</span
                >
                <b-dropdown
                  id="ddown2"
                  right
                  :text="`${perPage}`"
                  variant="outline-dark"
                  class="d-inline-block"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(size, index) in pageSizes"
                    :key="index"
                    @click="changePageSize(size)"
                    >{{ size }}</b-dropdown-item
                  >
                </b-dropdown>
              </div>
            </b-collapse>
          </div>
          <div class="separator mb-5" />
        </b-colxx>
      </b-row>
      <template v-if="isLoad">
        <b-row v-if="displayMode === 'list'" key="list">
          <b-row v-if="items.length < 1" class="justify-content-center w-100">
            <h2>Nessun elemento trovato</h2>
          </b-row>
          <b-colxx
            xxs="12"
            class="mb-3"
            v-for="(item, index) in items"
            :key="index"
            :id="item.id"
          >
            <data-list-item
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
              @open-diba-modal="openDiba"
              @delete-item="deleteItem"
            />
          </b-colxx>
        </b-row>
        <b-row v-else-if="displayMode === 'thumb'" key="thumb">
          <b-colxx
            xxs="12"
            class="mb-3"
            v-for="(item, index) in items"
            :key="index"
            :id="item.id"
          >
            <thumb-list-item
              :key="item.id"
              :data="item"
              :fields="fieldsFilter"
              :selected-items="selectedItems"
              :select-options="selectOptions"
              :actions="actions"
              @toggle-item="toggleItem"
              @modify-item="openModifyModal"
            />
          </b-colxx>
        </b-row>
        <b-row v-else-if="displayMode === 'image'" key="image">
          <b-colxx
            sm="6"
            lg="4"
            xl="3"
            class="mb-3"
            v-for="(item, index) in items"
            :key="index"
            :id="item.id"
          >
            <image-list-item
              :key="item.id"
              :data="item"
              :filters="fieldsFilter"
              :selected-items="selectedItems"
              :actions="actions"
              @toggle-item="toggleItem"
              @modify-item="openModifyModal"
            />
          </b-colxx>
        </b-row>

        <b-row>
          <b-colxx xxs="12">
            <b-pagination-nav
              :number-of-pages="lastPage"
              :link-gen="linkGen"
              v-model="page"
              :per-page="perPage"
              align="center"
            >
              <template v-slot:next-text>
                <i class="simple-icon-arrow-right" />
              </template>
              <template v-slot:prev-text>
                <i class="simple-icon-arrow-left" />
              </template>
              <template v-slot:first-text>
                <i class="simple-icon-control-start" />
              </template>
              <template v-slot:last-text>
                <i class="simple-icon-control-end" />
              </template>
            </b-pagination-nav>
          </b-colxx>
        </b-row>
      </template>
      <template v-else-if="isLoad === false">
        <div class="loading"></div>
      </template>
      <template v-else-if="items.length < 1">
        <b-container
          class="d-flex h-100 flex-column justify-content-center align-items-center"
        >
          <i style="font-size: 40px;" class="simple-icon-close text-muted" />
          <h1 class="text-muted">Nessun elemento trovato</h1>
        </b-container>
      </template>
    </b-colxx>

    <!-- START MODALS -->
    <!-- <b-modal
    id="filtermodal"
    ref="filtermodal"
    title="Filtri"
    class="modal-right"
  >
    <b-form>
      <b-row class="mb-3">
        <template v-for="{field, type, in_filter} in fieldsManager">
          <b-col v-if="field !== 'id' && Number(in_filter) > 0 && showField(type)" :key="field" sm="12" class="mb-3">
            <label v-html="toPascalCase(field)" />
            <b-form-input v-if="type === 'text'" v-model="filterForm[field]"/>
            <b-form-input v-if="type === 'float'" v-model="filterForm[field]"/>
            <b-form-input v-if="type === 'number'" type="number" v-model="filterForm[field]"/>
            <v-select v-if="type === 'select'" :options="selectOptionsArr(field)" v-model="filterForm[field]"/>
            <v-date-picker
              v-if="type === 'date'"
              mode="single"
              v-model="filterForm[field]"
              :input-props="{ class:'form-control' }"
            ></v-date-picker>
            <vue-dropzone v-if="type === 'file'" ref="myVueDropzone" id="dropzone" :useCustomSlot=true :options="dropzoneOptions">
              <div class="dropzone-custom-content">
                <h3 class="dropzone-custom-title">Trascina e rilascia per caricare il contenuto!</h3>
                <div class="subtitle">...oppure fai clic per selezionare un file dal tuo computer</div>
              </div>
            </vue-dropzone>
            <template v-if="type === 'boolean'">
              <br />
              <switches  v-model="filterForm[field]" theme="custom" color="primary" />
            </template>

              <v-select v-if="type === 'tags'" taggable multiple :options="selectOptionsArr(field)" v-model="filterForm[field]"/>
              <v-select v-if="type === 'selectText'" taggable :options="selectOptionsArr(field)" v-model="filterForm[field]"/>
            <b-form-textarea
              v-if="type === 'textarea'"
              v-model="filterForm[field]"
              rows="3"
            ></b-form-textarea>
          </b-col>
        </template>
      </b-row>
    </b-form>

    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="hideModal('filtermodal')"
      >{{ $t('pages.cancel') }}</b-button>
      <b-button
        variant="primary"
        @click="submitFilter"
        class="mr-1"
      >{{ $t('pages.submit') }}</b-button>
    </template>
  </b-modal> -->

    <!-- END MODALS -->
    <filter-modal
      :item="filterForm"
      :fields="fieldsManager"
      :selectOptions="selectOptions"
      @handle-submit="onFilter"
      @hide-modal="hideModal"
    />
    <create-modal
      :item="newItem"
      :fields="fieldsManager"
      :tabs="tabs"
      :selectOptions="selectOptions"
      @create-submit="addNewItem"
      @hide-modal="hideModal"
    />
    <modify-modal
      :item="modifiedItem"
      :fields="fieldsManager"
      :tabs="tabs"
      :selectOptions="selectOptions"
      @modify-submit="updateItem"
      @hide-modal="hideModal"
    />
    <distinta-base-modal
      :id="dibaId"
      :item="dibaItem"
      @update-diba-field="insertUpdate"
    />
  </b-row>
</template>
<script>
import { DataListIcon, ThumbListIcon, ImageListIcon } from "@/components/Svg";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { listMixin } from "@/mixins/listMixin";

import ImageListItem from "@/components/Listing/ImageListItem";
import ThumbListItem from "@/components/Listing/ThumbListItem";
import DataListItem from "@/components/Listing/DataListItem";

import Switches from "vue-switches";
import InputTag from "@/components/Form/InputTag";
import { cloneItem, capitalize } from "@/utils";

export default {
  props: ["parent"],
  mixins: [listMixin],
  components: {
    DataListIcon,
    ThumbListIcon,
    ImageListIcon,
    vSelect,
    ImageListItem,
    ThumbListItem,
    DataListItem,
    Switches,
    InputTag,
    ModifyModal: () => import("@/components/Modals/ModifyModal"),
    CreateModal: () => import("@/components/Modals/CreateModal"),
    FilterModal: () => import("@/components/Modals/FilterModal"),
    DistintaBaseModal: () => import("@/components/Modals/DistintaBaseModal")
  },
  data() {
    return {
      moduleId: null,
      modifyModalShow: false,
      dibaId: null,
      dibaItem: null,
      ascValue: "DESC",
      ascOptions: ["ASC", "DESC"],
      fieldsManager: [],
      dataProvider: [],
      isLoad: false,
      apiBase: "",
      displayMode: "list",
      displayModeOptions: [],
      sort: { column: "id", label: "ID" },
      page: 1,
      perPage: 20,
      search: "",
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
      filterForm: {}
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  methods: {
    log() {
      console.log("clicked");
    }
  }
};
</script>

<style>
.filter-btn {
  padding: 0.25em 0.5em !important;
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
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  border-top-color: rgba(0, 0, 0, 0.4);
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
  left: calc(50%);
  top: calc(50%);
  position: fixed;
  z-index: 1;
}
</style>
