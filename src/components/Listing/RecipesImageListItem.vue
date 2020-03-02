<template>
  <b-card
    :img-src="recipeImage"
    img-alt="Image"
    img-top
    class="rounded h-100 recipe"
    :class="{'active' : selectedItems.includes(data.id)}"
    no-body
  >
    <div class="position-relative">
      <b-badge
        pill
        variant="primary"
        class="position-absolute badge-top-left justify-self-start"
      >{{ data.categoria_ricetta.toUpperCase() }}</b-badge>
    </div>
    <div style="height: 40px;" class="d-flex w-100 justify-content-end pt-2 pr-2">
      <b-tooltip target="active" title="Online!"></b-tooltip>
      <a
        id="active"
        @click="toggleAttivo"
        style="cursor: pointer"
        class="mr-2"
        v-b-tooltip.hover
        title="Attivo"
      >
        <i
          style="font-size:20px;"
          :style="{color: data.attivo === '1' ? 'green' : 'red'}"
          class="simple-icon-bulb"
        />
      </a>
      <a
        v-if="data.acquisita === '0'"
        @click="handleSetRecipe"
        style="cursor: pointer"
        v-b-tooltip.hover
        title="Acquisisci Ricetta"
      >
        <i style="font-size:20px; color: red;" class="simple-icon-plus" />
      </a>
      <i
        v-else
        style="font-size:20px; color: green;"
        class="simple-icon-check"
        v-b-tooltip.hover
        title="Questa Ricetta è presente nel tuo Food Cost"
      />
    </div>
    <b-card-body>
      <b-row>
        <b-colxx xxs="12" class="mb-0">
          <!-- CARD ITEMS -->
          <b-row :key="'r-'+index">
            <b-container>
              <a style="cursor: pointer;" @click="getIngredients(data)">
                <h3 style="display: inline" class="mb-1 w-sm-100" v-html="decodeHTML(data.nome)" />
              </a>

              <p class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(data.note)" />
            </b-container>
          </b-row>
        </b-colxx>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<script>
import { listItemMixin } from '@/mixins/listItemMixin'
// import IngredientsModal from '@/components/Modals/IngredientsModal'
import axios from 'axios'

export default {
  props: ['data', 'selectedItems', 'fields', 'actions', 'options', 'index'],
  // components: {
  //   IngredientsModal
  // },
  mixins: [listItemMixin],
  data () {
    return {
      ingredients: []
    }
  },
  methods: {
    toggleAttivo () {
      let attivo = null
      if (this.data.attivo === '1') {
        attivo = '0'
      } else {
        attivo = '1'
      }
      const payload = { id: this.data.id, attivo }
      this.$emit('toggle-attivo', payload)
    },
    openModal (id) {
      console.log('id', id)
      this.$bvModal.show(id)
    },
    async getIngredients (data) {
      try {
        const { id, nome } = data
        // let ingredients = []
        this.$emit('ingredients-loading', data)
        this.openModal('modal-1')
        const response = await axios.get(
          `https://${this.host}/v3.0/?diba_market&token=1&ricetta_id=${id}`
        )
        console.log('recipe', response)

        let ingredients = response.data.data

        ingredients.forEach((ingredient, index) => {
          const costo = (
            Number(ingredient.quantita) * Number(ingredient.netto)
          ).toFixed(2)
          ingredients[index].costo = costo
        })
        // const recipeId = response.data.id
        const { descrizione } = response.data
        const footer = {
          text: response.data.price_info,
          color: response.data.color
        }

        if (ingredients.length < 1) {
          this.$emit('ingredients-loading', false)
          const payload = {
            message: 'Nessun ingrediente trovato'
          }
          throw payload
        }

        if (ingredients.length !== 0) {
          this.$emit(
            'ingredients-fetch',
            nome,
            ingredients,
            descrizione,
            footer,
            id
          )
        }
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
    },
    handleSetRecipe () {
      this.$emit('handle-set-recipe', this.data.id)
    },
    showHeader ({ field }) {
      if (field === 'ingredients') {
        return false
      } else if (field === 'actions') {
        return false
      } else if (field === 'categoria_vendita') {
        return false
      } else {
        return true
      }
    },
    toggleFavorite () {
      this.$emit('handle-favorite', this.data)
    },
    openDistintaBase () {
      const payload = {
        id: this.data.id,
        item: this.data,
        modal: 'distintabasemodal'
      }
      this.$emit('open-diba-modal', payload)
    },
    getHeaderWidth (index) {
      return { 'w-15': true }
    },
    getWidth (index) {
      return { 'w-15': true }
    },
    showField (field) {
      if (field.field !== 'categoria_vendita') {
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    axios () {
      return this.$store.getters.getAxios
    },
    recipeImage () {
      const category = this.data.categoria_ricetta
      if (category === 'Secondi') {
        return '/assets/img/secondi.jpg'
      }
      if (category === 'Primi') {
        return '/assets/img/primi.jpg'
      }
      if (category === 'Dessert') {
        return '/assets/img/dessert.jpg'
      }
      if (category === 'Antipasti') {
        return '/assets/img/antipasti.jpg'
      }
      if (category === 'Contorni') {
        return '/assets/img/contorni.jpg'
      }
      if (category === 'Glutine') {
        return '/assets/img/glutine.jpg'
      }
      if (category === 'Crostacei') {
        return '/assets/img/crostacei.jpg'
      }
      return this.data.img_ricetta
    },
    host () {
      return this.$store.state.host
    },
    inList () {
      return this.fields.filter(field => Number(field.in_list > 0))
    },
    isFavorite () {
      return this.data.favorite
    },
    localFields () {
      let fields = [...this.fields]
      let fieldsSorted = fields.filter(field => {
        if (field.field === 'favorite') {
          return field
        }
        if (Number(field.in_list) > 0) {
          return field
        }
      })
      fieldsSorted = fieldsSorted.sort((a, b) =>
        a.in_list > b.in_list ? 1 : b.in_list > a.in_list ? -1 : 0
      )

      let calc = (
        Number(this.data.food_sell_actual) - Number(this.data.food_cost)
      ).toFixed(2)

      fieldsSorted.push({ field: 'margine', value: String(calc) })
      fieldsSorted.push({ field: 'actions' })
      return fieldsSorted
    }
  }
}
</script>

<style scoped>
.card-img-top {
  min-height: 178px;
}
</style>
