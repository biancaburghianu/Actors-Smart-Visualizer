const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username, password);

  try {
    const response = await fetch("http://localhost:3456/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const authHeader = response.headers.get("Authorization");
      console.log(authHeader);
      if (authHeader) {
        const token = authHeader.split(" ")[1];
        console.log(token);
        localStorage.setItem("token", token);
        window.location.href = "home.html";
      }
    } else if (response.status === 401) {
      alert("Username sau parola sunt incorecte!");
    }
  } catch (error) {
    console.error(error);
  }
});
