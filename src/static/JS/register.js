const registerForm = document.getElementById("form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password-input").value;
  const favorite = document.getElementById("favorite").value;
  console.log(username, password, favorite);

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
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password-input");
  const passwordToggle = document.getElementById("password-toggle");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordToggle.style.backgroundImage =
      "url('../../static/PozeDiverse/8466805.png')";
  } else {
    passwordInput.type = "password";
    passwordToggle.style.backgroundImage =
      "url('../../static/PozeDiverse/8466805.png')";
  }
}
