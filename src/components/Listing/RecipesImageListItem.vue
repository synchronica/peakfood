<template>
  <b-card
    :img-src="data.img_ricetta"
    img-alt="Image"
    img-top
    class="rounded h-100" :class="{'active' : selectedItems.includes(data.id)}" no-body>
    <div class="position-relative">
      <b-badge pill variant="primary" class="position-absolute badge-top-left justify-self-start">{{ data.categoria_ricetta.toUpperCase() }}</b-badge>
    </div>
    <div style="height: 40px;" class="d-flex w-100 justify-content-end pt-2 pr-2">
      <i v-if="data.acquisita === '1'"  style="font-size:20px; color: green;" class="simple-icon-check"/>
    </div>
    <b-card-body>
      <b-row>
        <b-colxx xxs="12" class="mb-0">
          <!-- CARD ITEMS -->
          <b-row :key="'r-'+index">
            <b-container>
              <a style="cursor: pointer;" @click="getIngredients(data.id)">
                <h3 class="mb-1 w-sm-100" v-html="decodeHTML(data.nome)"/>
              </a>

              <p class="mb-1 text-muted text-small w-sm-100" v-html="decodeHTML(data.note)"/>
            </b-container>
          </b-row>
        </b-colxx>
      </b-row>
    </b-card-body>
    <template v-slot:footer>
      <b-row>
        <b-container class="d-flex justify-content-center text-center">
          <a @click="handleSetRecipe" style="color: #f18024; cursor: pointer;">{{ data.acquisita === '1' ? 'Questa Ricetta è presente nel tuo Food Cost' : 'Acquisisci Ricetta' }}</a>
        </b-container>
      </b-row>
    </template>

  </b-card>
</template>
<script>
import { listItemMixin } from '@/mixins/listItemMixin'
import IngredientsModal from '@/components/Modals/IngredientsModal'
import axios from 'axios'

export default {
  props: ['data', 'selectedItems', 'fields', 'actions', 'options', 'index'],
  components: {
    IngredientsModal
  },
  mixins: [listItemMixin],
  data () {
    return {
      ingredients: []
    }
  },
  methods: {
    openModal (id) {
      console.log('id', id)
      this.$bvModal.show(id)
    },
    async getIngredients (id) {
      try {
        let ingredients = []
        this.$emit('ingredients-loading')
        this.openModal('modal-1')
        const response = await axios.get(
          `https://${this.host}/v3.0/?data_provider=6&token=1&filters&ricetta_id=${id}`
        )
        console.log('recipe', response)

        let ingredientsResponse = await response.data.data
        console.log('ingredientsResponse', ingredientsResponse)
        for (let index = 0; index < ingredientsResponse.length; index++) {
          console.log('index', ingredientsResponse[index])
          const materiaId = ingredientsResponse[index].materia_id
          // console.log('materiaId', materiaId)

          const responseIngredients = await axios.get(
            `https://${this.host}/v3.0/?data_provider=4&token=1&filters&id=${materiaId}`
          )
          console.log('responseIngredients', responseIngredients)
          ingredients.push(responseIngredients.data.data[0].ingrediente)
        }

        console.log('ingredients', ingredients)

        // if (ingredientsResponse.length !== 0) {
        this.$emit('ingredients-fetch', ingredients)
        // }
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
      fieldsSorted = fieldsSorted.sort((a, b) => (a.in_list > b.in_list) ? 1 : ((b.in_list > a.in_list) ? -1 : 0))

      let calc = (Number(this.data.food_sell_actual) - Number(this.data.food_cost)).toFixed(2)

      fieldsSorted.push({ field: 'margine', value: String(calc) })
      fieldsSorted.push({ field: 'actions' })
      return fieldsSorted
    }
  }
}
</script>

<style>
.modal-backdrop {
  opacity: 0.5;
}
</style>
