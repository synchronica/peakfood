<template>
<div>
  <TopNav />
  <b-container class="mt7">
    <b-row class="mx-auto">
      <b-colxx v-if="terms.length > 1" &&  class="mx-auto" md="12">
        <Terms v-for="(term, index) in terms" :term="term" :key="index" />
      </b-colxx>
      <b-colxx v-else-if="terms.length === 1"  class="mx-auto" md="12">
        <Terms :term="terms[0]"/>
      </b-colxx>
    </b-row>
  </b-container>
</div>
</template>

<script>
import axios from 'axios'
import Terms from '@/components/Form/Terms'
import TopNav from '@/containers/TopNav'
import { localHost } from '@/constants/config'

export default {
  components: {
    Terms,
    TopNav
  },
  data () {
    return {
      buttonText: 'Accetta',
      terms: []
    }
  },
  methods: {
    async getTerms () {
      let host = location.hostname
      if (host === 'localhost') {
        host = localHost
      }
      try {
        const response = await axios.get(
          `https://${host}/v3.0/?get_terms`
        )
        console.log('terms', response)
        if (response.data.data) {
          this.terms = response.data.data
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
    }
  },
  mounted () {
    this.getTerms()
  }
}
</script>

<style scoped>
  .card-title {
    margin-bottom: .5rem;
  }
  .vh-100 {
    height: 100vh;
  }
  .mt7 {
    margin-top: 7rem;
  }
</style>
