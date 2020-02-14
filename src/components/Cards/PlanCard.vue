<template>
  <b-colxx class="mx-auto" md="4" :key="plan.id">
    <b-card
      class="rounded mb-4 "
      header-class="mx-auto"
      :title="toHtml(plan.name)"
      :sub-title="toHtml(plan.description)">
      <b-container class="justify-content-center">
        <b-row class="flex-column py-2 px-2 my-4 align-items-center">
          <h3 style="font-size: 2rem; text-align: center;" :class="{'free-plan': plan.id === '1'}">{{ selectedPlan.plan_price ? selectedPlan.plan_price : plan.bill_options[0].plan_price }} {{ plan.currency }}</h3>
          <p>{{ plan.price_terms }}</p>
          <p>{{ plan.bill_terms }}</p>
          <b-button-group class="mb-2">
            <b-button variant="primary" v-for="(billOption, index) in plan.bill_options" @click="selectedPlan = billOption" :pressed="selectedPlan.plan_id === billOption.plan_id" :key="`b-${billOption.plan_id}-${index}`">{{ billOption.plan_label }}</b-button>
          </b-button-group>
        </b-row>
        <b-row class="justify-content-end mt-2">
          <b-btn v-if="isSent" @click="handleSetPlan" block>{{ plan.button_label }}</b-btn>
          <b-btn v-else @click="handleSetPlan" block><b-spinner /></b-btn>
        </b-row>
      </b-container>
      <template v-slot:footer>
        <span id="footer" v-html="toHtml(plan.footer)" />
      </template>
    </b-card>
  </b-colxx>
</template>

<script>
import axios from 'axios'
import { instance } from '@/axiosInstance'

export default {
  props: {
    plan: Object
  },
  data () {
    return {
      selectedPlan: {},
      isSent: true
    }
  },
  computed: {
    host () {
      return this.$store.state.host
    }
  },
  methods: {
    toHtml (text) {
      let txt = document.createElement('textarea')
      txt.innerHTML = text
      return txt.value
    },
    async handleSetPlan () {
      if (!this.selectedPlan.plan_label) {
        alert('Please select a plan')
      } else {
        this.isSent = false
        // try {

        try {
          const formData = new FormData()

          formData.set('item_type', this.selectedPlan.item_type)
          formData.set('plan_id', this.selectedPlan.plan_id)
          const response = await instance.post('/api/GetPlans')
          console.log('setPlanResponse', response)

          if (response.data.status) {
            let plan = JSON.stringify(this.selectedPlan)
            plan = JSON.parse(plan)
            plan.name = this.plan.name
            this.$store.commit('setSelectedPlan', plan)
            this.$router.push(response.data.redirect)
          } else {
            const type = 'error filled'
            const title = "C'è stato un problema"
            const message = 'Problema x'
            this.$notify(type, title, message, {
              duration: 3000,
              permanent: false
            })
          }

          this.isSent = true
        } catch (error) {
          const type = 'error filled'
          const title = "C'è stato un problema"
          const message = error.message
          this.$notify(type, title, message, {
            duration: 3000,
            permanent: false
          })

          this.isSent = true
        }

        //   const response = await axios.post(
        //     `https://${this.host}/v3.0/?add_item&token=1`,
        //     formData,
        //     {
        //       headers: {
        //         'Content-Type': 'multipart/form-data'
        //       }
        //     })

        //   if (response.data.status) {
        //     let plan = JSON.stringify(this.selectedPlan)
        //     plan = JSON.parse(plan)
        //     plan.name = this.plan.name
        //     this.$store.commit('setSelectedPlan', plan)
        //     this.$router.push(response.data.redirect)
        //   } else {
        //     const type = 'error filled'
        //     const title = "C'è stato un problema"
        //     const message = 'Problema x'
        //     this.$notify(type, title, message, {
        //       duration: 3000,
        //       permanent: false
        //     })
        //   }

        //   console.log('setPlanResponse', response)
        //   this.isSent = true
        // } catch (error) {
        //   const type = 'error filled'
        //   const title = "C'è stato un problema"
        //   const message = error.message
        //   this.$notify(type, title, message, {
        //     duration: 3000,
        //     permanent: false
        //   })

        //   this.isSent = true
        // }
      }
      this.selectedPlan = {}
    }
  },
  created () {
    this.selectedPlan = this.plan.bill_options[0]
  }
}
</script>

<style scoped>

.card-title {
  margin-bottom: .5rem;
}

.card-title,
.card-subtitle {
  text-align: center
}
.free-plan {
  margin-bottom: 3rem;
}
</style>
