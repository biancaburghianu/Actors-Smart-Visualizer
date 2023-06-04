const changePasswordForm = document.getElementById("form");

changePasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const favorite = document.getElementById("favorite").value;
  const newPassword = document.getElementById("new-password").value;
  if (newPassword.length < 10) {
    alert("Parola trebuie sa aiba minim 10 caractere!");
  } else changePassword();

  async function changePassword() {
    try {
      const response = await fetch("http://localhost:3456/changePassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, favorite, newPassword }),
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
  }
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('new-password');
  const eyeIcon = document.getElementById('eye');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }
}
