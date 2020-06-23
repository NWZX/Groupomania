<template>
  <div class="container-flex">
    <div class="raw justify-content-center">
      <input
        id="username"
        type="text"
        class="col-8"
        placeholder="Nom d'utilisateur"
      >
    </div>
    <div class="raw justify-content-center">
      <input
        id="password"
        type="password"
        class="col-8"
        placeholder="Mot de passe"
      >
    </div>
    <div class="raw justify-content-center">
      <input
        id="password-confirmation"
        type="password"
        class="col-8"
        placeholder="Confirmer le mot de passe"
      >
    </div>
    <div class="raw justify-content-center">
      <button
        id="validate"
        class="col-8 bg-light ms-depth-8"
      >
        Valider
      </button>
    </div>
  </div>
</template>