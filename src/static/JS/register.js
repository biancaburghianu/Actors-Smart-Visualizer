const registerForm = document.getElementById("form");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username, password);

  try {
    const response = await fetch("http://localhost:3456/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
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
      "url('../../static/Images/eye-icon-off.png')";
  } else {
    passwordInput.type = "password";
    passwordToggle.style.backgroundImage =
      "url('../../static/Images/eye-icon.png')";
  }
}
