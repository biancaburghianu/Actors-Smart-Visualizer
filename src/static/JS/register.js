const registerForm = document.getElementById("form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password-input").value;
  const favorite = document.getElementById("favorite").value;
  if (password.length < 10 || favorite.length < 3) {
    alert(
      "Parola trebuie sa aiba minim 10 caractere, iar numele actritei/actorului/serialului/filmului trebuie sa aiba minim 3 caractere!"
    );
  } else createAccount();

  async function createAccount() {
    try {
      const response = await fetch("http://localhost:3456/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, favorite }),
      });
      console.log(favorite);
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password-input");
  const eyeIcon = document.getElementById("eye");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.remove("fa-eye");
    eyeIcon.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("fa-eye-slash");
    eyeIcon.classList.add("fa-eye");
  }
}
