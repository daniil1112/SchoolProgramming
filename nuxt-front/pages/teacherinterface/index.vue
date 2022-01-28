<template>
    <div>
      <ul>
        <li><nuxt-link to="/teacherinterface/groups/all">Список групп</nuxt-link></li>
        <li><nuxt-link to="/teacherinterface/materials/interface">Уроки и материалы</nuxt-link></li>
        <li><nuxt-link to="/teacherinterface/materials/tests/new">Новый тест</nuxt-link></li>
      </ul>
    </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>

</style>
