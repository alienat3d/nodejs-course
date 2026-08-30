const sendLogin = async () => {
  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;

  try {
    // ? 11.17 There is another thing we have to look at, as it can cause the issues. For that we'll get to this file for the Frontend UI. So when we use fetch method we'll need to include into the options the "credentials" option to have fetch send the cookie (and if we use "axios", I believe, there is a "withCredentials" flag that needs to be set as well, and we'll do that in a future tutorial).
    const response = await fetch("http://localhost:3500/auth", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({login, password}),
    });
    if (!response.ok) {
      if (response.status === 401) {
        return await sendRefreshToken();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.log(err.stack);
    displayError();
  }
};