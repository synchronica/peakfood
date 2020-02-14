<template>
<!-- <p>{{ ingredients }}</p> -->
  <b-modal
    :id="`contains-ingredients-modal`"
    :ref="`contains-ingredients-modal`"
    title="Acquisisci Ricetta"
    size="sm"
    footer-class="py-3 pr-3"
    class="ma-0 pa-0 pl-0 pr-0 text-center">
    <b-container>
      <b-row class="justify-content-center">
        <p>{{ ingredients }}</p>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
export default {
  props: ['ingredients']
}
</script>
