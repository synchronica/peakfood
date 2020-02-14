<template>
  <div>
    <TopNav />
    <main style="margin-left: 0; margin-right: 0;">
      <div class="loading" v-if="isBusy" />
      <b-container v-else class="mt-7">
        <b-row class="mb-4 text-center">
          <b-col md="12">
            <h1 class="pb-0">{{ title }}</h1>
          </b-col>
          <b-col class="" md="12">
            <h4>{{ subtitle }}</h4>
          </b-col>
        </b-row>
        <b-row v-if="plans.length > 0" class="mx-auto">
          <PlanCard v-for="plan in plans" :plan="plan" :key="plan.id"/>
        </b-row>
        <b-row style="margin-top: 1rem" class="mx-auto text-center">
          <p class="w-100 text-center" v-html="footer"></p>
        </b-row>
      </b-container>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import { localHost } from '@/constants/config'
import TopNav from '@/containers/TopNav'
import PlanCard from '@/components/Cards/PlanCard'

export default {
  components: {
    TopNav,
    PlanCard
  },
  data () {
    return {
      plans: [],
      buttonText: 'Scegli',
      title: '',
      subtitle: '',
      footer: '',
      text: '',
      selectedPlan: {},
      isBusy: true
    }
  },
  methods: {
    async getPlans () {
      this.isBusy = true
      let host = location.hostname
      if (host === 'localhost') {
        host = localHost
      }

      try {
        const response = await axios.get(
          `https://${host}/v3.0/?get_content&tag=plans&token=1`
        )
        console.log('plansContent', response)
        if (response.data.data) {
          const data = response.data.data[0]
          this.title = data.title
          this.subtitle = data.subtitle
          this.footer = data.footer
        }
        this.isBusy = false
      } catch (error) {
        const type = 'error filled'
        const title = "C'è stato un problema"
        const message = error.message
        this.$notify(type, title, message, {
          duration: 3000,
          permanent: false
        })
      }

      try {
        const response = await axios.get(
          `https://${host}/v3.0/?get_plans&token=1`
        )
        console.log('plans', response)
        if (response.data.data) {
          this.plans = response.data.data
        }
        this.isBusy = false
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
      this.isBusy = false
    }
  },
  created () {
    this.getPlans()
  }
}
</script>

<style scoped>
  .selected {
    border: .3rem #e7523e solid;
    border-radius: 1rem;
  }

  .vh-100 {
    height: 100vh;
  }
  .mt-7 {
    margin-top: 150px;
  }
</style>
