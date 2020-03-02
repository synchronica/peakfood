import { cloneItem, capitalize } from "@/utils";

export const listMixin = {
  data: () => ({
    filteredOptions: [],
    filterQuery: "",
    selectOptions: [],
    fieldsManager: [],
    newItem: {},
    items: [],
    uploadLoading: false,
    file: null,
    selectedItems: [],
    newItemReset: {},
    modifiedItem: {}
  }),
  computed: {
    axios() {
      return this.$store.getters.getAxios;
    },
    host() {
      return this.$store.getters.getHost;
    },
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    },
    module() {
      return this.$store.getters.getModules;
    },
    fieldsFilter() {
      const fields = this.fieldsManager
        .filter(field => Number(field.in_list) > 0)
        .sort((a, b) => Number(a.in_list) - Number(b.in_list));
      return fields;
    },
    link() {
      const file = this.fieldsFilter.find(
        field => field.field === "protocollo_file"
      );
      return file ? file.link : "";
    },
    sortOptions() {
      let options = [];
      this.fieldsFilter.forEach(field => {
        const label = capitalize(field.field);
        const object = { column: field.field, label: label };
        options.push(object);
      });
      return options;
    },
    tabs() {
      if (this.module.tabs && this.module.tabs.length > 0) {
        return this.module.tabs;
      } else {
        return [];
      }
    },
    initIsLoad() {
      return this.$store.getters.getInitIsLoad;
    },
    isPeak() {
      if (this.$store.getters.getHost === "peakfood.condivision.cloud") {
        return true;
      } else {
        return false;
      }
    },
    apiUrl() {
      return `${this.apiBase}?sort=${this.sort.column}&page=${this.page}&per_page=${this.perPage}&search=${this.search}&sortMode=${this.ascValue}`;
    }
  },
  watch: {
    search() {
      if (this.isLoad) {
        this.page = 1;
      }
    },
    $route(to, from) {
      this.isLoad = false;
      this.moduleId = this.$route.params.id;
      this.$store.dispatch("getModuleManager", this.moduleId);
    },
    module() {
      if (this.initIsLoad && this.module) {
        this.ascValue = this.module.default_order;
        this.perPage = this.module.results_per_page;
        this.displayMode = this.module.default_view_option;
        this.displayModeOptions = this.module.display_view_options.split(",");
        this.actions = this.module.default_actions.split(",");

        if (this.$route.query !== {}) {
          this.loadItems(this.$route.query);
        } else {
          this.loadItems();
        }
      }
    }
    // apiUrl () {
    //   if (this.initIsLoad && this.isLoad) {
    //     this.loadItems()
    //   }
    // }
  },
  created() {
    this.moduleId = this.$route.params.id;
    this.$store.dispatch("getModuleManager", this.moduleId);
  },
  methods: {
    toHtml(text) {
      let txt = document.createElement("textarea");
      txt.innerHTML = text;
      return txt.value;
    },
    cloneItem(value) {
      let result = JSON.parse(JSON.stringify(value));
      return result;
    },
    onFilter(form) {
      let filteredForm = {};
      for (const key in form) {
        if (form.hasOwnProperty(key)) {
          let element = form[key];

          if (element) {
            filteredForm[key] = element;
            if (typeof element === "object" && !key.includes("data")) {
              console.log("object", key, element);
              if (element) {
                if (element.type === "select") {
                  element = Number(element.id);
                } else if (element.type === "selectText") {
                  element = element.label;
                } else if (element[0]) {
                  if (element[0].type === "tags") {
                    let string = "";
                    console.log("element", element);
                    element.forEach((tag, index) => {
                      string += `{${tag.label}}`;

                      if (index + 1 < element.length) {
                        string += ",";
                      }
                    });
                    element = string;
                  }
                }
              }
            }

            if (typeof element === "object" && key.includes("data")) {
              let month = element.getMonth() + 1;
              let date =
                element.getDate() < 10
                  ? `0${element.getDate()}`
                  : element.getDate();
              element = `${element.getFullYear()}-${month}-${date}`;
            }
            filteredForm[key] = element;
          }
        }
      }
      this.loadItems(filteredForm);
      this.hideModal("filtermodal");
    },
    async loadItems(paramQuery, favorite) {
      this.isLoad = false;

      let formData = new FormData();
      formData.set("fields_manager", this.module.id);

      if (paramQuery) {
        formData.set("filters", "1");
        for (const key in paramQuery) {
          if (paramQuery.hasOwnProperty(key)) {
            formData.set(key, paramQuery[key]);
          }
        }
      }

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

      formData = new FormData();
      formData.set("data_provider", this.module.id);

      try {
        const dataProviderResponse = await this.axios.post(
          "/api/DataProvider",
          formData
        );
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
    },
    handleFavorite(item) {
      if (item.favorite === "0") {
        item.favorite = 1;
      } else {
        item.favorite = 0;
      }
      if (this.moduleId == 7) {
        console.log("y");
        this.favorites = this.favorites.filter(
          itemToFilter => item.id !== itemToFilter.id
        );
        console.log("fa", this.favorites);
        this.$forceUpdate();
      }
      this.modifiedItem = item;
      this.updateItem(this.modifiedItem);
    },
    openDiba({ id, modal, item }) {
      this.dibaId = id;
      this.dibaItem = item;
      this.openModal(modal);
    },
    multipleDeletes() {
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
            this.deleteItem();
          }
        })
        .catch(err => {
          // An error occurred
          console.log("error", err);
        });
    },
    showInTab(field, content) {
      if (content.includes(field)) {
        return true;
      } else {
        return false;
      }
    },
    async getSelectOptions(field, type) {
      let exist = this.filteredOptions.find(value => value === field);

      if (exist === undefined) {
        const formData = new FormData();
        formData.set("list_values", field);

        const res = await this.axios.post("/api/ListValues", formData);

        const { data } = res.data;
        this.filteredOptions.push(field);

        if (data) {
          data.forEach(option => {
            option.type = type;

            this.selectOptions.push(option[0]);
          });
        }
      }
    },
    selectOptionsArr(field) {
      let options = this.selectOptions.filter(option => {
        return option.listMaster === field;
      });
      return options;
    },
    openModal(id) {
      this.$bvModal.show(id);
    },
    hideModal(id) {
      this.$bvModal.hide(id);
    },
    changeDisplayMode(displayType) {
      this.displayMode = displayType;
    },
    changePageSize(perPage) {
      if (this.isLoad) {
        this.perPage = perPage;
        this.loadItems();
      }
    },
    changeOrderBy(sort) {
      if (this.isLoad) {
        this.sort = sort;
        this.loadItems();
      }
    },
    addNewItem(newItem) {
      this.insertUpdate(newItem);
    },
    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map(x => x.id);
      }
    },
    keymap(event) {
      switch (event.srcKey) {
        case "select":
          this.selectAll(false);
          break;
        case "undo":
          this.selectedItems = [];
          break;
      }
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },
    toggleItem(event, itemId) {
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.items;
        var start = this.getIndex(itemId, itemsForToggle, "id");
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          "id"
        );
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
            return item.id;
          })
        );
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId);
        } else this.selectedItems.push(itemId);
      }
    },
    formatDate(string) {
      return new Date(string);
    },
    async deleteItem(id) {
      let ids = [...this.selectedItems];
      if (id) {
        ids.push(id);
      }
      const formData = new FormData();
      formData.set("delete", this.moduleId);
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
    },
    openModifyModal(event, item) {
      let clone = cloneItem(item);
      for (const key in clone) {
        if (key.includes("date")) {
          if (clone.hasOwnProperty(key)) {
            clone[key] = new Date(clone[key]);
          }
        }
      }
      console.log("item", item);
      for (const key in clone) {
        const hasProp = this.filteredOptions.find(option => option === key);
        if (hasProp) {
          const option = this.selectOptions.find(opt => {
            return opt.listMaster === hasProp && opt.id === clone[key];
          });
          if (option) {
            clone[key] = option;
          }
        }
      }

      this.modifiedItem = clone;
      this.openModal("modifymodal");
      console.log("modifiedItem", this.modifiedItem);
    },
    updateItem(item) {
      this.insertUpdate(this.modifiedItem);
    },
    copyItem(event, item) {
      let copyItem = item;

      for (const key in copyItem) {
        if (key.includes("data_")) {
          copyItem[key] = this.formatDate(copyItem[key]);
        }
      }

      this.insertUpdate(copyItem, true);
    },
    createFormData(item) {
      console.log("item", item);
      const formData = new FormData();
      const object = {};
      const itemToUpdate = cloneItem(item);
      for (const key in itemToUpdate) {
        if (itemToUpdate.hasOwnProperty(key)) {
          let element = itemToUpdate[key];
          if (typeof element === "boolean") {
            element = String(element);
            if (element === "true") {
              element = "1";
            } else {
              element = "0";
            }
            console.log("bool", element);
          }
          if (key === "id" && element === "") {
            element = "0";
          }
          if (element === "") {
            continue;
          }
          if (key === "fornitore") {
            element = "user";
          }
          if (typeof element === "object" && !key.includes("data")) {
            if (element) {
              if (element.type === "select") {
                element = Number(element.id);
              } else if (element.type === "selectText") {
                element = element.label;
              } else if (element[0]) {
                if (element[0].type === "tags") {
                  let string = "";
                  element.forEach((tag, index) => {
                    string += `{${tag.label}}`;

                    if (index + 1 < element.length) {
                      string += ",";
                    }
                  });
                  element = string;
                }
              }
            }
          }

          if (typeof element === "object" && key.includes("data")) {
            let month = element.getMonth() + 1;
            let date =
              element.getDate() < 10
                ? `0${element.getDate()}`
                : element.getDate();
            element = `${element.getFullYear()}-${month}-${date}`;
          }

          formData.set(key, element);
          object[key] = element;
        }
      }
      return formData;
    },
    async insertUpdate(
      item,
      copy = false,
      hasFile = false,
      file = null,
      fileUpload = false
    ) {
      console.log("copy", copy);
      item.update = this.module.id;
      if (copy) {
        item.copy = "1";
      }
      delete item.created_at;
      delete item.updated_at;
      item.module_tab_id = this.module.id;
      console.log(item);
      try {
        const response = await this.axios.post(
          "/api/InsertUpdate",
          this.createFormData(item)
        );
        console.log("insertUpdateResponse", response);

        const status = response.data.status;
        const data = response.data.data;
        if (status) {
          if (data.newRecord) {
            if (copy) {
              console.log("CopiedItem: ", item);
              item.id = data.recordId;
              this.items.unshift(item);
              const type = "success filled";
              const title = "Successo";
              const message = "L'articolo è stato copiato";
              this.$notify(type, title, message, {
                duration: 3000,
                permanent: false
              });
            } else {
              this.newItem.id = data.recordId;

              this.items.unshift(this.newItem);
              this.hideModal("createmodal");
              console.log("Adding item : ", this.newItem);
              this.$forceUpdate();
            }
          } else {
            console.log("Modified item : ", this.modifiedItem);
            const index = this.items.findIndex(
              item => item.id === this.modifiedItem.id
            );

            this.items[index] = Object.assign({}, this.modifiedItem);
            this.$forceUpdate();
            this.hideModal("modifymodal");
          }
        } else {
          const type = "error filled";
          const title = "C'è stato un problema";
          const message = data.data.message;
          this.$notify(type, title, message, {
            duration: 3000,
            permanent: false
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    linkGen(pageNum) {},
    changeAsc(asc) {
      if (this.isLoad) {
        this.ascValue = asc;
        this.loadItems();
      }
    },
    toPascalCase(str) {
      return capitalize(str);
    },
    showField(value) {
      if (value === "id" || value === "hidden") {
        return false;
      }
      return true;
    }
  }
};
