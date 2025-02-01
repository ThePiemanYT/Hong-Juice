document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
      document.getElementById('message').textContent = 'Passwords do not match!';
      document.getElementById('message').style.color = 'red';
      return;
  }

  try {
      const response = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
          document.getElementById('message').textContent = 'Registration successful!';
          document.getElementById('message').style.color = 'green';
          window.location.href = '/login.html';
      } else {
          document.getElementById('message').textContent = result.message || 'Registration failed';
      }
  } catch (error) {
      document.getElementById('message').textContent = 'An error occurred. Please try again.';
  }
});
