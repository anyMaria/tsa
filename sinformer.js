const open1 = document.getElementById("btnun");
const close1 = document.getElementById("fermer");
const modal1 = document.getElementById("modalun");

const open2 = document.getElementById("btndeux");
const close2 = document.getElementById("fermerdeux");
const modal2 = document.getElementById("modaldeux");

const open3 = document.getElementById("btntrois");
const close3 = document.getElementById("fermertrois");
const modal3 = document.getElementById("modaltrois");

const open4 = document.getElementById("btnquatre");
const close4 = document.getElementById("fermerquatre");
const modal4 = document.getElementById("modalquatre");

open1.addEventListener("click", () => modal1.classList.add("ouvert"));
close1.addEventListener("click", () => modal1.classList.remove("ouvert"));

open2.addEventListener("click", () => modal2.classList.add("ouvert"));
close2.addEventListener("click", () => modal2.classList.remove("ouvert"));

open3.addEventListener("click", () => modal3.classList.add("ouvert"));
close3.addEventListener("click", () => modal3.classList.remove("ouvert"));

open4.addEventListener("click", () => modal4.classList.add("ouvert"));
close4.addEventListener("click", () => modal4.classList.remove("ouvert"));
