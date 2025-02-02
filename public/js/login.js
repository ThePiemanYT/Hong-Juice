document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
          document.getElementById('message').textContent = 'Login successful!';
          document.getElementById('message').style.color = 'green';
          localStorage.setItem('token', result.token);
          window.location.href = '/protected.html';
      } else {
          document.getElementById('message').textContent = result.message || 'Login failed';
      }
  } catch (error) {
      document.getElementById('message').textContent = 'An error occurred. Please try again.';
  }
});
