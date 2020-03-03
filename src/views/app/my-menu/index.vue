<template>
  <b-row>
    <!-- <b-colxx class="disable-text-selection"> -->
    <b-colxx>
      <b-row v-if="isLoad">
        <b-colxx xxs="12">
          <h1 v-html="module.module_name" />
          <!-- <h1>{{ $t('menu.data-list') }}</h1> -->
          <div class="top-right-button-container">
            <b-button
              @click="onLaunchAlgorythm"
              variant="primary"
              size="lg"
              class="top-right-button"
            >
              <i class="simple-icon-rocket" />
              LANCIA ALGORITMO
            </b-button>
            <b-button-group>
              <!-- <b-dropdown split right @click="selectAll(true)" class="check-button" variant="primary"> -->
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
                <b-dropdown-item @click="removeFavorites"
                  >Rimuovi dal menù</b-dropdown-item
                >
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
                class="mr-1 mb-1">
                <b-dropdown-item
                  v-for="({ label, id }) in categoriaRicettaOptions"
                  @click="handleFilter(label)" :key="`sub-${id}`">{{ label }}</b-dropdown-item>
              </b-dropdown> -->

                <template v-for="{ label, id } in categoriaRicettaOptions">
                  <b-btn
                    v-if="label === filter"
                    class="no-border mr-1"
                    variant="primary"
                    size="xs"
                    @click="handleFilter(label)"
                    :key="`sub-${id}`"
                    >{{ label }}</b-btn
                  >

                  <b-btn
                    v-else
                    class="mr-1"
                    variant="outline-secondary"
                    size="xs"
                    @click="handleFilter(label)"
                    :key="`sub-${id}`"
                    >{{ label }}</b-btn
                  >
                </template>
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
      <template v-if="isLoad && preloader === false">
        <b-row v-if="displayMode === 'list'" key="list">
          <b-row v-if="items.length < 1" class="justify-content-center w-100">
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
              <my-menu-list-item
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

    <b-modal
      id="modalpreloader"
      ref="modalpreloader"
      dialog-class="no-border-shadow"
      content-class="body-transparent"
      no-close-on-backdrop
      hide-footer
      hide-header
      centered
      size="sm"
    >
      <b-row class="justify-content-center">
        <b-spinner
          style="width: 3rem; height: 3rem;"
          variant="primary"
          type="grow"
          label="Spinning"
        />
      </b-row>
    </b-modal>

    <b-modal
      size="lg"
      id="modal-launch-algorythm"
      ref="modal-launch-algorythm"
      dialog-class="no-border-shadow"
      footer-class="py-2"
      no-close-on-backdrop
      no-close-on-esc
      hide-header
      centered
    >
      <b-row v-if="error" class="justify-content-center py-4">
        <div class="w-100 d-flex justify-content-center mb-4">
          <i
            style="color: red; font-size: 40px;"
            class="simple-icon-exclamation"
          />
        </div>
        <h4 style="color: #f18024;">{{ message }}</h4>
      </b-row>
      <b-row v-else-if="result.length > 0" class="justify-content-center py-4">
        <b-container>
          <b-row class="justify-content-center mb-2">
            <i style="font-size: 40px;" class="simple-icon-rocket" />
          </b-row>
          <b-row class="justify-content-center">
            <h4 style="color: #f18024;" class="mb-4">Ecco i risultati!</h4>
            <b-table hover :items="result">
              <template v-slot:cell(previous_class)="data">
                <i style="font-size: 1.5rem;" :class="getIcon(data.value)" />
              </template>

              <template v-slot:cell(actual_class)="data">
                <i style="font-size: 1.5rem;" :class="getIcon(data.value)" />
              </template>
            </b-table>
          </b-row>
        </b-container>
      </b-row>
      <template slot="modal-footer">
        <b-button variant="primary" @click="closeLaunchModal">OK</b-button>
      </template>
    </b-modal>
  </b-row>
</template>
<script>
import { DataListIcon, ThumbListIcon, ImageListIcon } from "@/components/Svg";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import MyMenuListItem from "@/components/Listing/MyMenuListItem";
import { listMixin } from "@/mixins/listMixin";

import Switches from "vue-switches";
import InputTag from "@/components/Form/InputTag";
import CreateModal from "@/components/Modals/CreateModal";
import ModifyModal from "@/components/Modals/ModifyModal";

export default {
  props: ["parent"],
  mixins: [listMixin],
  components: {
    MyMenuListItem,
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
      preloader: false,
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
      filterForm: {},
      message: null,
      boxOne: "",
      error: false,
      result: [],
      filter: "Tutti",
      quiverCode: null
    };
  },
  computed: {
    categoriaRicettaOptions() {
      return this.selectOptions.filter(
        option => option.listMaster === "categoria_ricetta"
      );
    },
    axios() {
      return this.$store.getters.getAxios;
    }
  },
  methods: {
    async removeFavorite(id) {
      let ids = [...this.selectedItems];
      if (id) {
        ids.push(id);
      }
      const formData = new FormData();
      ids.forEach((val, index) => {
        formData.set(`ids[${index}]`, val);
        formData.set(
          "removeFavorite",
          this.$store.state.modulesManager.module_tab_id
        );
      });
      console.log("idToDelete", ids);
      if (ids.length > 0) {
        try {
          const response = await this.axios.post(
            "/api/RemoveFavorite",
            formData
          );
          console.log("removeFavResponse", response);

          if (response.data.status) {
            this.items = this.items.filter(item => {
              return ids.indexOf(item.id) === -1;
            });
            this.selectedItems = [];
            console.log("deleteResponse", response);
          } else {
            this.error = true;
            this.message = "Si è verificato un errore, riprova più tardi";
          }
        } catch (error) {
          console.log(error);
        }

        // axios
        //   .post(
        //     `${this.apiBase}?removeFavorite=${this.quiverCode}&token=1`,
        //     formData,
        //     {
        //       headers: {
        //         'Content-Type': 'multipart/form-data'
        //       }
        //     }
        //   )
        //   .then(response => {
        //     this.items = this.items.filter(item => {
        //       return ids.indexOf(item.id) === -1
        //     })
        //     this.selectedItems = []
        //     console.log('deleteResponse', response)
        //   })
        //   .catch(err => {
        //     console.log(err)
        //   })
      }
    },
    removeFavorites() {
      this.$bvModal
        .msgBoxConfirm("Sicuro di voler eliminare?", {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "SÌ",
          cancelTitle: "Anulla",
          footerClass: "p-2"
        })
        .then(value => {
          if (value) {
            this.removeFavorite();
          }
        })
        .catch(err => {
          // An error occurred
          console.log("error", err);
        });
    },
    handleFilter(option) {
      let query = {
        categoria_ricetta: option
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
    getIcon(value) {
      const icons = {
        HH: "simple-icon-star",
        LH: "icon-horse",
        HL: "simple-icon-puzzle",
        LL: "iconsminds-dog"
      };
      return icons[value];
    },
    closeLaunchModal() {
      this.loadItems();
      this.hideModal("modal-launch-algorythm");
    },
    async onLaunchAlgorythm() {
      this.error = false;
      this.openModal("modalpreloader");

      let formData = new FormData();
      formData.set("lancia_algoritmo", this.moduleId);
      try {
        const response = await this.axios.post(
          "/api/LanciaAlgoritmo",
          formData
        );
        console.log("lanciaAlgoritnoResponse", response);

        if (response.data.status) {
          this.result = response.data.data;
        } else {
          this.error = true;
          this.message = "Si è verificato un errore, riprova più tardi";
        }
      } catch (error) {
        console.log(error);
      }

      this.hideModal("modalpreloader");
      this.openModal("modal-launch-algorythm");
    },
    async loadItems(paramQuery) {
      this.isLoad = false;
      if (paramQuery) {
        this.filterQuery = "&favorite=1";
        for (const key in paramQuery) {
          if (paramQuery.hasOwnProperty(key)) {
            this.filterQuery += "&";
            this.filterQuery += key + "=" + paramQuery[key];
          }
        }
        console.log("query", this.filterQuery);
      }

      let formData = new FormData();
      formData.set("fields_manager", this.module.id);
      try {
        const fieldManagerResponse = await this.axios.post(
          "/api/FieldsManager",
          formData
        );
        console.log("fieldManagerResponse", fieldManagerResponse);
        this.fieldsManager = [];
        this.fieldsManager = fieldManagerResponse.data.data;
        let newItem = {};
        let filterForm = {};
        this.fieldsManager.forEach(field => {
          if (field.type === "date") {
            newItem[field.field] = new Date();
          } else if (field.type === "tags") {
            newItem[field.field] = [];
          } else {
            newItem[field.field] = "";
          }

          if (
            field.type === "tags" ||
            field.type === "select" ||
            field.type === "selectText" ||
            field.type === "hiddenSelect"
          ) {
            this.getSelectOptions(field.field, field.type);
          }

          if (Number(field.in_filter) > 0) {
            filterForm[field.field] = "";
          }
        });
        this.newItem = newItem;
        this.filterForm = filterForm;
      } catch (error) {
        console.log(error);
      }

      let params = { data_provider: this.module.id, filters: 1, favorite: 1 };

      if (paramQuery) {
        params = Object.assign(params, paramQuery);
      }

      console.log("params", params);

      try {
        const dataProviderResponse = await this.axios.get("/api/DataProvider", {
          params
        });
        console.log("dataProviderResponse", dataProviderResponse);
        const dataProvider = dataProviderResponse.data.data;
        const { data } = dataProviderResponse;
        console.log("data", data);

        if (!dataProvider) {
          const error = {
            message: "Empty"
          };
          throw error;
        }

        for (let index = 0; index < dataProvider.length; index++) {
          const item = dataProvider[index];
          if (item.allergeni) {
            if (item.allergeni === "") {
              dataProvider[index].allergeni = await [];
            } else {
              dataProvider[index].allergeni = await item.allergeni
                .replace(/[{}]+/g, "")
                .split(",");
            }
          }
        }

        delete dataProvider.created_at;
        delete dataProvider.updated_at;

        this.deleteLink = data.delete;
        this.total = data.total;
        this.from = data.from;
        this.to = data.to;
        this.items = dataProvider;
        this.perPage = data.per_page;
        this.selectedItems = [];
        this.lastPage = data.last_page;
        this.isLoad = true;
        this.hideModal("filtermodal");
      } catch (error) {
        this.isLoad = true;
        console.log(error);
      }
    }
  }
};
</script>

<style>
.filter-btn {
  padding: 0.21em 0.5em !important;
}

.modify-modal {
  padding: 0 !important;
}

.no-border-shadow {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.body-transparent {
  background-color: transparent !important;
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
