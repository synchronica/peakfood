<template>
  <b-modal
    id="distintabasemodal"
    ref="distintabasemodal"
    size="lg"
    body-class="new-modal"
  >
    <template slot="modal-title">
      <b-container>
        <b-row>
          <h1 style="padding-bottom: 0px; margin-bottom: 0px; width: 100%;">
            {{ title }}
          </h1>
          <b-row class="w-100 mt-2">
            <b-col lg="6">
              <h5 style="padding-bottom: 0px; margin-bottom: 0px; width: 100%;">
                Distinta Base per...
                <b-form-input
                  id="portions"
                  class="w-20 d-inline mr-2 ml-2"
                  size="sm"
                  :formatter="toDot"
                  @change="handleFieldChange"
                  v-model="dibaItem.quantita_prodotta"
                />porzioni
              </h5>
            </b-col>
            <b-col lg="6">
              <h5>
                Tempo di preparazione
                <b-form-input
                  class="w-20 d-inline mr-2 ml-2"
                  size="sm"
                  :formatter="toDot"
                  @change="handleFieldChange"
                  v-model="dibaItem.tempo_di_preparazione"
                />min
              </h5>
            </b-col>
          </b-row>
          <!-- <h5 style="padding-bottom: 0px; margin-bottom: 0px; width: 100%;">
            Distinta Base per n.
            <b-form-input
              id="portions"
              class="mr-2"
              size="sm"
              :formatter="toDot"
              @change="handleFieldChange"
              v-model="dibaItem.quantita_prodotta"
            />porzioni
          </h5>
          <h5>
            <b-input-group prepend="Tempo di preparazione" append="min">
              <b-form-input
                :formatter="toDot"
                @change="handleFieldChange"
                v-model="dibaItem.tempo_di_preparazione"
              ></b-form-input>
            </b-input-group>
          </h5>-->
        </b-row>
      </b-container>
    </template>
    <b-form @submit.prevent="addIngredient">
      <b-card class="ma-0 px-4 py-4 search-header-border" no-body>
        <b-row>
          <b-col md="5">
            <b-button
              size="xs"
              :variant="searchIngredientToggle"
              @click="createIngredient = false"
              >Cerca</b-button
            >
            <b-button
              size="xs"
              :variant="createIngredientToggle"
              @click="createIngredient = true"
              >Crea Nuovo</b-button
            >
            <v-select
              v-if="createIngredient === false"
              class="mt-1"
              label="title"
              @search="onSearch"
              :options="optionsFetched"
              v-model="search"
              placeholder="Seleziona un ingrediente"
            >
              <template slot="no-options">
                <div v-html="searchMessage" />
              </template>
            </v-select>
            <b-input v-else class="mt-1" v-model="newIngredient.title" />
            <small v-if="ingredientInvalid" style="color: red"
              >Ingrediente richiesto</small
            >
          </b-col>
          <b-col md="3">
            <label for>UM</label>
            <v-select
              :options="measureUnits"
              :reduce="measureUnit => measureUnit.label"
              v-model="newIngredient.measureUnit"
            />
            <!-- <b-input :formatter="toUpper" v-model="newIngredient.measureUnit"/> -->
          </b-col>
          <b-col md="2">
            <label for>Prezzo</label>
            <b-input :formatter="toDot" v-model="newIngredient.netto" />
          </b-col>
          <b-col md="2">
            <label for>Quantita</label>
            <b-input :formatter="toDot" v-model="newIngredient.quantity" />
          </b-col>
        </b-row>
        <b-row class="mt-4">
          <b-col class="justify-self-end">
            <b-button block type="submit" variant="outline-primary"
              >Aggiungi</b-button
            >
            <!-- <b-button v-else @click="addIngredient(true)" variant="primary">Crea Ingrediente</b-button> -->
          </b-col>
        </b-row>
      </b-card>
      <b-card class="ma-0 px-4 py-4" no-body>
        <b-row class="ingredients-table">
          <b-table
            id="ingredients-table"
            :fields="fields"
            :items="tableData"
            :busy="isBusy"
            show-empty
            responsive
          >
            <template v-slot:table-busy>
              <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Caricando...</strong>
              </div>
            </template>
            <template v-slot:empty>
              <div class="text-center text-danger my-2">
                <strong>Nessun ingrediente trovato...</strong>
              </div>
            </template>
            <template v-slot:cell(actions)="data">
              <b-button
                variant="empty"
                class="px-0 py-0"
                @click="removeIngredient(data.item.id)"
              >
                <i class="simple-icon-trash" />
              </b-button>
            </template>
          </b-table>
        </b-row>
      </b-card>
    </b-form>
    <template slot="modal-footer">
      <b-container>
        <b-row class="d-flex flex-grow-1">
          <!-- <b-col lg="5">
            <b-input-group prepend="Tempo di preparazione" append="min">
              <b-form-input
                :formatter="toDot"
                @change="handleFieldChange"
                v-model="dibaItem.tempo_di_preparazione"
              ></b-form-input>
            </b-input-group>
          </b-col>-->
          <b-col class="pr-0 align-self-end">
            <p class="total-cost text-right mb-0">
              <strong>Food Cost {{ dibaItem.food_cost }} €</strong>
            </p>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </b-modal>
</template>

<script>
import vSelect from "vue-select";
import axios from "axios";

export default {
  props: ["id", "item", "isSoftDelete"],
  components: {
    vSelect
  },
  data: () => ({
    searchOptions: [],
    dibaItem: {},
    newIngredient: {
      title: null,
      measureUnit: null,
      netto: null,
      quantity: 1
    },
    ingredientToEdit: {
      name: null,
      measureUnit: null,
      netto: null,
      quantity: null
    },
    deleteLink: "",
    createIngredient: false,
    isBusy: false,
    search: null,
    searchMessage: "Inserisci almeno tre lettere",
    optionsFetched: [],
    tableData: [],
    measureUnits: [],
    fields: [
      {
        key: "title",
        label: "Elenco ingredienti"
      },
      {
        key: "measureUnit",
        label: "UM"
      },
      {
        key: "quantity",
        label: "Quantita"
      },
      {
        key: "netto",
        label: "Netto"
      },
      {
        key: "note",
        label: "Nota"
      },
      {
        key: "cost",
        label: "Costo €"
      },
      {
        key: "actions",
        label: ""
      }
    ],
    options: [],
    ingredientInvalid: false
  }),
  created() {
    this.getUM();
  },
  methods: {
    async getUM() {
      try {
        const formData = new FormData();
        formData.set("list_values", "unita_di_misura");
        // formData.set('listalues', element)

        const res = await this.axios.post("/api/ListValues", formData);
        // const apiBase = "https://" + this.$store.getters.getHost + "/v3.0/";
        // const filterSelectOptionsEndpoint = `${apiBase}?list_values=unita_di_misura&token=1`;

        // const response = await axios.get(filterSelectOptionsEndpoint);
        console.log("UM", res);
        this.measureUnits = res.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    toUpper(value, event) {
      return value.toUpperCase();
    },
    handleFieldChange() {
      this.handleFoodCost();
      this.$emit("update-diba-field", this.dibaItem);
    },
    handleFoodCost() {
      const quantity = Number(this.dibaItem.quantita_prodotta);
      let total = 0;
      this.tableData.map(data => {
        total += Number(data.cost);
      });
      if (quantity > 0 && !isNaN(quantity)) {
        this.dibaItem.food_cost = String((total / quantity).toFixed(2));
      } else {
        this.dibaItem.food_cost = String(total.toFixed(2));
      }
    },
    toDot(value, event) {
      console.log(value);
      return value.replace(",", ".");
    },
    log(data) {
      console.log("test", data);
    },
    onSearch(search, loading) {
      this.optionsFetched = [];
      if (search && search.length > 2) {
        loading(true);
        const options = this.options.filter(option => {
          if (
            option.title.toLowerCase().includes(search.toLowerCase()) ||
            option.measureUnit.toLowerCase().includes(search.toLowerCase())
          ) {
            console.log("option", option);
            return option;
          }
        });
        if (options.length > 0) {
          this.optionsFetched = options;
          loading(false);
        } else {
          this.searchMessage = "Nessun ingrediente trovato";
          loading(false);
        }
      } else {
        this.searchMessage = "Inserisci almeno tre lettere";
        loading(false);
      }
    },
    async getTableIngredients(id) {
      this.isBusy = true;
      this.tableData = [];
      let formData = new FormData();
      formData.set("data_provider", "6");
      formData.set("ricetta_id", id);
      try {
        const response = await this.axios.post("/api/DataProvider", formData);

        formData = new FormData();
        formData.set("data_provider", "4");
        formData.set("sort", "ingrediente");
        formData.set("per_page", "50");

        const responseIngredients = await this.axios.post(
          "/api/DataProvider",
          formData
        );
        console.log("ingredients", response);
        this.deleteLink = await response.data.delete;
        const data = await response.data.data;
        const ingredients = await responseIngredients.data.data;

        for (const doc of ingredients) {
          this.options.push({
            id: doc.id,
            title: doc.ingrediente,
            measureUnit: doc.unita_di_misura,
            netto: Number(doc.prezzo_netto).toFixed(2)
          });
        }

        for (const doc of data) {
          const costo = (Number(doc.quantita) * Number(doc.netto)).toFixed(2);
          const ingredient = ingredients.find(
            ingredient => ingredient.id === doc.materia_id
          );
          this.tableData.push({
            id: doc.id,
            title: ingredient ? ingredient.ingrediente : "",
            note: doc.nota,
            measureUnit: doc.unita_di_misura,
            quantity: Number(doc.quantita).toFixed(2),
            netto: Number(doc.netto).toFixed(2),
            cost: costo
          });
        }
        this.handleFoodCost();
        this.isBusy = false;
      } catch (error) {
        const type = "error filled";
        const title = "C'è stato un problema";
        const message = error.message;
        this.$notify(type, title, message, {
          duration: 3000,
          permanent: false
        });
        this.isBusy = false;
      }
    },
    async getOptionIngredients(id) {
      this.options = [];
      let formData = new FormData();
      formData.set("data_provider", id);
      formData.set("sort", "ingrediente");
      formData.set("per_page", "50");

      try {
        const response = await this.axios.post("/api/DataProvider", formData);

        console.log("options", response);
        const data = await response.data.data;

        for (const doc of data) {
          this.options.push({
            id: doc.id,
            title: doc.ingrediente,
            measureUnit: doc.unita_di_misura,
            netto: Number(doc.prezzo_netto).toFixed(2)
          });
        }
      } catch (error) {
        const type = "error filled";
        const title = "C'è stato un problema";
        const message = error.message;
        this.$notify(type, title, message, {
          duration: 3000,
          permanent: false
        });

        this.isBusy = false;
      }
    },
    async addIngredient(addToDiBa = false) {
      this.ingredientInvalid = false;
      if (!this.newIngredient.title) {
        this.ingredientInvalid = true;
        return;
      }
      const moduleId = addToDiBa ? 6 : 4;
      const formData = new FormData();
      let {
        id,
        name,
        title,
        measureUnit,
        netto,
        quantity
      } = this.newIngredient;
      formData.set("id", 0);
      formData.set("ricetta_id", this.id);
      formData.set("materia_id", id);
      formData.set("unita_di_misura", measureUnit);
      formData.set("netto", netto);
      formData.set("quantita", quantity);
      formData.set("update", moduleId);

      try {
        this.isBusy = true;
        const response = await this.axios.post("/api/InsertUpdate", formData);

        const cost = (Number(quantity) * Number(netto)).toFixed(2);
        const ingredient = {
          title: name || title,
          measureUnit,
          netto: netto,
          quantity: Number(quantity).toFixed(2),
          cost
        };
        this.tableData.unshift(ingredient);
        if (addToDiBa) {
          this.getOptionIngredients(4);
        }
        this.handleFoodCost();
        this.handleFieldChange();
        this.isBusy = false;
        console.log("add", response);
      } catch (error) {
        console.log(error);
      }
    },
    async removeIngredient(id) {
      this.$bvModal
        .msgBoxConfirm("Sicuro di voler eliminare?", {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "SÌ",
          cancelTitle: "Anulla",
          footerClass: "p-2"
        })
        .then(async value => {
          if (value) {
            this.isBusy = true;
            console.log("worked");

            // if (id) {
            //   ids.push(id)
            // }
            // const formData = new FormData()
            // formData.set('delete', this.moduleId)
            // ids.forEach((val, index) => {
            //   formData.set(`ids[${index}]`, val)
            // })
            // if (ids.length > 0) {
            //   try {
            //     const response = await this.axios.post(
            //       '/api/DeleteItem',
            //       formData
            //     )
            //     console.log('deleteResponse', response)
            //     this.items = this.items.filter(item => {
            //       return ids.indexOf(item.id) === -1
            //     })
            //     this.selectedItems = []
            //   } catch (error) {
            //     console.log(error)
            //   }
            // }
            const formData = new FormData();
            formData.set(
              "delete",
              this.$store.state.modulesManager.module_tab_id
            );

            formData.set("ids[0]", id);

            try {
              const response = await this.$store.state.axios.post(
                "/api/DeleteItem",
                formData
              );
              console.log("remove", response);
              this.tableData = this.tableData.filter(data => data.id !== id);
              this.handleFoodCost();
              this.handleFieldChange();

              this.isBusy = false;
            } catch (error) {
              console.log(error);
            }

            // try {
            //   const response = await axios.post(
            //     `https://${this.host}/v3.0/${this.deleteLink}&token=1`,
            //     formData,
            //     { headers: { 'Content-Type': 'multipart/form-data' } }
            //   )

            //   console.log('remove', response)
            //   this.tableData = this.tableData.filter(data => data.id !== id)
            //   this.handleFoodCost()
            //   this.handleFieldChange()

            //   this.isBusy = false
            // } catch (error) {
            //   console.log(error)
            // }
          }
        })
        .catch(err => {
          // An error occurred
          console.log("error", err);
        });
    },
    async updateIngredient() {
      const {
        index,
        id,
        measureUnit,
        netto,
        note,
        quantity
      } = this.ingredientToEdit;
      const formData = new FormData();
      formData.set("id", id);
      formData.set("ricetta_id", this.id);
      formData.set("unita_di_misura", measureUnit);
      formData.set("netto", netto);
      formData.set("quantita", quantity);

      try {
        const response = await axios.post(
          `https://${this.host}/v3.0/?update=6&token=1`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const cost = (Number(quantity) * Number(netto)).toFixed(2);
        const ingredient = {
          cost,
          id,
          measureUnit,
          netto,
          note,
          quantity
        };
        this.tableData[index] = Object.assign(
          this.tableData[index],
          ingredient
        );
        this.handleFoodCost();
        this.handleFieldChange();

        this.$bvModal.hide("editingredientmodal");
        console.log("update", response);
      } catch (error) {
        console.log(error);
      }
    },
    editIngredient({ item, index }) {
      console.log("ingredientToEdit", item, index);
      this.ingredientToEdit = Object.assign(this.ingredientToEdit, item);
      this.ingredientToEdit.index = index;
      this.$bvModal.show("editingredientmodal");
    },
    resetForm(form) {
      this[form] = {};
    }
  },
  computed: {
    axios() {
      return this.$store.getters.getAxios;
    },
    title() {
      if (this.item) {
        return this.item.nome;
      }
      return "";
    },
    createIngredientToggle() {
      if (this.createIngredient) {
        return "primary";
      } else {
        return "light";
      }
    },
    searchIngredientToggle() {
      if (this.createIngredient) {
        return "light";
      } else {
        return "primary";
      }
    },
    hasQuantitaProdotta() {
      if (this.dibaItem.quantita_prodotta) {
        return true;
      } else {
        return false;
      }
    },
    query() {
      return `&sort=id&per_page=50&search=`;
    },
    host() {
      return this.$store.getters.getHost;
    }
  },
  watch: {
    id() {
      this.getTableIngredients(this.id);
    },
    search() {
      if (this.search !== null) {
        this.newIngredient = Object.assign(this.newIngredient, this.search);
      }
    },
    item() {
      this.dibaItem = this.item;
      this.handleFoodCost();
    }
  }
};
</script>

<style>
.new-modal {
  padding: 0 !important;
}
.new-item-link {
  color: #f18024;
}
.search-label {
  margin-bottom: 0.4rem;
}
.search-header-border {
  border-bottom: 1px solid #d7d7d7;
}
.total-cost {
  width: 100%;
}
.ingredients-table {
  overflow-y: auto;
  height: 280px;
}
.ingredients-table .vuetable tr td,
.ingredients-table .vuetable tr th {
  padding-top: 0.45em !important;
  padding-bottom: 0.45em !important;
}

#distintabasemodal___BV_modal_footer_ {
  padding: 1rem;
}

#portions {
  display: inline;
  width: 35px;
}

.modal-title {
  width: 100%;
}

.small-input {
  width: 50px;
}
</style>
