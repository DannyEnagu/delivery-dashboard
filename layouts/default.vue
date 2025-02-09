<template>
    <div class="flex">
      <div class="toolbar bg-white">
        <div class="flex flex-column align-items-center">
          <img
            src="~/assets/img/logo.png"
            alt="logo"
            class="h-3rem w-3rem mx-auto"
          />
          <p class="font-bold">Trackr</p>
        </div>
      </div>
      <div class="flex-1">
        <slot />
      </div>
    </div>
</template>

<style scoped>
  .toolbar {
    width: 80px;
    height: 100vh;
    padding-top: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
</style>