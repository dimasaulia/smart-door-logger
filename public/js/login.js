const usernameForm = document.getElementById("username");
const passwordForm = document.getElementById("password");
const button = document.getElementById("login-btn");

button.addEventListener("click", async (e) => {
    e.preventDefault();
    const resp = await httpRequest({
        url: "/api/v1/user/login",
        body: {
            username: usernameForm.value,
            password: passwordForm.value,
        },
    });
    console.log(resp);

    if (resp.success === false) {
        alert(resp.errors);
    }
    if (resp.success === true) {
        window.location = "/";
    }
});
