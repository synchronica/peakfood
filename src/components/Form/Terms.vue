<template>
<div>
  <b-card
    class="rounded"
    :title="term.title"
    :sub-title="term.subtitle"
    :footer="term.footer"
    footer-tag="footer">
      <textarea class="mt-4 px-3 py-3 w-100" disabled rounded cols="30" rows="10">
        {{ term.text }}
      </textarea>

    </b-card>
    <b-row class="mt-4 mr-1 justify-content-end">
      <b-btn variant="success">{{ term.button_label }}</b-btn>
    </b-row>
</div>
</template>

<script>
export default {
  name: 'Terms',
  props: {
    term: Object
  },
  data () {
    return {
      terms: []
    }
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
</style>
