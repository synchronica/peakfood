<template>
  <div>
    <template v-if="index === 0">
      <div class="d-flex flex-row">
        <div class="pl-2 d-flex w-100">
          <div
            style="padding-left:24px"
            class="card-body pt-0 align-self-center d-flex flex-column flex-lg-row"
          >
            <div class="d-none d-lg-block d-xl-block text-truncate w-10">
              <span>Plan</span>
            </div>

            <div class="d-none d-lg-block d-xl-block text-truncate w-50">
              <span>Description</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <b-card
      class="rounded"
      :class="{
        'd-flex flex-row': true,
        active: selectedItems.includes(data.id)
      }"
      no-body
    >
      <div class="pl-2 d-flex w-100 min-width-zero">
        <div
          class="card-body w-100 w-sm-100 align-self-center d-flex flex-column flex-lg-row align-items-lg-center"
        >
          <div class="w-sm-100">
            <!-- MOBILE HEADER -->
            <span class="d-lg-none d-xl-none">{{ Plan }}</span>
          </div>

          <p class="mb-1 w-10 text-muted text-small w-sm-30">
            {{ data.name }}
          </p>

          <div class="w-sm-100">
            <!-- MOBILE HEADER -->
            <span class="d-lg-none d-xl-none">{{ Descrizione }}</span>
          </div>

          <p class="mb-1 w-70 text-muted text-small flex-frow-1">
            {{ data.description }}
          </p>

          <!-- PEAKFOOD ROW ACTIONS -->
          <div
            v-if="actions"
            class="w-10 w-sm-100 d-flex flex-grow-1 justify-content-end flex-column flex-lg-row"
            :key="index"
          >
            <template v-for="action in actions">
              <div
                v-if="action === 'modify'"
                class="pl-1 align-self-center mx-2"
                :key="action"
              >
                <a
                  @click.prevent="modifyItem($event, data, false)"
                  v-b-tooltip.hover
                  :title="capitalize(action)"
                >
                  <i :class="'glyph-icon simple-icon-note'" />
                </a>
              </div>
              <div
                v-if="action === 'copy'"
                class="pl-1 align-self-center mx-2"
                :key="action"
              >
                <a
                  @click.prevent="copyItem($event, data)"
                  v-b-tooltip.hover
                  :title="capitalize(action)"
                >
                  <i :class="'glyph-icon simple-icon-docs'" />
                </a>
              </div>

              <div
                v-if="action === 'delete'"
                class="pl-1 align-self-center mx-2"
                :key="action"
              >
                <a
                  @click="deleteConfirm"
                  v-b-tooltip.hover
                  :title="capitalize(action)"
                >
                  <i :class="'glyph-icon simple-icon-trash'" />
                </a>
              </div>
              <div
                v-if="action === 'print'"
                class="pl-1 align-self-center mx-2"
                :key="action"
              >
                <a v-b-tooltip.hover :title="capitalize(action)">
                  <i :class="'glyph-icon simple-icon-printer'" />
                </a>
              </div>
            </template>

            <div
              class="custom-control custom-checkbox pl-1 align-self-center ml-2"
            >
              <b-form-checkbox
                @change="toggleItem($event, data.id)"
                :checked="selectedItems.includes(data.id)"
                class="itemCheck mb-0"
              />
            </div>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
export default {
  props: ["data", "selectedItems", "fields", "actions", "options", "index"],
  data: () => ({
    boxOne: "",

    link: null
  }),
  methods: {
    formatDate(date) {
      const newDate = new Date(date);
      let formattedDate = `${newDate.getDate()}/${newDate.getMonth() +
        1}/${newDate.getFullYear()}`;
      return formattedDate;
    },
    getLink() {
      if (this.data.download_url) {
        this.link = this.data.download_url;
        return;
      }

      if (this.protocolloField) {
        const { tipo_di_file, protocollo_file } = this.data;
        if (!protocollo_file) {
          console.log("Protocollo File does not exist");
          return;
        }
        if (!tipo_di_file) {
          console.log("Tipo di File does not exist");
          return;
        }
        const linkFormatted = file.link
          .replace("{protocollo_file}", protocollo_file)
          .replace("{tipo_di_file}", tipo_di_file.toLowerCase());
        const entryPoint = `https://peakfood.condivision.cloud`;
        this.link = entryPoint + linkFormatted;
      }
    },
    openNewModal() {
      const payload = {
        id: this.data.id,
        modal: "distintabasemodal"
      };
      this.$emit("open-diba-modal", payload);
    },
    getOption(value) {
      if (isNaN(Number(value)) && typeof value === "string") {
        return value;
      } else if (isNaN(Number(value)) && typeof value === "object") {
        const option = this.options.find(option => option.id === value.id);
        if (option && option) {
          return option.label;
        } else {
          return "";
        }
      } else if (!isNaN(Number(value))) {
        console.log("3");
        const option = this.options.find(option => option.id === value);
        if (option && option) {
          return option.label;
        } else {
          return "";
        }
      }
    },
    deleteConfirm() {
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
            this.$emit("delete-item", this.data.id);
          }
        })
        .catch(err => {
          // An error occurred
          console.log("error", err);
        });
    },
    decodeHTML(html) {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    },
    toggleItem(event, itemId) {
      this.$emit("toggle-item", event, itemId);
    },
    modifyItem(event, item) {
      this.$emit("modify-item", event, item);
    },
    deleteItem() {},
    copyItem(event, item) {
      this.$emit("copy-item", event, item);
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
    },
    getHeaderWidth(index) {
      return { "w-10": true };
    },
    getWidth(index, field) {
      if (this.isPeak) {
        return { "w-10": true, "pr-4": true };
      }

      return { "flex-grow-1": true };
    },
    showHeader({ field }) {
      if (field === "ingredients") {
        return false;
      } else if (field === "actions") {
        return false;
      } else if (field === "categoria_vendita") {
        return false;
      } else if (field === "favorite") {
        return false;
      } else {
        return true;
      }
    }
  },
  computed: {
    protocolloField() {
      return this.fields.find(field => field.field === "protocollo_file");
    },
    isPeak() {
      if (this.$store.getters.getHost === "peakfood.condivision.cloud") {
        return true;
      } else {
        return false;
      }
    },
    columnWith() {
      const width = Math.floor(100 / this.fields.length);
      return width.toString();
    },
    localFields() {
      let fields = [...this.fields];
      fields = fields.filter(field => Number(field.in_list) > 0);
      let fieldsSorted = fields.sort((a, b) =>
        a.in_list > b.in_list ? 1 : b.in_list > a.in_list ? -1 : 0
      );
      return fieldsSorted;
    }
  },
  watch: {
    data() {
      this.$forceUpdate();
    }
  },
  created() {
    this.getLink();
  }
};
</script>

<style>
.modal-backdrop {
  opacity: 0.5;
}
</style>
