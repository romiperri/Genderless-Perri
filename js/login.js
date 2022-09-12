
const btnRegistro = document.getElementById("btn-registro")

btnRegistro.addEventListener("click", () => {
    Toastify({
        text: "¡Bienvenida/o, gracias por ser parte de Genderless!",
        duration: 4000,
        style: {
            color: "white",
            background: "black",
        },
    }).showToast();
});
