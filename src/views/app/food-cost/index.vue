<template>
  <b-row>
    <b-colxx>
      <b-row>
        <b-colxx xxs="12">
          <h1 v-html="module.module_name" />
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

                <!-- <b-dropdown
                  id="ddown5"
                  :text="`${filter}`"
                  size="xs"
                  variant="outline-dark"
                  class="mr-1 mb-1"
                >
                  <b-dropdown-item
                    v-for="({ sub_name, sub_route }) in foodCostNav.nav_sub"
                    @click="handleFilter(sub_route)"
                    :key="`sub-${sub_name}`"
                  >{{ sub_name }}</b-dropdown-item>
                </b-dropdown> -->

                <template
                  v-for="{ sub_name, sub_route } in foodCostNav.nav_sub"
                >
                  <b-btn
                    v-if="sub_name === filter"
                    class="no-border mr-1"
                    variant="primary"
                    size="xs"
                    @click="handleFilter(sub_route)"
                    :key="`sub-${sub_name}`"
                    >{{ sub_name }}</b-btn
                  >

                  <b-btn
                    v-else
                    class="mr-1"
                    variant="outline-secondary"
                    size="xs"
                    @click="handleFilter(sub_route)"
                    :key="`sub-${sub_name}`"
                    >{{ sub_name }}</b-btn
                  >
                </template>

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
      <template v-if="isLoad && items.length > 0">
        <b-row v-if="displayMode === 'list'" key="list">
          <b-row v-if="items.length === 0" class="justify-content-center w-100">
            <h2>Nessun elemento trovato</h2>
          </b-row>
          <template v-else>
            <b-colxx
              xxs="12"
              v-for="(item, index) in items"
              :id="item.id"
              class="mb-3"
              :key="index"
            >
              <food-cost-list-item
                :index="index"
                :key="item.id"
                :data="item"
                :columns="Number(module.columns)"
                :options="selectOptions"
                :fields="fieldsManager"
                :selected-items="selectedItems"
                :actions="actions"
                @toggle-item="toggleItem"
                @handle-favorite="handleFavorite"
                @modify-item="openModifyModal"
                @copy-item="copyItem"
                @open-diba-modal="openDiba"
                @delete-item="deleteItem"
              />
            </b-colxx>
          </template>
        </b-row>

        <b-row v-if="lastPage > 1">
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

import FoodCostListItem from "@/components/Listing/FoodCostListItem";
import { listMixin } from "@/mixins/listMixin";
import axios from "axios";

import Switches from "vue-switches";
import InputTag from "@/components/Form/InputTag";
import CreateModal from "@/components/Modals/CreateModal";
import ModifyModal from "@/components/Modals/ModifyModal";
import { instance } from "@/axiosInstance";

export default {
  props: ["parent"],
  mixins: [listMixin],
  components: {
    FoodCostListItem,
    DataListIcon,
    ThumbListIcon,
    ImageListIcon,
    vSelect,
    Switches,
    InputTag,
    ModifyModal,
    CreateModal,
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
      filter: "Tutti",
      sort: { column: "id", label: "ID" },
      page: 1,
      perPage: 20,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      pageSizes: [20, 40, 80],
      filteredOptions: [],
      actions: [],
      newItem: {},
      modifiedItem: {},
      deleteLink: null,
      selectItems: [],
      selectOptions: [],
      favorites: [],
      filterForm: {}
    };
  },
  computed: {
    foodCostNav() {
      return this.$store.state.navigation.find(link =>
        link.name.includes("Food Cost")
      );
    }
  },
  methods: {
    handleFilter(route) {
      console.log("route", route);
      let query = route.slice(route.indexOf("?") + 1).split("=");
      query = {
        categoria_ricetta: query[1],
        filters: 1
      };

      if (query.categoria_ricetta === "Tutti") {
        this.filterQuery = "";
        this.loadItems();
      } else {
        this.loadItems(query);
      }
      this.filter = query.categoria_ricetta;

      console.log(query);
    },
    log() {
      console.log("clicked");
    },
    handleFavorite(item) {
      let itemClone = Object.assign({}, item);
      if (item.favorite == 0) {
        item.favorite = 1;
      } else {
        item.favorite = 0;
      }
      console.log("itemClone", item);
      this.modifiedItem = item;
      this.updateItem(this.modifiedItem);
    },
    async deleteItem(id) {
      let ids = [...this.selectedItems];
      if (id) {
        ids.push(id);
      }
      const formData = new FormData();
      formData.set("delete", this.$store.state.modulesManager.module_tab_id);
      ids.forEach((val, index) => {
        formData.set(`ids[${index}]`, val);
      });
      if (ids.length > 0) {
        try {
          const response = await this.axios.post("/api/DeleteItem", formData);
          console.log("deleteResponse", response);
          this.items = this.items.filter(item => {
            return ids.indexOf(item.id) === -1;
          });
          this.selectedItems = [];
        } catch (error) {
          console.log(error);
        }
      }
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

#displayOptions .no-border {
  border-color: #f18024;
  color: #ffffff;
}
</style>
